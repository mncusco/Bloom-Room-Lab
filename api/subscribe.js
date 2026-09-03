const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.BLOOMROOM_DATABASE_URL, ssl: { rejectUnauthorized: false } });

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, email } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'Nome ed email richiesti' });
  try {
    await pool.query(
      'INSERT INTO bloomroom_leads (name, email) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
      [name, email]
    );
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno' });
  }
};
