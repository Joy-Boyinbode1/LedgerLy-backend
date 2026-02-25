import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Product from './products.model.js';
import Business from './business.model.js';


const Sale = sequelize.define('Sale', {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },

  businessId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'business',
      key: 'id'
    }
  },

  quantitySold: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  costPriceAtSale:{
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  sellingPriceAtSale: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  profitAtSale: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }

}, {
  tableName: 'sales',
  timestamps: true
});

export default Sale;