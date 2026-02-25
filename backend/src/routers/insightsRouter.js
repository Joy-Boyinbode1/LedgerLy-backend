import express from 'express';
import {getInsights} from '../controllers/accounting.controller.js';
import auth from '../middleware/auth.js'


const V3 = express.Router();


// GET all businesses
V3.get("/insights", auth, getInsights);


export default  V3