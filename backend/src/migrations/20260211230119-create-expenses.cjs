'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expenses', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      category: {
        type: Sequelize.ENUM(
          'Transportation',
          'Rent',
          'Electricity',
          'Utilities',
          'Salaries',
          'Marketing',
          'Tax',
          'Miscellaneous'
        ),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      businessId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'business',   
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }

    });

    // Index for faster queries
    await queryInterface.addIndex('expenses', ['businessId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('expenses');
  }
};