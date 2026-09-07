const express = require('express');
const { lookupVisitor } = require('../controllers/visitController');

const router = express.Router();

router.get('/lookup', lookupVisitor);

module.exports = router;
