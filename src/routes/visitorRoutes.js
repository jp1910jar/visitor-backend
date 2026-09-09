const express = require('express');
const { lookupVisitor } = require('../controllers/visitController');

const router = express.Router();

// Public - the kiosk checks this before starting a fresh registration,
// so a returning visitor can skip re-entering everything.
router.get('/lookup', lookupVisitor);

module.exports = router;
