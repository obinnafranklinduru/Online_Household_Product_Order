const { CustomerRepository } = require("../database");
const { FormatData, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } = require('../utils');

// Business logic for customer-related operations
class CustomerService {

    constructor() {
        // Initialize the repository for interacting with the database
        this.repository = new CustomerRepository();
    }

    // Sign in a customer with provided email and password
    async SignIn(userInputs) {
        const { email, password } = userInputs;
        
        // Find the customer in the database by email
        const existingCustomer = await this.repository.FindCustomer({ email });

        if (existingCustomer) {
            // Validate the provided password
            const validPassword = await ValidatePassword(password, existingCustomer.password, existingCustomer.salt);

            if (validPassword) {
                // Generate a JWT token upon successful sign-in
                const token = await GenerateSignature({
                    email: existingCustomer.email,
                    _id: existingCustomer._id
                });

                return FormatData({ id: existingCustomer._id, token });
            }
        }

        // Return null data if sign-in is unsuccessful
        return FormatData(null);
    }

    // Sign up a new customer with provided email, password, and phone
    async SignUp(userInputs) {
        const { email, password, phone } = userInputs;

        // Generate a random salt for password hashing
        let salt = await GenerateSalt();
        // Hash the user's password with the generated salt
        let userPassword = await GeneratePassword(password, salt);

        // Create a new customer in the database
        const existingCustomer = await this.repository.CreateCustomer({ email, password: userPassword, phone, salt });

        // Generate a JWT token for the newly created customer
        const token = await GenerateSignature({
            email: email,
            _id: existingCustomer._id
        });
        return FormatData({ id: existingCustomer._id, token });
    }

    // Add a new address for a customer
    async AddNewAddress(_id, userInputs) {
        const { street, postalCode, city, country } = userInputs;

        // Create a new address in the database
        const addressResult = await this.repository.CreateAddress({ _id, street, postalCode, city, country })
        return FormatData(addressResult);
    }

    // Get the profile details of a customer
    async GetProfile(id) {
        // Find a customer by ID in the database
        const existingCustomer = await this.repository.FindCustomerById({ id });
        return FormatData(existingCustomer);
    }

    // Get shopping details for a customer
    async GetShopingDetails(id) {
        const existingCustomer = await this.repository.FindCustomerById({ id });

        if (existingCustomer) {
            // Implement logic to retrieve shopping details (e.g., orders)
            return FormatData(existingCustomer);
        }

        // Return an error message if the customer is not found
        return FormatData({ msg: 'Error' });
    }

    // Get the wishlist items for a customer
    async GetWishList(customerId) {
        const wishListItems = await this.repository.Wishlist(customerId);
        return FormatData(wishListItems);
    }

    // Add a product to the customer's wishlist
    async AddToWishlist(customerId, product) {
        const wishlistResult = await this.repository.AddWishlistItem(customerId, product);
        return FormatData(wishlistResult);
    }

    // Manage the customer's shopping cart (add or remove items)
    async ManageCart(customerId, product, qty, isRemove) {
        const cartResult = await this.repository.AddCartItem(customerId, product, qty, isRemove);
        return FormatData(cartResult);
    }

    // Manage customer's orders
    async ManageOrder(customerId, order) {
        const orderResult = await this.repository.AddOrderToProfile(customerId, order);
        return FormatData(orderResult);
    }

    // Subscribe to events related to customer actions (e.g., wishlist, cart, order)
    async SubscribeEvents(payload) {
        console.log('Triggering.... Customer Events')

        // Parse the payload to extract event and data
        const { event, data } = JSON.parse(payload);
        const { userId, product, order, qty } = data;

        // Perform actions based on the received event
        switch (event) {
            case 'ADD_TO_WISHLIST':
            case 'REMOVE_FROM_WISHLIST':
                this.AddToWishlist(userId, product)
                break;
            case 'ADD_TO_CART':
                this.ManageCart(userId, product, qty, false);
                break;
            case 'REMOVE_FROM_CART':
                this.ManageCart(userId, product, qty, true);
                break;
            case 'CREATE_ORDER':
                this.ManageOrder(userId, order);
                break;
            default:
                break;
        }
    }
}

module.exports = CustomerService;