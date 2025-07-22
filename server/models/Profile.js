// const mongoose = require("mongoose");

// const profileSchema = mongoose.Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//         unique: true,
//     },
//     gender: {
//         type: String,
//         enum: ["Male", "Female", "Other", "Prefer not to say"],
//         default: "Prefer not to say",
//     },
//     dateOfBirth: {
//         type: Date,
//     },
//     contactNumber: {
//         type: String,
//         trim: true,
//     },
//     address: {
//         type: String,
//         trim: true,
//     },
//     // Fields specific to officers/DM (can be optional for citizens)
    // department: { // for nodal officesr and dm
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Department",
    //     required: function(){
    //         return false;
    //     }
    // },
//     officerId: {
//         type: String,
//         unique: true,
//         sparse: true,
//         trim: true,
//     },
// },  {
//     timestamps: true
// });

// module.exports = mongoose.model('Profile', profileSchema);