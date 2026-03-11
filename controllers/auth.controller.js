const authService = require("../services/auth.services");

exports.register = async (req, res) => {
    try {
        const data = await authService.register(req,res);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.sendOTP = async (req, res) => {
    try {
        const data = await authService.sendOtp(req,res);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const data = await authService.verifyOtp(req,res);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const data = await authService.login(req,res);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const data = await authService.refreshToken(req,res);
        res.status(200).json(data);
    } catch (error) {
        res.status(error.status || 403).json({ message: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const data = await authService.logout(req,res);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const data = await authService.me(req,res);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const data = await authService.changePassword(req,res);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};