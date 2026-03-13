const authService = require("../services/auth.services");

exports.register = async (req, res) => {
    try {
        const data = await authService.register(req, res);

        if (data.status == "Validation") { res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message }); }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.sendOTP = async (req, res) => {
    try {
        const data = await authService.sendOtp(req, res);

        if (data.status == "Validation") { res.status(400).json({ message: data.message }) }
        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message }); }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const data = await authService.verifyOtp(req, res);

        if (data.status == "Validation") { res.status(400).json({ message: data.message }) }
        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const data = await authService.login(req, res);
        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Validation") { res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message }); }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const data = await authService.refreshToken(req, res);
        if (data.status == "Unauthorised") { res.status(401).json({ message: data.message }) }
        if (data.status == "Validation") { res.status(400).json({ message: data.message }) }
        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message }); }

    } catch (error) {
        res.status(error.status || 403).json({ message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const data = await authService.logout(req, res);

        if (data.status == "Success") { res.status(200).json({ message: data.message }); }
        else {
            res.status(500).json({ message: "Logout error" })
        }
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const data = await authService.me(req, res);

        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const data = await authService.changePassword(req, res);

        if (data.status == "Validation") { res.status(400).json({ message: data.message }) }
        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message }); }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};