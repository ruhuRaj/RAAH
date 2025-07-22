const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
},  {
    timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);