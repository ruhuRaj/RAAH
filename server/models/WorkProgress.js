const mongoose = require("mongoose");

const workProgress = mongoose.Schema({
    grievance: { //refrence to actual grievance
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grievance',
        required: true,
        unique: true, // a grievance can have only one work progress
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "In Progress", "Completed", "Closed", "Rejected"],
        default: 'Pending',
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    completionDate: {
        type: Date,
    },
    remarks: { // officers internal messages on this work progress
        type: String,
        trim: true,
    },
},  {
    timestamps: true
});

module.exports = mongoose.model('WorkProgress', workProgress);