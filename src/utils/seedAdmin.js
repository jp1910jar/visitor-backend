require('dotenv').config();
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const run = async () => {
  await connectDB();

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin with email ${email} already exists. Skipping.`);
    process.exit(0);
  }

  await Admin.create({ name, email, password });
  console.log(`Admin created: ${email}`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
