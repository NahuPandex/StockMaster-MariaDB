const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

// --- RUTAS FIJAS (Van primero para evitar conflictos) ---
router.post('/', pedidosController.crearPedido);
router.get('/historial', pedidosController.obtenerHistorial); // Solo ventas 'completado'
router.get('/papelera', pedidosController.obtenerPapelera);   // Solo ventas 'cancelado'
router.get('/stats', pedidosController.obtenerEstadisticas);

// --- RUTAS DINÁMICAS (Con parámetros :id) ---
router.get('/detalle/:id', pedidosController.obtenerDetallePedido);

// Cambiar estado a 'cancelado' (Mueve a papelera)
router.put('/cancelar/:id', pedidosController.cancelarVenta); 

// Borrado físico (Elimina permanentemente de la DB)
router.delete('/borrar/:id', pedidosController.eliminarPedido); 

module.exports = router;