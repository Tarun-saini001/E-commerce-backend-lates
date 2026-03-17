
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
console.log(result);
    if (!result.success) {
        const errors = result.error?.errors || []; 
        
        return res.status(400).json({
            success: false,
            errors: errors.map(err => ({
                field: err.path.join("."), // This maps the field to the path
                message: err.message, // And the error message
            })),
        });
    }

    req.body = result.data; 
    next();
};

module.exports = validate;