const wishlistService = require("../services/wishlist.services")

exports.addToCart = async (req, res) => {
    try {
        const data = await wishlistService.addToWishlist(req);

        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.getWishlist = async (req, res) => {
    try {
        const data = await wishlistService.getWishlist(req, res);
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

exports.removeWishlistItem = async (req, res) => {
    try {
        const data = await wishlistService.removeWishlistItem(req);

        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};


exports.toggleWishlist = async (req, res) => {
    try {
        const data = await wishlistService.toggleWishlist(req);

        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
};