'use strict'

const bcrypt = require('bcrypt')

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('password123', 12)

    await queryInterface.bulkInsert('users', [
      {
        email: 'demo@wanderboard.com',
        passwordHash,
        username: 'demo',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE username = 'demo' LIMIT 1`
    )
    const userId = users[0].id

    await queryInterface.bulkInsert('places', [
      {
        userId,
        name: 'Tokyo',
        description: 'Amazing city',
        lat: 35.6762,
        lng: 139.6503,
        country: 'Japan',
        visitedAt: '2024-03-15',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId,
        name: 'Barcelona',
        description: 'Gaudi and sea',
        lat: 41.3851,
        lng: 2.1734,
        country: 'Spain',
        visitedAt: '2023-09-10',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId,
        name: 'New York',
        description: 'Central park and skyscrapers',
        lat: 40.7128,
        lng: -74.006,
        country: 'USA',
        visitedAt: '2023-06-20',
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('place_photos', null, {})
    await queryInterface.bulkDelete('places', null, {})
    await queryInterface.bulkDelete('users', null, {})
  },
}
