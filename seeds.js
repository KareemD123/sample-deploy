const { connectToDatabase } = require('./config/database')
const User = require('./models/User')
// Load environment variables
require('dotenv').config()
connectToDatabase()
require('./config/passport')


async function createUser() {
    await User.create({
        firstName: 'Test',
        lastName: 'Test',
        email: 'test@email.com',
        photo: 'N/A',
        googleId: '12345'
    })
}

createUser()