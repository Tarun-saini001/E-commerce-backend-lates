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
const tokenRepo = require("../repository/token.repository")


exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await userRepo.findUserByEmail(email);

        console.log('existingUser: ', existingUser);
        if (existingUser) {
            return res.status(400).json({ message: "User already registered" });
        }

        const otp = generateOTP();
        console.log('otp: ', otp);

        // const hashedPassword = await bcrypt.hash(password.toString(), 10);
        // const hashedConfirmPassword = await bcrypt.hash(confirmPassword.toString(), 10);

        await otpRepo.saveOTP({ email, otp, otpType: OTP_FOR.REGISTER });


        await sendOTPEmail(email, otp)
        return res.status(200).json({ message: "OTP sent to your email" });

    } catch (error) {
        console.log("something get wrong", error)
        return res.status(500).json({ message: "server error" })
    }
}


exports.sendOtp = async (req, res) => {

    try {

        const { email, otpType } = req.body;

        if (!email || !otpType) {
            return res.status(400).json({
                message: "Email and otpType are required"
            });
        }

        switch (Number(otpType)) {

            case OTP_FOR.REGISTER: {

                const existingUser = await userRepo.findUserByEmail(email);

                if (existingUser) {
                    return res.status(400).json({
                        message: "User already exists"
                    });
                }

                break;
            }

            case OTP_FOR.LOGIN: {

                const userData = await userRepo.findUserByEmail(email);

                if (!userData) {
                    return res.status(404).json({
                        message: "Account not found"
                    });
                }

                break;
            }

            case OTP_FOR.FORGOT_PASSWORD: {

                const userData = await userRepo.findUserByEmail(email);

                if (!userData) {
                    return res.status(404).json({
                        message: "Account not found"
                    });
                }

                break;
            }

            default:
                return res.status(400).json({
                    message: "Invalid OTP type"
                });
        }

        const otp = generateOTP();
        console.log('otp: ', otp);

        await otpRepo.saveOTP({ email, otp, otpType });

        await sendOTPEmail(email, otp);

        return res.status(200).json({
            message: "OTP sent successfully",
        });

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
            return res.status(400).json({
                message: "Email, OTP and otpType are required"
            });
        }

        const otpDoc = await otpRepo.findOTP({ email, otp, otpType });

        if (!otpDoc) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        // check expiration
        if (otpDoc.expiresAt < new Date()) {
            await otpRepo.deleteOTP(otpDoc._id);
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        switch (Number(otpType)) {

            // register
            case OTP_FOR.REGISTER: {

                if (!name || !password || !confirmPassword) {
                    return res.status(400).json({
                        message: "Name, password and confirmPassword are required"
                    });
                }

                if (password !== confirmPassword) {
                    return res.status(400).json({
                        message: "Passwords do not match"
                    });
                }

                const existingUser = await userRepo.findUserByEmail(email);

                if (existingUser) {
                    return res.status(400).json({
                        message: "User already exists"
                    });
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

                return res.status(200).json({
                    message: "User verified and registered successfully"
                });
            }

            case OTP_FOR.LOGIN:

            // forgot password
            case OTP_FOR.FORGOT_PASSWORD: {

                const userData = await userRepo.findUserByEmail(email);

                if (!userData) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }

                await otpRepo.deleteOTP(otpDoc._id);

                // generate temporary token 
                const tempToken = jwt.sign(
                    { id: userData._id, email },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "10m" }
                );

                return res.status(200).json({
                    message: "OTP verified",
                    tempToken
                });
            }

            default:
                return res.status(400).json({
                    message: "Invalid OTP type"
                });
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
            return res.status(404).json({ message: "User not found" })
        }
        const isMatch = await bcrypt.compare(body.password, userData.password);
        console.log('isMatch: ', isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password" })
        }
        const accessToken = await generateAccessToken(userData);
        const refreshToken = await generateRefreshToken(userData);

        await tokenRepo.createToken(
            refreshToken,
            userData._id,
            Date.now() + 7 * 24 * 60 * 60 * 1000
        )

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ message: "Login successful" })
    } catch (error) {
        console.log("something get wrong", error)
        return res.status(500).json({ message: "server error" })
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken || typeof refreshToken !== "string") {
            return res.status(401).json({ message: "Refresh token missing" })
        }

        console.log('refreshToken: ', refreshToken);

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY)

        //check token in db 
        const tokenDoc = await tokenRepo.findToken(refreshToken);

        if (!tokenDoc) {
            return res.status(403).json({
                message: "Invalid refresh token"
            });
        }

        //check token is expired or not
        if (tokenDoc.expiresAt < Date.now()) {
            await tokenRepo.deleteTokenById(tokenDoc._id)
            return res.status(403).json({
                message: "Refresh token expired"
            })
        }

        const userData = await userRepo.findUserById(decoded.id);

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
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
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.status(200).json({ message: "Access token refreshed" });
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

        return res.status(200).json({ message: "Logout successful" })

    } catch (error) {
        console.log("logout error:", error);

        return res.status(500).json({
            message: "Logout failed"
        });
    }
}

exports.me = async (req, res) => {
    try {
        const id = req.user;
        const userData = await userRepo.getUserWithoutPassword(id)
        if (!userData) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({
            data: userData,
            message: "User fetched successfully"
        })
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
            return res.status(400).json({ message: "New password and confirm password are required" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const userId = req.user;
        const userData = await userRepo.findUserById(userId);
        if (!userData) return res.status(404).json({ message: "User not found" });

        if (!isResetPassword) {
            // normal password change, validate old password
            if (!oldPassword) {
                return res.status(400).json({ message: "Old password is required" });
            }

            const isMatch = await bcrypt.compare(oldPassword, userData.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Old password is incorrect" });
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        userData.password = hashedPassword;
        await userData.save();

        return res.status(200).json({ message: isResetPassword ? "Password reset successfully" : "Password changed successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}


