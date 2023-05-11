/*
 *
 * model back-end JavaScript code Project 2
 *
 * Author: Tuan Chau
 * Version: 2.0
 */

// Import mongoose library
const mongoose = require('mongoose');

// Create schema
const tableSchema = new mongoose.Schema({
    fileName: String,
    title: String,
    data: {
        type: Array,
        items: {
            type: Object,
            properties: {
                year: String,
                population: Number
            }
        }
    }
});

// Export schema
module.exports = mongoose.model('tableSchema', tableSchema, 'Datasets');
