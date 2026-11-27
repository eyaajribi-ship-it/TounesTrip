const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/preferences', require('./routes/preferences'));
app.use('/api/programmes', require('./routes/programmes'));
app.use('/api/offres', require('./routes/offres'));
app.use('/api/statistiques', require('./routes/statistiques'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
