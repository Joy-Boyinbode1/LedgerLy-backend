'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('business', [
      {
        "fullName": "James David",
        "phoneNumber": "+254712345670",
        "businessName": 'Doreen\'s Store',
        "businessType": "online"

      },
      {
        "fullName": "John snow",
        "phoneNumber": "+254712345679",
        "businessName": 'Tech Supplies',
        "businessType": "online"


      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('business', null, {});
  }
};

