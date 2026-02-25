import Sale from '../models/sales.model.js';
import Product from '../models/products.model.js';
import Business from '../models/business.model.js'

// -------------------------
// Add a Sale
// -------------------------

const addSale = async (req, res) => {
  try {
    const { productName, quantity, unitPrice } = req.body; // frontend now sends productName
    const userId = req.user.id;

    if (!productName || !quantity || quantity <= 0) {
      return res.status(400).json({
        message: 'Product name and quantity are required, quantity must be > 0'
      });
    }

    // Find user's business
    const business = await Business.findOne({ where: { userId } });
    if (!business) {
      return res.status(404).json({ message: 'Business not found for this user' });
    }

    // Find product by name within this business
    const product = await Product.findOne({
      where: { productName, businessId: business.id }
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found in your business' });
    }

    // Check stock
    if (quantity > product.quantity) {
      return res.status(400).json({ message: 'Not enough stock for this product' });
    }

    const finalUnitPrice = unitPrice ?? product.sellingPrice;
    const totalAmount = quantity * finalUnitPrice;

    // Create sale
    const sale = await Sale.create({
      quantity,
      unitPrice: finalUnitPrice,
      totalAmount,
      productId: product.id, // store actual ID
      businessId: business.id
    });

    // Reduce stock
    await product.update({ quantity: product.quantity - quantity });

    res.status(201).json(sale);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add sale' });
  }
};


// -------------------------
// Find all sales
// -------------------------
const findAllSales = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user's business
    const business = await Business.findOne({ where: { userId } });
    if (!business) {
      return res.status(404).json({ message: 'Business not found for this user' });
    }

    // Filter sales by business
    const whereClause = { businessId: business.id };


    const sales = await Sale.findAll({ where: whereClause });
    res.status(200).json({ sales });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve Sales' });
  }
};

// -------------------------
// Delete a sale
// -------------------------
const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    await Sale.destroy({ where: { id } });
    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete Sale' });
  }
};

// -------------------------
// Get user products (for dropdown in Add Sale form)
// -------------------------
const getUserProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    const business = await Business.findOne({ where: { userId } });
    if (!business) {
      return res.status(404).json({ message: 'Business not found for this user' });
    }

    const products = await Product.findAll({
      where: { businessId: business.id },
      attributes: ['productName']
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export { addSale, findAllSales, deleteSale, getUserProducts };
