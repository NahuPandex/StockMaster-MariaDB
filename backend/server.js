require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productosRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const pedidosRoutes = require('./routes/pedidosRoutes');
const papeleraRoutes = require('./routes/papeleraRoutes'); // <-- 1. Importar

const app = express();
app.use(cors());
app.use(express.json());

// RUTAS
app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/papelera', papeleraRoutes); // <-- 2. Registrar ruta base

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});