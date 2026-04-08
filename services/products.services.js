
const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const categoryModel = require("../models/category");
const { regex } = require("zod");

exports.getProducts = async (req, res) => {
    try {
        const { category, page = 1, limit = 9, search } = req.query;
        console.log('category: ', category);

        const currentPage = parseInt(page);
        const perPage = parseInt(limit);

        const skip = (currentPage - 1) * perPage;

        let filter = {};
        
        if (category) {
            const categoryData = await categoryModel.findOne({
                name:{ $regex: new RegExp(`^${category}$`,"i")}
            })
            if(categoryData){
                filter.category= categoryData._id
            }else{
                return{
                    status:"Success",
                    message:"No Products Found",
                    data:{
                        products:[],
                        currentPage,
                        totalPages: 0,
                        totalProducts: 0,
                    }
                }
            }
        }
        console.log('filter: ', filter);
        // searching
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), "i");

            filter.$or = [
                { title: searchRegex },
                { categoryName: searchRegex },
            ];
        }


        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(perPage)
        console.log('products: ', products);

        const totalProducts = await Product.countDocuments(filter);

        const totalPages = Math.ceil(totalProducts / perPage);

        return {
            status: "Success",
            message: "Products fetched successfully!",
            data: {
                products,
                currentPage,
                totalPages,
                totalProducts,
            },
        };

    } catch (error) {
        console.log("error: get products service error ", error.message);

        return {
            status: "Error",
            message: "Error fetching product",
        };
    }
};


exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return {
                status: "Validation",
                message: "Invalid ID format"
            };
        }
        const product = await Product.findById(id);



        if (!product) {
            return {
                status: "RecordNotFound",
                message: "Product not found"
            };
        }

        return {
            status: "Success",
            message: "Product fetched successfully",
            data: product,
        };
    } catch (error) {
        console.log('error: ', error.message);
        return {
            status: "Error", message: "Error fetching product by id"
        };
    }
};

exports.createProduct = async (req, res) => {
    try {
        const body = req.body;
        if (!body) {
            return {
                status: "Validation",
                message: "Body missing"
            }
        }

        const exist = await Product.findOne({
            $and: [
                { title: body.title },
                { categoryName: body.categoryName },
                { price: body.price }
            ]
        })

        console.log('req.file: ', req.file);
        if (exist) {
            exist.stock += 1

            if (req.file) {
                exist.thumbnail = `uploads/products/${req.file.filename}`;
            }

            await exist.save();
            return {
                status: "Success",
                message: "Product already exist",
                data: exist
            }
        }
        if (req.file) {
            body.thumbnail = `uploads/products/${req.file.filename}`
        }
        console.log('body.categoryName: ', body.categoryName);

        const isCategoryExist = await category.findOne({ name: body.categoryName })
        console.log('isCategoryExist: ', isCategoryExist);
        if (!isCategoryExist) {
            return {
                status: "RecordNotFound",
                message: "Category not exist"
            }
        }
        body.category = isCategoryExist._id;

        console.log('body: ', body);
        productData = { ...body }
        console.log('productData: ', productData);

        const product = await Product.create(productData);
        console.log('product: ', product);

        return {
            status: "Success",
            message: "Product created successfully",
            data: product,
        };
    } catch (error) {
        console.log('error Failed to create product', error);
        return {
            status: "Error", message: "Failed to create product"
        };

    }
};

exports.updateProduct = async (req, res) => {
    try {
        const body = req.body;
        const productId = req.params.id

        if (!body) {
            return {
                status: "Validation",
                message: "Body missing"
            }
        }
        const product = await Product.findById(productId);

        if (!product) {
            return {
                status: "RecordNotFound",
                message: "Product not found"
            };
        }

        if (req.file) {
            body.thumbnail = `uploads/products/${req.file.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, { $set: body },
            { new: true }
        );
        console.log('updatedProduct: ', updatedProduct);

        return {
            status: "Success",
            message: "Product updated successfully",
            data: updatedProduct
        }

    } catch (error) {
        console.log('error while updating product by Id ', error);
        return {
            status: "Error", message: "Error while updating product by Id"
        };
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return {
                status: "Validation",
                message: "Invalid ID format"
            };
        }

        const product = await Product.findById(id);

        if (!product) {
            return {
                status: "RecordNotFound",
                message: "Product not found"
            };
        }

        await Product.findByIdAndDelete(id);

        return {
            status: "Success",
            message: "Product deleted successfully"
        };

    } catch (error) {
        console.log("error while deleting product ", error.message);

        return {
            status: "Error",
            message: "Error deleting product"
        };
    }
};
