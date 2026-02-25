import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Business from './business.model.js';


const Products = sequelize.define('Products', {
  
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  costPrice: {
    type: DataTypes.DECIMAL(10, 2),  
    allowNull: false
  },

  sellingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  profit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  businessId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'business',
      key: 'id'
    }
  }

}, {
  tableName: 'products',
  timestamps: true
});

export default Products;