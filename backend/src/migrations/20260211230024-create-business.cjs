'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('business', {   

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      fullName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },

      businessName: {
        type: Sequelize.STRING,
        allowNull: false
      },

      businessType: {
        type: Sequelize.ENUM(
          'Online',
          'open market',
          'physical',
          'Hybrid(online & physical)'
        ),
        allowNull: false
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',   
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

    // Optional: add index for performance
    await queryInterface.addIndex('business', ['userId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('business');
  }
};