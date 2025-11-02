// src/controllers/AuthController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function signToken(payload) {
  const secret = process.env.JWT_SECRET || 'dev-secret';
  const expiresIn = process.env.JWT_EXPIRES || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || String(password).length < 8) {
      return res.status(400).json({ message: 'Dados inválidos (senha >= 8).' });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'E-mail já cadastrado.' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash });

    const token = signToken({ id: user.id, name: user.name, email: user.email });
    return res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (err) { return next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Informe e-mail e senha.' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const token = signToken({ id: user.id, name: user.name, email: user.email });
    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (err) { return next(err); }
}

module.exports = { signup, login };
