const express = require('express');
const router = express.Router();
const papeleraController = require('../controllers/papeleraController');

// La ruta final es http://localhost:3000/api/papelera/
router.get('/', papeleraController.obtenerPapelera);
router.put('/restaurar/:id', papeleraController.restaurarVenta);
router.delete('/eliminar/:id', papeleraController.vaciarVenta);

module.exports = router;