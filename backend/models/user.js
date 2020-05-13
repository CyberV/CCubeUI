const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let User = new Schema({
    identity: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    role: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    gender: {
        type: String
    },
    dob: {
        type: Date
    },
    validity: {
        type: Date
    },
    address: {
        type: String
    }
    }, {
        collection: 'htmuser'
    })

module.exports = mongoose.model('User', User)
