const asyncHandler = require('express-async-handler');
const Department = require('../models/Department');
const User = require('../models/User');
const sendEmail = require('../utils/mailSender');
const { updateProfile } = require('./profile');

// get all departments
// access : public (for dropdowns etc);
const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find({});
  res.status(200).json({departments}); // Wrap in object
});


// create a new departments
// access : private (DM only)
const createDepartment = asyncHandler(async (req, res) => {
    const {name, description} = req.body;

    if(!name){
        res.status(400);
        throw new Error('Department name is required');
    }

    const departmentExists = await Department.findOne({name});
    if(departmentExists){
        res.status(400);
        throw new Error('Department with this name already Exists');
    }

    const department = await Department.create({
        name,
        description
    });

    // optional : Notify DM of new dep creation
    const dmMailingList = await User.find({accountType: 'District Magistrate', active: true}).select('email');
    if(dmMailingList.length > 0){
        const emailBody = `
        <h1>New Department created in RAAH</h1>
        <p>A new department, <strong>${department.name}</strong>, has been created in the systen.</p>
        <p>Description: ${department.description || 'N/A'}</p>
        <p>You can now assign Nodal Officers to this department and manage grievances.</p>
        `;
        try{
            await sendEmail({
                email: dmMailingList.map(dm => dm.email),
                subject: `New Department Created: ${department.name}`,
                message: emailBody
            });
        }
        catch(emailError){
            console.log('Error in sending new department email to DMs:', emailError.message);
        }
    }

    res.status(201).json(department);

});

// update a department
// access : private (DM only)
const updateDepartment = asyncHandler(async (req, res) => {
    const {name, description} = req.body;

    const department = await Department.findById(req.params.id);

    if(!department){
        res.status(404);
        throw new Error('Department not found');
    }

    // ensure the updated name is not taken by another dep already
    if(name && name !== department.name){
        const nameExists = await Department.findOne({name});
        if(nameExists){
            res.status(400);
            throw new Error('Another department with this name already exists.');
        }
        department.name = name;
    }
    if(description !== undefined){
        department.description = description;
    }

    const updatedDepartment = await department.save();
    res.status(200).json(updatedDepartment);

})

// delete a department
// access : private (DMs only)
const deleteDepartment = asyncHandler(async (req, res)  => {
    const department = await Department.findById(req.params.id);

    if(!department){
        res.status(404);
        throw new Error('Department not found');
    }

    // TODO: Before deleting, check if any users or grievances are associated with this department.
    // If so, you might want to:
    // 1. Prevent deletion and return an error.
    // 2. Reassign associated users/grievances to a "Default" or "Unassigned" department.
    // This logic is crucial to maintain data integrity.

    await department.deleteOne();

    res.status(200).json({message: 'Department removed'});

});

module.exports = {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
};