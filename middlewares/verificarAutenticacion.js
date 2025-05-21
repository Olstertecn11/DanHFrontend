const jwt = require('jsonwebtoken');

function verificarAutenticacion(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect('/');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // Puedes usarlo en tus vistas si lo necesitas
    next();
  } catch (err) {
    console.error('Token inválido:', err.message);
    return res.redirect('/');
  }
}

module.exports = verificarAutenticacion;
