const asyncHandler = require('express-async-handler');
const Visit = require('../models/Visit');
const generateVisitId = require('../utils/generateVisitId');

const createVisit = asyncHandler(async (req, res) => {
  const {
    fullName, mobile, email, company, designation, profilePhoto,
    hostName, department, purpose, visitType, duration, reference,
  } = req.body;

  if (!fullName || !mobile || !hostName) {
    res.status(400);
    throw new Error('fullName, mobile, and hostName are required');
  }

  const visitId = await generateVisitId();

  const visit = await Visit.create({
    visitId, fullName, mobile, email, company, designation, profilePhoto,
    hostName, department, purpose, visitType, duration, reference,
  });

  res.status(201).json({ success: true, data: visit });
});

const getVisits = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const { status, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { mobile: { $regex: search, $options: 'i' } },
      { hostName: { $regex: search, $options: 'i' } },
      { visitId: { $regex: search, $options: 'i' } },
    ];
  }

  const [visits, total] = await Promise.all([
    Visit.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Visit.countDocuments(filter),
  ]);

  res.json({ success: true, data: visits, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

module.exports = { createVisit, getVisits };
