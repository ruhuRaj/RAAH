const asyncHandler = require('express-async-handler');
const WorkProgress = require('../models/WorkProgress');
const Grievance = require('../models/Grievance');
const User = require('../models/User');
const sendEmail = require('../utils/mailSender');
const { Stats } = require('fs');

// get all work progress entries (filtered by assignedTo and status)
// access : private (Nodal officers, DMs)
const getWorkProgressEntries = asyncHandler(async (req, res) => {
    let query = {};
    const {status, grievanceId, assignedTo, page, limit} = req.query;

    const pageSize = parseInt(limit) || 10;
    const pageNum = parseInt(page) || 1;
    const skip = (pageNum - 1) * pageSize;

    // nodal officer can only see their own work progress
    if(req.user.accountType === 'Nodal Officers'){
        query.assignedTo = req.query;
    }
    // DM can filter by assignedTo
    else if(req.user.accountType === 'District Magistrate' && assignedTo){
        query.assignedTo = assignedTo;
    }

    if(status){
        query.status = status;
    }
    if(grievanceId){
        query.grievance = grievanceId;
    }

    const count = await WorkProgress.countDocuments(query);
    const getWorkProgressEntries = await WorkProgress.find(query)
        .populate('grievance', 'title, status user department') 
        .populate('assignedTo', 'firstName lastName email, accountType')
        .sort({createdAt: -1}) // latest wise
        .limit(pageSize)
        .skip(skip);

    res.status(200).json({
        getWorkProgressEntries,
        page: pageNum,
        pages: Math.ceil(count / pageNum),
        total: count
    });

});

// get a single work progress entry
// access : private (Nodal officers, DMs)
const getWorkProgressEntryById = asyncHandler(async (req, res) => {
    const workProgress = await WorkProgress.findById(req.params.id)
        .populate('grievance', 'title status user department')
        .populate('assignedTo', 'firstName lastName email accountType');

    if(!workProgress){
        res.status(404);
        throw new Error('Work Progess entry not found');
    }    
    // authorization : Nodal officers can only see their own asigned work
    if(req.user.accountTypev === 'Nodal Officers' && workProgress.assignedTo.toString() !== req.user.id){
        res.status(403);
        throw new Error('Not authorized to view this work progress entry');   
    }

    // DMs can view all
    res.status(200).json(workProgress);

});

// update work progress status and remarks
// access : private (nodal officers, DMs)
const updateWorkProgress = asyncHandler(async (req, res) => {
    const {status, remarks, completionDate} = req.body;

    const workProgress = await WorkProgress.findById(req.params.id);

    if(!workProgress){
        res.status(404);
        throw new Error('Work Progress entry not found');
    }

    // authorization : nodal officers can only update their own assigned work
    if(req.user.accountType === 'Nodal Officers' && workProgress.assignedTo.toString() !== req.user.id){
        res.status(403);
        throw new Error('Not authorized to update this work progress entry');
    }

    // DMs can update any

    // Update fields
    if(status){
        workProgress.status = status;
    }
    if(remarks !== undefined){
        workProgress.remarks = remarks;
    }
    if(completionDate){
        workProgress.completionDate = completionDate; // for manual setting
    }

    // auto set completion date if status is 'Completed'
    if(status === 'Completed' && !workProgress.completionDate){
        workProgress.completionDate = new Date();
    }
    else if(status !== 'Completed' && workProgress.completionDate){
        // clear completion date if status changes from 'Completed'
        workProgress.completionDate = undefined;
    }

    const updatedWorkProgress = await workProgress.save();

    // optionally, update the associated Grievance status if WorkProgress is completed
    if(updatedWorkProgress.status === 'Completed'){
        const grievance = await Grievance.findById(updatedWorkProgress.grievance);
        if(grievance && grievance.status !== 'Resolved'){
            grievance.status = 'Resolved';
            grievance.resolutionDetails = updatedWorkProgress.remarks || 'Grievance resolved as per officer work progress.';
            grievance.resolvedAt = updatedWorkProgress.completionDate || new Date();
            await grievance.save();

            // Notify the citizen about the resolution
            const citizen = await User.findById(grievance.user).select('email');
            const emailMessage = `
            <h1>Your Grievance ID:"${grievance._id} has been RESOLVED!</h1>
            <p>The grievance titled "{grievance.title}" has been marked as completed by the assigned officer.</p>
            <p>Resolution Details: ${grievance.resolutionDetails}</p>
            <p>Link: ${process.env.YOUR_FRONTEND_URL}/grievance/${grievance._id}</p>
            `;

            try{
                await sendEmail({
                    email: citizen.email,
                    subject: `Grievance Resolved: ${grievance.title}`,
                    message: emailMessage
                });
            }
            catch(emailError){
                console.log('Error in sending resolution email to the citizen:', emailError.message);
            }
        }
    }

    res.status(200).json(updatedWorkProgress);

});

module.exports = {
    getWorkProgressEntries,
    getWorkProgressEntryById,
    updateWorkProgress,
};