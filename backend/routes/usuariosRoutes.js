const express = require('express');
const router = express.Router();
// IMPORTANTE: Asegúrate de que el nombre coincida con el archivo real en controllers
const usuariosController = require('../controllers/usuariosController'); 

// 1. Login
router.post('/login', usuariosController.login);

// 2. Obtener usuarios (Aquí estaba el error probablemente)
router.get('/', usuariosController.obtenerUsuarios);

// 3. Crear usuario
router.post('/', usuariosController.crearUsuario);

// 4. Cambiar contraseña
router.put('/cambiar-password/:id_user', usuariosController.cambiarPassword);

module.exports = router;