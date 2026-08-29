const express = require('express');
const { createVisit, getVisits } = require('../controllers/visitController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', createVisit);
router.get('/', protect, getVisits);

module.exports = router;
