const { CustomerModel, AddressModel } = require('../models');

// Repository handling database operations for customers
class CustomerRepository {

    // Create a new customer in the database
    async CreateCustomer({ email, password, phone, salt }) {
        try {
            const customer = new CustomerModel({
                email,
                password,
                salt,
                phone,
                address: []
            });

            const customerResult = await customer.save();
            return customerResult;
        } catch (error) {
            console.error('Error creating customer:', error);
            throw new Error('Unable to create customer');
        }
    }

    // Create a new address for a customer
    async CreateAddress({ _id, street, postalCode, city, country }) {
        try {
            const profile = await CustomerModel.findById(_id);

            if (!profile) {
                throw new Error('Customer not found');
            }

            const newAddress = new AddressModel({
                street,
                postalCode,
                city,
                country
            });

            await newAddress.save();

            profile.address.push(newAddress);

            return await profile.save();
        } catch (error) {
            console.error('Error creating address:', error);
            throw new Error('Unable to create address');
        }
    }

    // Find a customer by email
    async FindCustomer({ email }) {
        try {
            const existingCustomer = await CustomerModel.findOne({ email });
            return existingCustomer;
        } catch (error) {
            console.error('Error finding customer by email:', error);
            throw new Error('Unable to find customer by email');
        }
    }

    // Find a customer by ID and populate the 'address' field
    async FindCustomerById({ id }) {
        try {
            const existingCustomer = await CustomerModel.findById(id)
                .populate('address');
            
            return existingCustomer;
        } catch (error) {
            console.error('Error finding customer by ID:', error);
            throw new Error('Unable to find customer by ID');
        }
    }

    // Retrieve wishlist items for a customer
    async Wishlist(customerId) {
        try {
            const profile = await CustomerModel.findById(customerId);
            return profile.wishlist;
        } catch (error) {
            console.error('Error retrieving wishlist:', error);
            throw new Error('Unable to retrieve wishlist');
        }
    }

    // Add an item to the customer's wishlist
    async AddWishlistItem(customerId, { _id, name, desc, price, available, banner }) {
        try {
            const product = { _id, name, desc, price, available, banner };

            const profile = await CustomerModel.findById(customerId);

            if (!profile) {
                throw new Error('Customer not found');
            }

            let wishlist = profile.wishlist;
            
            const existingItem = wishlist.find(item => item._id.toString() === product._id.toString());

            if (existingItem) {
                // If the item exists, remove it
                wishlist = wishlist.filter(item => item._id.toString() !== product._id.toString());
            }

            wishlist.push(product);
            profile.wishlist = wishlist;

            const profileResult = await profile.save();
            return profileResult.wishlist;
        } catch (error) {
            console.error('Error adding wishlist item:', error);
            throw new Error('Unable to add wishlist item');
        }
    }

    // Add an item to the customer's cart
    async AddCartItem(customerId, { _id, name, price, banner }, qty, isRemove) {
        try {
            const profile = await CustomerModel.findById(customerId).populate('cart');

            if (!profile) {
                throw new Error('Customer not found');
            }

            const cartItem = {
                product: { _id, name, price, banner },
                unit: qty,
            };

            let cartItems = profile.cart;

            const existingItem = cartItems.find(item => item.product._id.toString() === _id.toString());

            if (existingItem) {
                // If the item exists, remove it or update quantity
                isRemove ? cartItems = cartItems.filter(item => item.product._id.toString() !== _id.toString()) : existingItem.unit = qty;
            } else {
                cartItems.push(cartItem);
            }

            profile.cart = cartItems;

            return await profile.save();
        } catch (error) {
            console.error('Error adding cart item:', error);
            throw new Error('Unable to add cart item');
        }
    }

    // Add an order to the customer's profile
    async AddOrderToProfile(customerId, order) {
        try {
            const profile = await CustomerModel.findById(customerId);

            if (!profile) {
                throw new Error('Customer not found');
            }

            // Ensure orders array is initialized
            if (!profile.orders) {
                profile.orders = [];
            }

            profile.orders.push(order);

            profile.cart = []; // Clear the cart after placing an order

            const profileResult = await profile.save();
            return profileResult;
        } catch (error) {
            console.error('Error adding order to profile:', error);
            throw new Error('Unable to add order to profile');
        }
    }
}

module.exports = CustomerRepository;