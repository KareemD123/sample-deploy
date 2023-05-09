const mongoose = require('mongoose')
// import mongoose from 'mongoose' ES Module Syntax

function connectToDatabase() {
    mongoose.connect(process.env.DATABASE_URL)

    const db = mongoose.connection

    db.on('connected', () => {
        console.log("Connected to MongoDB Successfully!!!")
    })

}

// export {} ES Module Syntax
module.exports = {
    connectToDatabase
}
