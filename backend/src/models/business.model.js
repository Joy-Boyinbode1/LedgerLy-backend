import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.model.js';
import Product from './products.model.js';
import Sale from './sales.model.js';
import Expense from './expenses.model.js';
  
 
const Business = sequelize.define('Business',
  {
    // Model attributes 
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber:{
        type:DataTypes.STRING,
        allowNull: false,
        validate: { is: /^[0-9+]+$/i }
    },
    businessName:{
        type:DataTypes.STRING,
        allowNull:false
    }, 
    businessType:{
        type:DataTypes.ENUM(
            'Online', 
            'open market',
            'physical', 
            'Hybrid(online & physical)'),
        allowNull:false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }

    }
    

  },
  
   {
        tableName: 'business',
        timestamps:true
    }
); 
    // A Business belongs to a User
Business.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// A Business has many Products, Sales, and Expenses
Business.hasMany(Product, { foreignKey: 'businessId', as: 'products' });
Business.hasMany(Sale, { foreignKey: 'businessId', as: 'sales' });
Business.hasMany(Expense, { foreignKey: 'businessId', as: 'expenses' });


// `sequelize.define` also returns the model
//console.log(Business === sequelize.models.Business); // true

export default Business;