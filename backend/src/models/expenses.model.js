import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Business from './business.model.js';


const Expense = sequelize.define('Expense', {
    // Model attributes 
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },    
    category: {
      type: DataTypes.ENUM(
         'Transportation',
          'Rent',
          'Eletricity',
          'Utilities',
          'Salaries',
          'Marketing',
          'Tax',
          'Miscellaneous'
      ),
      allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    amount: {
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
},
    
    
}, {
    tableName: 'expenses',
    timestamps: true
});

export default Expense;
