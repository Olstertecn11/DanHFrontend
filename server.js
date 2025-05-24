const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser'); // ✅ Importar primero
const verificarAutenticacion = require('./middlewares/verificarAutenticacion');
require('dotenv').config();

const app = express();

// 🧠 Orden IMPORTANTE
app.use(cookieParser()); // ✅ Esto DEBE ir antes de usar `req.cookies`

// Configuración de EJS para renderizado de plantillas
app.use(express.static('public'));
app.use(express.static('Js'));
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware para analizar el cuerpo de la solicitud
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// (si decides usar sesiones además del JWT)
app.use(session({
  secret: 'mi_secreto',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Rutas
app.get('/', (req, res) => {
  res.render('login');
});

app.get('/inicio', verificarAutenticacion, (req, res) => {
  res.render('inicio', { nombre: req.usuario });
});


app.get('/registros', verificarAutenticacion, (req, res) => {
  res.sendFile(__dirname + '/public/registros.html');
});


app.get('/dashboard', verificarAutenticacion, (req, res) => {
  res.render('index');
});


app.get('/usuarios', verificarAutenticacion, (req, res) => {
  res.sendFile(__dirname + '/public/usuarios.html');
});


app.get('/cierre_um', verificarAutenticacion, (req, res) => {
  res.sendFile(__dirname + '/public/cierre_um.html');
});

app.get('/2fa', (req, res) => {
  res.sendFile(__dirname + '/public/2fa.html');
});








// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Frontend corriendo en http://localhost:${PORT}`);
});
