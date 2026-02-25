'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      buyingPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      sellingPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      profit:{
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

    // Optional indexes for faster queries
    await queryInterface.addIndex('products', ['businessId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('products');
  }
};