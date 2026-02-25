import express from 'express';
import * as businessController from '../controllers/business.controller.js';
import * as productController from '../controllers/products.controller.js';
import auth from '../middleware/auth.js';

const V1 = express.Router();


// GET all businesses
V1.get("/business",auth, businessController.findAllBusiness);
// POST /users
V1.post("/business",auth, businessController.addBusiness);
// DELETE /users/:id
V1.delete("/Business/:id",auth, businessController.deleteBusiness);

// GET all products
V1.get("/products",auth, productController.findAllProducts);
// POST /users
V1.post("/products",auth, productController.addProducts);
// DELETE /users/:id
V1.delete("/product/:id",auth, productController.deleteProducts);

export default  V1

