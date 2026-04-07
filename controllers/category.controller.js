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

exports.addCategory = async (req, res) => {
    try {
        const data = await categoryService.addCategory(req);

        if (data.status == "Validation") { res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}


exports.deleteCategory = async (req, res) => {
    try {
        const data = await categoryService.deleteCategory(req);

        if (data.status == "RecordNotFound") { res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const data = await categoryService.updateCategory(req);

        if (data.status == "RecordNotFound") { res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const data = await categoryService.getAllCategories(req);

        if (data.status == "RecordNotFound") { res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}


