const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    user: { // user who made the comment
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    isPublic: { //// Can be used to differentiate public comments and internal notes
        type: Boolean,
        default: true,
    },
},  {
    timestamps: true
});

const grievanceSchema = mongoose.Schema({
    user: { // user who filed the complaints
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String, // eg- public works, health, education etc
        required: true,
    },
    subCategory: {
        type: String, // eg- raod repair, hospital services etc
        // optional
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // DM who assigned
    },
    assignedTo: { // officer assigned to resolve
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // user with nodal officers or DM accountType 
        default: null, // can be null if not yet assigned
    },
    status: {
        type: String,
        enum: ["Submitted", "Under Review", "Assigned", "In Progress", "Resolved", "Rejected", "Closed", "Reopened"],
        default: 'Submitted',
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: 'Low',
    },
    severity: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default: 'Low',
    },
    location: {
        type: {
            type: String,
            // enum: ["Point"], // GeoJSON point
            default: 'Point',
        },
        addressText: String,
    },
    attachments: [{ // array of attachments urls
        url: String,
        fileType: String, // image, video, pdfs
    }],
    comments: [commentSchema],
    resolutionDetails: {
        type: String,
        default: ''
    },
    resolvedAt: {
        type: Date,
    },
    rejectedReason: {
        type: String,
        default: ''
    },
    feedbackRating: {
        type: Number,
        min: 1,
        max: 5
    },
    feebackComments: {
        type: String
    }
},  {
    timestamps: true
});

module.exports = mongoose.model('Grievance', grievanceSchema);