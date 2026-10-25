// authController
const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/authService");
const Apiresponse = require("../utils/ApiResponse");

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    res.status(201).json(new Apiresponse(true, "User registered successfully", user));
});

const login = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } =
        await authService.login(req.body);

    if (refreshToken) {
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    }

    res.status(200).json(
        new Apiresponse(true, "User logged in successfully", {
            user,
            accessToken,
            refreshToken,
        })
    );
});

const refreshToken = asyncHandler(async (req, res) => {
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const result = await authService.refreshToken(rawToken);

    if (result.refreshToken) {
        res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);
    }

    res.json(
        new Apiresponse(true, "Token refreshed", {
            token: result.accessToken,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        })
    );
});

const logout = asyncHandler(async (req, res) => {
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const userId = req.user?._id;
    await authService.logout(userId, rawToken);

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth",
    });

    res.json(new Apiresponse(true, "User logged out successfully", null));
});

const verifyEmail = asyncHandler(async (req, res) => {
    const token = req.params.token || req.body.token;
    const result = await authService.verifyEmail(token);

    res.status(200).json(new Apiresponse(200, result.message));
});

const resendVerification = asyncHandler(async (req, res) => {
    const result = await authService.resendVerification(req.body.email);

    res.status(200).json(new Apiresponse(200, result.message));
});

const forgotPassword = asyncHandler(async (req, res) => {
    const result = await authService.forgotPassword(req.body.email);

    res.status(200).json(new Apiresponse(200, result.message));
});

const resetPassword = asyncHandler(async (req, res) => {
    const token = req.params.token || req.body.token;
    const result = await authService.resetPassword(
        token,
        req.body.password
    );

    res.status(200).json(new Apiresponse(200, result.message));
});

const sendOtp = asyncHandler(async (req, res) => {
    const result = await authService.sendOtp({
        target: req.body.target,
        purpose: req.body.purpose,
        userId: req.user?._id || req.body.userId,
        email: req.body.email,
    });

    res.status(200).json(new Apiresponse(200, result.message, result.rawOtp ? { rawOtp: result.rawOtp } : null));
});

const verifyOtp = asyncHandler(async (req, res) => {
    const result = await authService.verifyOtp({
        target: req.body.target,
        purpose: req.body.purpose,
        otp: req.body.otp,
    });

    res.status(200).json(new Apiresponse(200, result.message, result));
});

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    sendOtp,
    verifyOtp
};

