const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || '').split(',').filter(Boolean),
    credentials: true,
  })
);
app.use(express.json({ limit: '5mb' }));
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Visitor Hub Pro API is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/visits', require('./routes/visitRoutes'));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
