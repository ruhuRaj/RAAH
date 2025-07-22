const express = require('express');
const router = express.Router();
const {
    getWorkProgressEntries,
    getWorkProgressEntryById,
    updateWorkProgress,
} = require('../controllers/workProgress');
const {protect, authorizeAccountType} = require('../middleware/auth');

router.route('/')
    .get(protect, authorizeAccountType('Nodal Officers', 'District Magistrate'), getWorkProgressEntries); // Get all or filtered work progress

router.route('/:id')
    .get(protect, authorizeAccountType('Nodal Officers', 'District Magistrate'), getWorkProgressEntryById) // Get single entry
    .put(protect, authorizeAccountType('Nodal Officers', 'District Magistrate'), updateWorkProgress); // Update status/remarks

module.exports = router;