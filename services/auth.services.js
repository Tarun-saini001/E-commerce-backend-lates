const router = require("express").Router();
const user = require("../models/user");
const token = require("../models/token")
const OTP = require("../models/otp")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const generateRefreshToken = require("../utils/generateRefreshToken");
const generateAccessToken = require("../utils/generateAccessToken");
const verifyToken = require("../middlewares/verifyToken");
const generateOTP = require("../utils/generateOTP");
const sendOTPEmail = require("../utils/email");
const { OTP_FOR } = require("../config/constants");

const userRepo = require("../repository/user.repository")
const otpRepo = require("../repository/otp.repository")
const tokenRepo = require("../repository/token.repository");
const product = require("../models/product");
const Order = require("../models/order");


exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return {
                status: "Validation",
                message: "Passwords do not match"
            }
        }

        const existingUser = await userRepo.findUserByEmail(email);

        console.log('existingUser: ', existingUser);
        if (existingUser) {
            return {
                status: "Validation",
                message: "User alredy registered"
            }
        }

        const otp = generateOTP();
        console.log('otp: ', otp);

        // const hashedPassword = await bcrypt.hash(password.toString(), 10);
        // const hashedConfirmPassword = await bcrypt.hash(confirmPassword.toString(), 10);

        await otpRepo.saveOTP({ email, otp, otpType: OTP_FOR.REGISTER });


        await sendOTPEmail(email, otp)
        return {
            status: "success",
            message: "OTP sent to your email"
        }

    } catch (error) {
        console.log("something get wrong", error)
        return res.status(500).json({ message: "server error" })
    }
}


