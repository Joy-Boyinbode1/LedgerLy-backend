'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      totalAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
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

    // Performance indexes
    await queryInterface.addIndex('sales', ['businessId']);
    await queryInterface.addIndex('sales', ['productId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sales');
  }
};