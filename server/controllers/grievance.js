const asyncHandler = require('express-async-handler');
const Grievance = require('../models/Grievance');
const User = require('../models/User');
const Department = require('../models/Department');
const WorkProgress = require('../models/WorkProgress');
const { cloudinary } = require('../config/cloudinary');
const sendEmail = require('../utils/mailSender');
const fs = require('fs');

// CREATE GRIEVANCE 
const createGrievance = asyncHandler(async (req, res) => {
  const { title, description, category, subCategory, department, addressText, severity } = req.body;

  if (!title || !description || !category || !department) {
    res.status(400);
    throw new Error("Please fill all required fields.");
  }

  const deptExists = await Department.findById(department);
  if (!deptExists) throw new Error("Invalid department specified.");

  const attachments = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "RAAH_grievances",
        resource_type: "auto",
      });
      attachments.push({
        url: result.secure_url,
        fileType: result.resource_type,
      });
      fs.unlinkSync(file.path); // clean temp
    }
  }

  const grievance = await Grievance.create({
    user: req.user.id,
    title,
    description,
    category,
    subCategory,
    department,
    severity,
    priority: severity,
    location: {
      type: "Point",
      addressText: addressText || "",
    },
    attachments,
    status: "Submitted",
  });

  const dmList = await User.find({ accountType: "District Magistrate", active: true }).select("email");
  const emails = dmList.map(dm => dm.email);
  if (emails.length) {
    await sendEmail(
      emails,
      `New Grievance: ${grievance.title}`,
      `<h1>New Grievance Submitted</h1><p><strong>${grievance.title}</strong> in ${deptExists.name}</p>`
    );
  }

  res.status(201).json(grievance);
});

// GET ALL GRIEVANCES 
const getGrievances = asyncHandler(async (req, res) => {
  const { status, category, department, assignedTo, search, page = 1, limit = 100 } = req.query;
  const skip = (page - 1) * limit;

  let query = {};
  if (req.user) {
    const { accountType, id } = req.user;
    if (accountType === 'Citizen') query.user = id;
    else if (accountType === 'Nodal Officers') {
      query.department = req.user.department;
      query.assignedTo = { $ne: null }; // Only show grievances that have been assigned
    }
  }

  if (status) query.status = status;
  if (category) query.category = category;
  if (department) query.department = department;
  
  // Handle assignedTo parameter
  if (assignedTo) {
    if (assignedTo === 'true') {
      // Get all assigned grievances (assignedTo is not null)
      query.assignedTo = { $ne: null };
    } else if (assignedTo === 'false') {
      // Get all unassigned grievances (assignedTo is null)
      query.assignedTo = null;
    } else {
      // Get grievances assigned to specific user (ObjectId)
      query.assignedTo = assignedTo;
    }
  }
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const count = await Grievance.countDocuments(query);
  const grievances = await Grievance.find(query)
  .populate('user', 'firstName lastName email image')
  .populate('department', 'name')
  .populate('assignedTo', 'firstName lastName email image')
  .populate('assignedBy', 'firstName lastName email _id') // ADD THIS LINE
  .populate('comments.user', 'firstName lastName accountType image')
  .limit(limit)
  .skip(skip)
  .sort({ createdAt: -1 });


  res.status(200).json({ grievances, page, pages: Math.ceil(count / limit), total: count });
});

// GET BY ID 
const getGrievanceById = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching grievance for ID:", req.params.id);

    // Optional: Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid grievance ID format" });
    }

    const grievance = await Grievance.findById(req.params.id)
      .populate('user', 'firstName lastName email accountType')
      .populate('department', 'name')
      .populate('assignedTo', 'firstName lastName email accountType')
      .populate('comments.user', 'firstName lastName accountType');

    if (!grievance) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    res.status(200).json(grievance);
  } catch (error) {
    console.error("Error in getGrievanceById:", error.message);
    res.status(500).json({ message: error.message });
  }
});


