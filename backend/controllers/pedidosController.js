const db = require('../config/db');

// 1. Crear pedido y descontar stock
exports.crearPedido = async (req, res) => {
    const { id_usuario, total, detalles } = req.body;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        // Al crear, el estado por defecto es 'completado' según tu tabla
        const [pedidoRes] = await connection.query(
            'INSERT INTO pedidos (id_usuario, total, estado) VALUES (?, ?, "completado")',
            [id_usuario, total]
        );
        const id_pedido = pedidoRes.insertId;

        for (const item of detalles) {
            await connection.query(
                'INSERT INTO detalles_pedido (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [id_pedido, item.id_producto, item.cantidad, item.precio]
            );
            await connection.query(
                'UPDATE productos SET stock = stock - ? WHERE id = ?',
                [item.cantidad, item.id_producto]
            );
        }
        await connection.commit();
        res.json({ mensaje: "¡Pedido guardado!", id_pedido });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// 2. Obtener historial (Solo VENTAS ACTIVAS)
exports.obtenerHistorial = async (req, res) => {
    try {
        const query = `
            SELECT p.id_pedido, p.fecha, p.total, u.nombre as vendedor 
            FROM pedidos p 
            JOIN usuarios u ON p.id_usuario = u.id_user 
            WHERE p.estado = 'completado'
            ORDER BY p.fecha DESC`;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Obtener Papelera (Solo VENTAS CANCELADAS)
exports.obtenerPapelera = async (req, res) => {
    try {
        const query = `
            SELECT p.id_pedido, p.fecha, p.total, u.nombre as vendedor 
            FROM pedidos p 
            JOIN usuarios u ON p.id_usuario = u.id_user 
            WHERE p.estado = 'cancelado'
            ORDER BY p.fecha DESC`;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Mover a papelera (Soft Delete + Restaurar Stock)
exports.cancelarVenta = async (req, res) => {
    const { id } = req.params;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // A. Cambiar estado a 'cancelado'
        await connection.query('UPDATE pedidos SET estado = "cancelado" WHERE id_pedido = ?', [id]);

        // B. Buscar productos para devolver stock
        const [detalles] = await connection.query(
            'SELECT id_producto, cantidad FROM detalles_pedido WHERE id_pedido = ?', [id]
        );

        for (const item of detalles) {
            await connection.query(
                'UPDATE productos SET stock = stock + ? WHERE id = ?',
                [item.cantidad, item.id_producto]
            );
        }

        await connection.commit();
        res.json({ mensaje: "Venta movida a la papelera y stock restaurado" });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// 5. Obtener detalle de un pedido específico
exports.obtenerDetallePedido = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT d.*, p.nombre 
            FROM detalles_pedido d
            JOIN productos p ON d.id_producto = p.id
            WHERE d.id_pedido = ?`;
        const [rows] = await db.query(query, [id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Eliminar permanentemente de la DB
exports.eliminarPedido = async (req, res) => {
    const { id } = req.params;
    try {
        // No restauramos stock aquí porque se supone que ya se hizo al cancelar
        await db.query('DELETE FROM detalles_pedido WHERE id_pedido = ?', [id]);
        await db.query('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
        res.json({ mensaje: "Venta eliminada permanentemente de la base de datos" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 7. Estadísticas del Dashboard (Solo suma lo NO CANCELADO)
exports.obtenerEstadisticas = async (req, res) => {
    try {
        const [ventas] = await db.query('SELECT SUM(total) as totalVentas FROM pedidos WHERE estado = "completado"');
        const [stockBajo] = await db.query('SELECT COUNT(*) as bajoStock FROM productos WHERE stock < 5');
        const [ventasHoy] = await db.query('SELECT COUNT(*) as totalHoy FROM pedidos WHERE DATE(fecha) = CURDATE() AND estado = "completado"');
        
        res.json({
            totalVentas: ventas[0].totalVentas || 0,
            bajoStock: stockBajo[0].bajoStock || 0,
            ventasHoy: ventasHoy[0].totalHoy || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};