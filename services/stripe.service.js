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
        const SHIPPING_FEE = 15;
        const TAX_RATE = 0.05;

        const subtotal = cartData.items.reduce(
            (sum, item) => sum + item.productId.price * item.quantity,
            0
        );

        const tax = subtotal * TAX_RATE;
        const totalAmount = subtotal + SHIPPING_FEE + tax;

        if (totalAmount < MIN_AMOUNT) {
            return {
                status: "Error",
                message: "Minimum order amount is ₹50",
            };
        }

        const productItems = cartData.items.map(item => ({
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

        const extraItems = [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Shipping Fee",
                    },
                    unit_amount: Math.round(SHIPPING_FEE * 100),
                },
                quantity: 1,
            },
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Tax (5%)",
                    },
                    unit_amount: Math.round(tax * 100),
                },
                quantity: 1,
            }
        ];

        const line_items = [...productItems, ...extraItems];

        console.log('process.env.CLIENT_URL: ', process.env.CLIENT_URL);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",

            success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/cart`,

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