// UPDATE GRIEVANCE (Enhanced) 
const updateGrievance = asyncHandler(async (req, res) => {
  const { status, assignedTo, resolutionDetails, rejectedReason, feedbackRating, feedbackComment, note } = req.body;
  const grievance = await Grievance.findById(req.params.id);
  if (!grievance) throw new Error("Grievance not found");

  const isCitizen = grievance.user.toString() === req.user.id;
  const isDM = req.user.accountType === "District Magistrate";
  const isNodal = req.user.accountType === "Nodal Officers";

  // Citizens can only give feedback
  if (isCitizen) {
    if (feedbackRating || feedbackComment) {
      grievance.feedbackRating = feedbackRating || grievance.feedbackRating;
      grievance.feedbackComment = feedbackComment || grievance.feedbackComment;
      await grievance.save();
      return res.status(200).json({ message: "Feedback submitted.", grievance });
    }
    throw new Error("Citizens can only give feedback");
  }

  // Track previous status for notifications
  const previousStatus = grievance.status;
  const previousAssignedTo = grievance.assignedTo;

  // Update grievance fields
  if (status) grievance.status = status;
  if (assignedTo) grievance.assignedTo = assignedTo;
  if (resolutionDetails) grievance.resolutionDetails = resolutionDetails;
  if (rejectedReason) grievance.rejectedReason = rejectedReason;

  // Add note if provided (for nodal officers)
  if (note && isNodal) {
    grievance.comments.push({
      user: req.user._id,
      text: `Status Update: ${status || previousStatus} - ${note}`,
      isPublic: true,
    });
  }

  // Set resolved date if status is resolved
  if (status === "Resolved" && !grievance.resolvedAt) {
    grievance.resolvedAt = new Date();
  }

  await grievance.save();

  // Send notifications based on who made the update
  try {
    if (isNodal) {
      // Notify DM about status update
      const dmList = await User.find({ accountType: "District Magistrate", active: true });
      for (const dm of dmList) {
        await sendEmail(
          dm.email,
          `Grievance Status Updated: ${grievance.title}`,
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #dc2626;">Grievance Status Update</h2>
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Status changed from "${previousStatus}" to "${status}"</h3>
              <p><strong>Grievance:</strong> ${grievance.title}</p>
              <p><strong>Updated By:</strong> ${req.user.firstName} ${req.user.lastName}</p>
              ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
            </div>
            <a href="${process.env.YOUR_FRONTEND_URL}/dashboard/manage-grievances" 
               style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Grievance Progress
            </a>
          </div>
          `
        );
      }

      // Notify citizen about status update
      const citizen = await User.findById(grievance.user);
      if (citizen) {
        await sendEmail(
          citizen.email,
          `Your Grievance Status Updated: ${grievance.title}`,
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #059669;">Grievance Update</h2>
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Your grievance status has been updated:</h3>
              <p><strong>Title:</strong> ${grievance.title}</p>
              <p><strong>New Status:</strong> ${status}</p>
              <p><strong>Updated By:</strong> ${req.user.firstName} ${req.user.lastName}</p>
              ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
            </div>
            <a href="${process.env.YOUR_FRONTEND_URL}/dashboard/my-grievances" 
               style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View My Grievances
            </a>
          </div>
          `
        );
      }
    } else if (isDM) {
      // DM updates - notify relevant parties
      if (status && status !== previousStatus) {
        const citizen = await User.findById(grievance.user);
        if (citizen) {
          await sendEmail(
            citizen.email,
            `Grievance Status Updated by DM: ${grievance.title}`,
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #7c3aed;">DM Update</h2>
              <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Your grievance has been updated by the District Magistrate:</h3>
                <p><strong>Title:</strong> ${grievance.title}</p>
                <p><strong>New Status:</strong> ${status}</p>
                <p><strong>Updated By:</strong> ${req.user.firstName} ${req.user.lastName}</p>
              </div>
              <a href="${process.env.YOUR_FRONTEND_URL}/dashboard/my-grievances" 
                 style="background: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                View My Grievances
              </a>
            </div>
            `
          );
        }
      }
    }
  } catch (emailError) {
    console.error("Error sending status update notifications:", emailError);
  }

  const updated = await grievance.populate([
    { path: 'user', select: 'firstName lastName email' },
    { path: 'assignedTo', select: 'firstName lastName email' },
    { path: 'department', select: 'name' },
    { path: 'comments.user', select: 'firstName lastName accountType' }
  ]);

  res.status(200).json(updated);
});

// ADD COMMENT 
const addGrievanceComment = asyncHandler(async (req, res) => {
  const { text, isPublic } = req.body;
  const grievance = await Grievance.findById(req.params.id);
  if (!grievance) throw new Error("Grievance not found");

  grievance.comments.push({
    user: req.user.id,
    text,
    isPublic: isPublic ?? true,
  });

  const updated = await grievance.save();
  await updated.populate('comments.user', 'firstName lastName accountType');
  res.status(201).json(updated.comments.at(-1));
});

// ASSIGN GRIEVANCE (Enhanced) 
// Assign grievance to department (DM Action)
const assignGrievance = asyncHandler(async (req, res) => {
  const grievanceId = req.params.id;
  const { department, message } = req.body;

  const grievance = await Grievance.findById(grievanceId);
  if (!grievance) {
    res.status(404);
    throw new Error("Grievance not found");
  }

  const departmentObj = await Department.findById(department);
  if (!departmentObj) {
    res.status(400);
    throw new Error("Invalid department ID");
  }

  // Find the nodal officer for this department
  const nodalOfficer = await User.findOne({ 
    department, 
    accountType: "Nodal Officers",
    active: true 
  });

  if (!nodalOfficer) {
    res.status(400);
    throw new Error("No active nodal officer found for this department");
  }

  // Update grievance with assignment details
  grievance.department = department;
  grievance.assignedTo = nodalOfficer._id;
  grievance.assignedBy = req.user._id;
  grievance.status = "Assigned";
  
  // Add assignment message as a comment
  if (message) {
    grievance.comments.push({
      user: req.user._id,
      text: `Assigned by DM: ${message}`,
      isPublic: false, // Internal note for nodal officer
    });
  }

  await grievance.save();

  // Send email notification to nodal officer
  try {
    await sendEmail(
      nodalOfficer.email,
      "New Grievance Assigned to Your Department",
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Grievance Assignment</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Grievance Details:</h3>
          <p><strong>Title:</strong> ${grievance.title}</p>
          <p><strong>Category:</strong> ${grievance.category}</p>
          <p><strong>Priority:</strong> ${grievance.priority}</p>
          <p><strong>Assigned By:</strong> ${req.user.firstName} ${req.user.lastName}</p>
          ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        </div>
        <p>Please review and take necessary action on this grievance.</p>
        <a href="${process.env.YOUR_FRONTEND_URL}/dashboard/assigned-grievances" 
           style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Assigned Grievances
        </a>
      </div>
      `
    );
  } catch (emailError) {
    console.error("Error sending assignment email:", emailError);
  }

  // Send notification to citizen about assignment
  try {
    const citizen = await User.findById(grievance.user);
    if (citizen) {
      await sendEmail(
        citizen.email,
        "Your Grievance Has Been Assigned",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Grievance Update</h2>
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your grievance has been assigned for resolution:</h3>
            <p><strong>Title:</strong> ${grievance.title}</p>
            <p><strong>Department:</strong> ${departmentObj.name}</p>
            <p><strong>Status:</strong> Assigned</p>
          </div>
          <p>You will be notified of any further updates.</p>
          <a href="${process.env.YOUR_FRONTEND_URL}/dashboard/my-grievances" 
             style="background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View My Grievances
          </a>
        </div>
        `
      );
    }
  } catch (emailError) {
    console.error("Error sending citizen notification:", emailError);
  }

  res.status(200).json({ 
    message: "Grievance assigned successfully", 
    grievance: await grievance.populate([
      { path: 'assignedTo', select: 'firstName lastName email' },
      { path: 'department', select: 'name' }
    ])
  });
});



// GET GRIEVANCE STATISTICS
const getGrievanceStats = asyncHandler(async (req, res) => {
  const { userId, accountType, department } = req.user;

  let query = {};
  
  // Filter based on user role
  if (accountType === 'Citizen') {
    query.user = userId;
  } else if (accountType === 'Nodal Officers') {
    query.department = department;
    query.assignedTo = { $ne: null }; // Only count grievances that have been assigned
  }
  // DM can see all grievances

  const stats = await Grievance.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get total count
  const total = await Grievance.countDocuments(query);

  // Format stats for frontend
  const formattedStats = {
    total,
    pending: 0,
    resolved: 0,
    rejected: 0,
    inProgress: 0,
    assigned: 0
  };

  stats.forEach(stat => {
    switch (stat._id) {
      case 'Submitted':
      case 'Under Review':
        formattedStats.pending += stat.count;
        break;
      case 'Resolved':
        formattedStats.resolved += stat.count;
        break;
      case 'Rejected':
        formattedStats.rejected += stat.count;
        break;
      case 'In Progress':
        formattedStats.inProgress += stat.count;
        break;
      case 'Assigned':
        formattedStats.assigned += stat.count;
        break;
      default:
        formattedStats.pending += stat.count;
    }
  });

  res.status(200).json(formattedStats);
});

// GET UNASSIGNED GRIEVANCES (DM Only) 
const getUnassignedGrievances = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const query = {
    status: { $in: ['Submitted', 'Under Review'] },
    assignedTo: null
  };

  const count = await Grievance.countDocuments(query);
  const grievances = await Grievance.find(query)
    .populate('user', 'firstName lastName email')
    .populate('department', 'name')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  res.status(200).json({
    grievances,
    page: parseInt(page),
    pages: Math.ceil(count / limit),
    total: count
  });
});

// GET ASSIGNED GRIEVANCES (Nodal Only) 
const getAssignedGrievances = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (page - 1) * limit;

  // For Nodal Officers, show only grievances assigned to their department by DM
  const query = {
    department: req.user.department,
    assignedTo: { $ne: null } // Only show grievances that have been assigned
  };

  if (status) {
    query.status = status;
  }

  const count = await Grievance.countDocuments(query);
  const grievances = await Grievance.find(query)
    .populate('user', 'firstName lastName email')
    .populate('department', 'name')
    .populate('assignedBy', 'firstName lastName')
    .populate('comments.user', 'firstName lastName accountType')
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  res.status(200).json({
    grievances,
    page: parseInt(page),
    pages: Math.ceil(count / limit),
    total: count
  });
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const { userId, accountType, department } = req.user;

  let query = {};
  
  // Filter based on user role
  if (accountType === 'Citizen') {
    query.user = userId;
  } else if (accountType === 'Nodal Officers') {
    query.department = department;
    query.assignedTo = { $ne: null }; // Only count grievances that have been assigned
  }
  // DM can see all grievances

  const stats = await Grievance.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get total count
  const total = await Grievance.countDocuments(query);

  // Format stats for frontend
  const formattedStats = {
    total,
    pending: 0,
    resolved: 0,
    rejected: 0,
    inProgress: 0,
    assigned: 0
  };

  stats.forEach(stat => {
    switch (stat._id) {
      case 'Submitted':
      case 'Under Review':
        formattedStats.pending += stat.count;
        break;
      case 'Resolved':
        formattedStats.resolved += stat.count;
        break;
      case 'Rejected':
        formattedStats.rejected += stat.count;
        break;
      case 'In Progress':
        formattedStats.inProgress += stat.count;
        break;
      case 'Assigned':
        formattedStats.assigned += stat.count;
        break;
      default:
        formattedStats.pending += stat.count;
    }
  });

  res.status(200).json(formattedStats);
});

// DELETE GRIEVANCE (DM Only) 
const deleteGrievance = asyncHandler(async (req, res) => {
  const grievance = await Grievance.findById(req.params.id);
  
  if (!grievance) {
    res.status(404);
    throw new Error("Grievance not found");
  }

  // Optional: Check if grievance can be deleted (e.g., not resolved, no active work)
  // For now, allow deletion of any grievance by DM
  
  await grievance.deleteOne();
  
  res.status(200).json({ 
    message: "Grievance deleted successfully",
    deletedGrievance: {
      id: grievance._id,
      title: grievance.title
    }
  });
});

module.exports = {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievance,
  deleteGrievance,
  addGrievanceComment,
  assignGrievance,
  getGrievanceStats,
  getDashboardStats,
  getUnassignedGrievances,
  getAssignedGrievances,
};
