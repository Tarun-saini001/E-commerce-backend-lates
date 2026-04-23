const Stripe = require("stripe");
const cart = require("../models/cart");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req) => {
    try {
        const userId = req.user.id;
        const body = req.body;
        const cartData = await cart.findOne({ user: userId }).populate("items.productId");

        if (!cartData || cartData.items.length === 0) {
            return {
                status: "RecordNotFound",
                message: "Cart is empty",
            };
        }

        const MIN_AMOUNT = 50;

        const totalAmount = cartData.items.reduce(
            (sum, item) => sum + item.productId.price * item.quantity,
            0
        );

        if (totalAmount < MIN_AMOUNT) {
            return {
                status: "Error",
                message: "Minimum order amount is ₹50",
            };
        }

        const line_items = cartData.items.map(item => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.productId.title,
                    images: [item.productId.thumbnail],
                },
                unit_amount: Math.round(item.productId.price * 100),
            },
            quantity: item.quantity,
        }));

        console.log('process.env.CLIENT_URL: ', process.env.CLIENT_URL);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",

            success_url: `${process.env.ALLOW_ORIGIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.ALLOW_ORIGIN}/cart`,

            metadata: {
                userId: userId.toString(),
                shippingMethod: body.shippingMethod || "",
                billingDetails: JSON.stringify(body.billingDetails || {}),
            },
        });

        return {
            status: "Success",
            data: { url: session.url },
        };

    } catch (error) {
        console.log("Stripe error:", error);
        return { status: "Error", message: "Stripe session failed" };
    }
};