exports.sendOtp = async (req, res) => {

    try {

        const { email, otpType } = req.body;

        if (!email || !otpType) {
            return {
                status: "Validation",
                message: "Email and otpType are required"
            }

        }

        switch (Number(otpType)) {

            case OTP_FOR.REGISTER: {

                const existingUser = await userRepo.findUserByEmail(email);

                if (existingUser) {
                    return {
                        status: "Validation",
                        message: "User alredy registered"
                    }
                }

                break;
            }

            case OTP_FOR.LOGIN: {

                const userData = await userRepo.findUserByEmail(email);

                if (!userData) {
                    return {
                        status: "RecordNotFound",
                        message: "Account not found"
                    }
                }
                break;
            }

            case OTP_FOR.FORGOT_PASSWORD: {

                const userData = await userRepo.findUserByEmail(email);

                if (!userData) {
                    return {
                        status: "RecordNotFound",
                        message: "Account not found"
                    }
                }

                break;
            }

            default:
                return {
                    status: "Validation",
                    message: "Invalid OTP type"
                }
        }

        const generatedOTP = generateOTP();
        const otp = String(generatedOTP);

        console.log('otp: ', otp);
        console.log('otp: ', typeof otp);

        await otpRepo.saveOTP(email, otp, otpType);
        console.log("reach 1");
        await sendOTPEmail(email, otp);
        console.log("reach 2");

        return {
            status: "Success",
            message: "OTP sent successfully",
        };

    } catch (error) {

        console.log("Send OTP error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, otp, otpType } = req.body;

        if (!email || !otp || !otpType) {
            return {
                status: "Validation",
                message: "Email, OTP and otpType are required"
            }

        }

        const otpDoc = await otpRepo.findOTP(email, otp, otpType);

        if (!otpDoc) {
            return {
                status: "Validation",
                message: "Invalid OTP"
            }
        }

        // check expiration
        if (otpDoc.expiresAt < new Date()) {
            await otpRepo.deleteOTP(otpDoc._id);
            return {
                status: "Validation",
                message: "OTP expired"
            }
        }

        switch (Number(otpType)) {

            // register
            case OTP_FOR.REGISTER: {

                if (!name || !password || !confirmPassword) {
                    return {
                        status: "Validation",
                        message: "Name, password and confirmPassword are required"
                    }

                }

                if (password !== confirmPassword) {
                    return {
                        status: "Validation",
                        message: "Passwords do not match"
                    }

                }

                const existingUser = await userRepo.findUserByEmail(email);

                if (existingUser) {
                    return {
                        status: "Validation",
                        message: "User already exists"
                    }
                }

                const hashedPassword = await bcrypt.hash(password.toString(), 10)
                const hashedConfirmPassword = await bcrypt.hash(confirmPassword.toString(), 10);
                await userRepo.createUser({
                    name,
                    email,
                    password: hashedPassword,
                    confirmPassword: hashedConfirmPassword,
                    isVerified: true
                });

                await otpRepo.deleteOTP(otpDoc._id);

                return {
                    status: "Success",
                    message: "User verified and registered successfully"
                };

            }

            case OTP_FOR.LOGIN:

            // forgot password
            case OTP_FOR.FORGOT_PASSWORD: {

                const userData = await userRepo.findUserByEmail(email);

                if (!userData) {
                    return {
                        status: "RecordNotFound",
                        message: "User not found"
                    }
                }

                await otpRepo.deleteOTP(otpDoc._id);

                // generate temporary token 
                const tempToken = jwt.sign(
                    { id: userData._id, email },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "10m" }
                );

                return {
                    status: "Success",
                    message: "OTP verified",
                    data: tempToken
                }

            }

            default:
                return {
                    status: "Validation",
                    message: "Invalid OTP type"
                }
        }

    } catch (error) {
        console.log("verify OTP error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}

exports.login = async (req, res) => {
    try {
        const body = req.body;
        console.log('body: ', typeof body.password);
        const userData = await userRepo.findUserByEmail(body.email);
        // console.log('userData: ', typeof userData.password);
        if (!userData) {
            return {
                status: "RecordNotFound",
                message: "User not found"
            }
        }

        if (!userData.isActive) {
            return {
                status: "Blocked",
                message: "Account Blocked"
            };
        }

        const isMatch = await bcrypt.compare(body.password, userData.password);
        console.log('isMatch: ', isMatch);
        if (!isMatch) {
            return {
                status: "Validation",
                message: "Invalid Email or Password"
            }

        }
        const accessToken = await generateAccessToken(userData);
        console.log('accessToken: ', accessToken);
        const refreshToken = await generateRefreshToken(userData);
        console.log('refreshToken: ', refreshToken);

        await tokenRepo.createToken(
            refreshToken,
            userData._id,
            Date.now() + 7 * 24 * 60 * 60 * 1000
        )

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "none",
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "none",
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return {
            status: "Success",
            message: "Login successful"
        }
    } catch (error) {
        console.log("something get wrong", error)
        return res.status(500).json({ message: "server error" })
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken || typeof refreshToken !== "string") {
            return {
                status: "Unauthorised",
                message: "Refresh token missing"
            }

        }

        console.log('refreshToken: ', refreshToken);

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY)

        //check token in db 
        const tokenDoc = await tokenRepo.findToken(refreshToken);

        if (!tokenDoc) {
            return {
                status: "Validation",
                message: "Invalid refresh token"
            }

        }

        //check token is expired or not
        if (tokenDoc.expiresAt < Date.now()) {
            await tokenRepo.deleteTokenById(tokenDoc._id)
            return {
                status: "Validation",
                message: "Refresh token expired"
            }

        }

        const userData = await userRepo.findUserById(decoded.id);

        if (!userData) {
            return {
                status: "RecordNotFound",
                message: "User not found"
            }
        }

        //deleting old token
        await tokenRepo.deleteTokenById(tokenDoc._id);

        // generate new token
        const newRefreshToken = await generateRefreshToken(userData);
        const accessToken = await generateAccessToken(userData);

        //save newRefreshToken in db
        await tokenRepo.createToken(
            newRefreshToken,
            userData._id,
            Date.now() + 7 * 24 * 60 * 60 * 1000
        )


        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "none",
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "none",
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        return {
            status: "Success",
            message: "Access token refreshed"
        }

    } catch (error) {
        console.log("refresh token error:", error);

        return res.status(403).json({
            message: "Invalid refresh token"
        });

    }
}

exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await tokenRepo.deleteToken(refreshToken)
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken")

        return {
            status: "Success",
            message: "Logout successful"
        }

    } catch (error) {
        console.log("logout error:", error);

        return res.status(500).json({
            message: "Logout failed"
        });
    }
}

