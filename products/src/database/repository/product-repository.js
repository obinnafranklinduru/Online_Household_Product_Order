const { ProductModel } = require("../models");

// Repository handling database operations for products
class ProductRepository {
    /**
     * Create a new product in the database.
     * @param {Object} productData - Product data to be created.
     * @returns {Promise<Object>} - Result of the created product.
     */
    async CreateProduct({ name, desc, type, unit, price, available, supplier, banner }) {
        try {
            const product = new ProductModel({
                name,
                desc,
                type,
                unit,
                price,
                available,
                supplier,
                banner,
            });

            const productResult = await product.save();
            return productResult;
        } catch (error) {
            console.error('Error creating product:', error);
            throw new Error('Failed to create product.');
        }
    }

    /**
     * Retrieve all products from the database.
     * @returns {Promise<Array>} - Array of products.
     */
    async Products() {
        try {
            return await ProductModel.find();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error('Failed to fetch products.');
        }
    }

    /**
     * Find a product by its ID.
     * @param {string} id - Product ID.
     * @returns {Promise<Object|null>} - Product object or null if not found.
     */
    async FindById(id) {
        try {
            return await ProductModel.findById(id);
        } catch (error) {
            console.error('Error finding product by ID:', error);
            throw new Error('Failed to find product by ID.');
        }
    }

    /**
     * Find products by category.
     * @param {string} category - Product category.
     * @returns {Promise<Array>} - Array of products in the specified category.
     */
    async FindByCategory(category) {
        try {
            const products = await ProductModel.find({ type: category });
            return products;
        } catch (error) {
            console.error('Error finding products by category:', error);
            throw new Error('Failed to find products by category.');
        }
    }

    /**
     * Find selected products by their IDs.
     * @param {Array<string>} selectedIds - Array of product IDs.
     * @returns {Promise<Array>} - Array of selected products.
     */
    async FindSelectedProducts(selectedIds) {
        try {
            const products = await ProductModel.find().where('_id').in(selectedIds.map(_id => _id)).exec();
            return products;
        } catch (error) {
            console.error('Error finding selected products:', error);
            throw new Error('Failed to find selected products.');
        }
    }
}

module.exports = ProductRepository;