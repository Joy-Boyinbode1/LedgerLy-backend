'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('sales', [
      { businessId: 1, totalAmount: 5000, createdAt: new Date(), updatedAt: new Date() },
      { businessId: 1, totalAmount: 12000, createdAt: new Date(), updatedAt: new Date() },
      { businessId: 1, totalAmount: 8000, createdAt: new Date(), updatedAt: new Date() },
      { businessId: 2, totalAmount: 15000, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('sales', null, {});
  }
};
