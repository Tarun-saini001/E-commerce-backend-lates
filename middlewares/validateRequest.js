
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    console.log('result: ', result);
    if (!result.success) {
        const errors = result.error?.issues || []; 
        console.log('errors: ', errors);
        
        return res.status(400).json({
            success: false,
            message: errors.map(err => ({
                field: err.path.join("."), // This maps the field to the path
                message: err.message, // And the error message
            })),
        });
    }

    req.body = result.data; 
    next();
};

module.exports = validate;