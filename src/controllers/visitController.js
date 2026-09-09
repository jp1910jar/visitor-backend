const asyncHandler = require('express-async-handler');
const Visit = require('../models/Visit');
const generateVisitId = require('../utils/generateVisitId');

// @desc    Save a completed visitor registration
// @route   POST /api/visits
// @access  Public
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

// @desc    List visits with pagination, search, filters
// @route   GET /api/visits
// @access  Private (admin)
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

// @desc    Look up a returning visitor by mobile, email, or a past visitId.
//          Returns an aggregated profile built from their Visit history.
//          The returned personal.email is what the frontend then sends to
//          the /api/otp endpoints for verification - no separate wiring
//          needed here for the email-OTP switch, this already returns it.
// @route   GET /api/visitors/lookup?mobile=  or  ?email=  or  ?visitorId=
// @access  Public
const lookupVisitor = asyncHandler(async (req, res) => {
  const { mobile, email, visitorId } = req.query;

  if (!mobile && !email && !visitorId) {
    res.status(400);
    throw new Error('Provide mobile, email, or visitorId to look up a visitor');
  }

  let filter;
  if (visitorId) {
    const anchor = await Visit.findOne({ visitId: visitorId.trim().toUpperCase() });
    if (!anchor) {
      res.json({ success: true, data: null });
      return;
    }
    filter = anchor.email
      ? { $or: [{ mobile: anchor.mobile }, { email: anchor.email }] }
      : { mobile: anchor.mobile };
  } else if (mobile) {
    const digits = mobile.replace(/\D/g, '');
    filter = { mobile: { $regex: digits, $options: 'i' } };
  } else {
    filter = { email: email.toLowerCase().trim() };
  }

  const visits = await Visit.find(filter).sort({ createdAt: -1 });

  if (visits.length === 0) {
    res.json({ success: true, data: null });
    return;
  }

  const latest = visits[0];

  res.json({
    success: true,
    data: {
      visitorId: latest.visitId,
      personal: {
        fullName: latest.fullName,
        mobile: latest.mobile,
        email: latest.email,
        company: latest.company,
        designation: latest.designation,
      },
      totalVisits: visits.length,
      lastVisit: latest.createdAt,
      history: visits.slice(0, 10).map((v) => ({
        id: v.visitId,
        date: v.createdAt,
        hostName: v.hostName,
        department: v.department,
        purpose: v.purpose,
        status: v.status,
      })),
    },
  });
});

module.exports = { createVisit, getVisits, lookupVisitor };
