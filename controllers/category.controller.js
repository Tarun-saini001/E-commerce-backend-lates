const categoryService = require("../services/category.services")

exports.getCategories = async (req, res) => {
    try {
        const data = await categoryService.getCategories(req);

        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }
    } catch (error) {
        console.log('error:(getCategories controller) ', error);
        res.status(error.status || 500).json({ message: error.message });
    }
}