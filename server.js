require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const usuariosRoutes = require('./routes/usuarios.routes');
const swaggerSpec = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(swaggerSpec);
});

app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'API de usuarios funcionando correctamente',
  });
});

app.use('/usuarios', usuariosRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: 'Ruta no encontrada',
  });
});

app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({
    ok: false,
    message: 'Error interno del servidor',
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