exports.me = async (req, res) => {
    try {
        console.log("reached in service");
        const id = req.user.id;
        const userData = await userRepo.getUserWithoutPassword(id)
        if (!userData) {
            return {
                status: "RecordNotFound",
                message: "User not found"
            }
        }

        return {
            status: "Success",
            data: userData,
            message: "User fetched successfully"
        }
    } catch (error) {
        console.log("getUser error", error);
        return res.status(500).json({
            message: "server error"
        })
    }
}


exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword, isResetPassword } = req.body;

        if (!newPassword || !confirmPassword) {
            return {
                status: "Validation",
                message: "New password and confirm password are required"
            }
        }

        if (newPassword !== confirmPassword) {
            return {
                status: "Validation",
                message: "Passwords do not match"
            }
        }

        const userId = req.user.id;
        const userData = await userRepo.findUserById(userId);
        if (!userData) {
            return {
                status: "RecordNotFound",
                message: "User not found"
            }
        }

        if (!isResetPassword) {
            // normal password change, validate old password
            if (!oldPassword) {
                return {
                    status: "Validation",
                    message: "Old password is required"
                }

            }

            const isMatch = await bcrypt.compare(oldPassword, userData.password);
            if (!isMatch) {
                return {
                    status: "Validation",
                    message: "Old password is incorrect"
                }
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        userData.password = hashedPassword;
        await userData.save();

        return {
            status: "Success",
            message: isResetPassword ? "Password reset successfully" : "Password changed successfully"
        };
    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}


exports.getAllUsers = async (req, res) => {
    try {


        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;

        const skip = (page - 1) * limit;

        const users = await userRepo.getAllUsers(skip, limit);
        console.log('users: ', users);

        const totalUsers = await userRepo.getUsersCount();

        if (!users || users.length === 0) {
            return {
                status: "Success",
                message: "Users fetched successfully",
                data: []
            };
        }

        return {
            status: "Success",
            data: {
                users: users,
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers: totalUsers
            },
            message: "Users fetched successfully"
        };

    } catch (error) {
        console.log("getAllUsers error:", error);
        return {
            status: "Error", message: "Failed to get all users"
        };
    }
};

exports.toggleUserActiveStatus = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return {
                status: "Validation",
                message: "User ID is required"
            };
        }

        const userData = await userRepo.findUserById(userId);

        if (!userData) {
            return {
                status: "RecordNotFound",
                message: "User not found"
            };
        }

        userData.isActive = !userData.isActive;

        await userData.save();

        return {
            status: "Success",
            message: `User is now ${userData.isActive ? "Active" : "Inactive"}`,
            data: {
                userId: userData._id,
                isActive: userData.isActive
            }
        };

    } catch (error) {
        console.error("Toggle user active error:", error);
        return {
            status: "Error", message: "Action failed"
        };
    }
};



exports.getDashboardStats = async () => {
    try {

        const [totalUsers, totalProducts, totalOrders, revenueResult] =
            await Promise.all([
                user.countDocuments(),
                product.countDocuments(),
                Order.countDocuments(),

                Order.aggregate([
                    {
                        $match: { orderStatus: "completed" }
                    },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: "$total" }
                        }
                    }
                ])
            ]);

        const totalRevenue =
            revenueResult.length > 0 ? revenueResult[0]?.totalRevenue : 0;
        console.log('totalRevenue: ', totalRevenue);
        console.log('totalUsers: ', totalUsers);
        console.log('totalProducts: ', totalProducts);
        console.log('totalOrders: ', totalOrders);

        return {
            status: "Success",
            message: "Dashboard data fetched successfully",
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
            },
        };
    } catch (error) {
        console.log("Dashboard Service Error:", error.message);

        return {
            status: "Error",
            message: "Failed to fetch dashboard data",
        };
    }
};