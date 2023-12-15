const { ProductRepository } = require("../database");
const { FormateData } = require("../utils");

// Business logic for products
class ProductService {
    constructor(){
        this.repository = new ProductRepository();
    }
    
    /**
     * Create a new product.
     * @param {Object} productInputs - Product details to be created.
     * @returns {Promise<Object>} - Result of the created product.
     */
    async CreateProduct(productInputs){
        try {
            const productResult = await this.repository.CreateProduct(productInputs);
            return FormateData(productResult);
        } catch (error) {
            console.error('Error creating product:', error);
            return FormateData({ error: 'Failed to create product' });
        }
    }
    
    /**
     * Get all products.
     * @returns {Promise<Object>} - Result containing products and categories.
     */
    async GetProducts(){
        try {
            const products = await this.repository.Products();

            let categories = {};
    
            products.forEach(({ type }) => {
                categories[type] = type;
            });
            
            return FormateData({
                products,
                categories:  Object.keys(categories)  
            });
        } catch (error) {
            console.error('Error fetching products:', error);
            return FormateData({ error: 'Failed to fetch products' });
        }
    }

    /**
     * Get product details by ID.
     * @param {string} productId - ID of the product.
     * @returns {Promise<Object>} - Result containing product details.
     */
    async GetProductDescription(productId){
        try {
            const product = await this.repository.FindById(productId);
            return FormateData(product);
        } catch (error) {
            console.error('Error fetching product details:', error);
            return FormateData({ error: 'Failed to fetch product details' });
        }
    }

    /**
     * Get products by category.
     * @param {string} category - Category of the products.
     * @returns {Promise<Object>} - Result containing products in the specified category.
     */
    async GetProductsByCategory(category){
        try {
            const products = await this.repository.FindByCategory(category);
            return FormateData(products);
        } catch (error) {
            console.error('Error fetching products by category:', error);
            return FormateData({ error: 'Failed to fetch products by category' });
        }
    }

    /**
     * Get selected products by their IDs.
     * @param {Array<string>} selectedIds - Array of product IDs.
     * @returns {Promise<Object>} - Result containing selected products.
     */
    async GetSelectedProducts(selectedIds){
        try {
            const products = await this.repository.FindSelectedProducts(selectedIds);
            return FormateData(products);
        } catch (error) {
            console.error('Error fetching selected products:', error);
            return FormateData({ error: 'Failed to fetch selected products' });
        }
    }

    /**
     * Get payload for a product event.
     * @param {string} userId - User ID.
     * @param {string} productId - Product ID.
     * @param {number} qty - Quantity.
     * @param {string} event - Event type.
     * @returns {Promise<Object>} - Result containing payload for the event.
     */
    async GetProductPayload(userId, { productId, qty }, event){
        try {
            const product = await this.repository.FindById(productId);

            if(product){
                const payload = { 
                    event: event,
                    data: { userId, product, qty }
                };
                return FormateData(payload);
            } else {
                return FormateData({ error: 'No product available' });
            }
        } catch (error) {
            console.error('Error generating product payload:', error);
            return FormateData({ error: 'Failed to generate product payload' });
        }
    }
}

module.exports = ProductService;