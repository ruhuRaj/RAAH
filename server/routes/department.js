const express = require('express');
const router = express.Router();
const {
    getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} = require('../controllers/department');
const {protect, authorizeAccountType} = require('../middleware/auth');

router.route('/')
    .get(getDepartments) // Publicly accessible to fetch dept (e.g- for citizen form dropdowns)
    .post(protect, authorizeAccountType('District Magistrate'), createDepartment); // only DM can create dept

router.route('/:id')
    .put(protect, authorizeAccountType('District Magistrate'), updateDepartment)
    .delete(protect, authorizeAccountType('District Magistrate'), deleteDepartment);

module.exports = router;