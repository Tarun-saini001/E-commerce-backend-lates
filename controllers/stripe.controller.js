const stripeService = require("../services/stripe.service")
exports.createCheckoutSession=async (req,res) => {
    try {
        console.log("in controller");
        const data = await stripeService.createCheckoutSession(req);
        console.log('data: ', data);
        if (data.status == "RecordNotFound") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Validation") { return res.status(400).json({ message: data.message }) }
        if (data.status == "Success") { res.status(200).json({ status: data.status,message: data.message, data: data.data }); }
        if (data.status == "Error") { res.status(500).json({ message: data.message }) }
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}