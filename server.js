const path = require('path');

// Load .env explicitly from the same folder as server.js
require('dotenv').config({
  path: path.resolve(__dirname, '.env')
});

const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Temporary check
console.log('ENV file path:', path.resolve(__dirname, '.env'));
console.log('MONGO_URI loaded:', process.env.MONGO_URI ? 'YES' : 'NO');

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error.message);
    process.exit(1);
  }
};

startServer();