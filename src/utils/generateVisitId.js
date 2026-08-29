const Visit = require('../models/Visit');

async function generateVisitId() {
  const year = new Date().getFullYear();
  const MAX_ATTEMPTS = 10;

  for (let i = 0; i < MAX_ATTEMPTS; i += 1) {
    const n = Math.floor(100 + Math.random() * 89900);
    const candidate = `VIS-${year}-${String(n).padStart(5, '0')}`;
    const exists = await Visit.exists({ visitId: candidate });
    if (!exists) return candidate;
  }

  return `VIS-${year}-${Date.now().toString().slice(-5)}`;
}

module.exports = generateVisitId;
