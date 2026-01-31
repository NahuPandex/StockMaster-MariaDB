const db = require('../config/db');

// Obtener pedidos cancelados
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

// RESTAURAR PEDIDO Y MERMAR STOCK NUEVAMENTE
exports.restaurarVenta = async (req, res) => {
    const { id } = req.params;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // A. Cambiar estado de 'cancelado' a 'completado'
        await connection.query('UPDATE pedidos SET estado = "completado" WHERE id_pedido = ?', [id]);

        // B. Buscar los productos de ese pedido para volver a MERMAR el stock
        const [detalles] = await connection.query(
            'SELECT id_producto, cantidad FROM detalles_pedido WHERE id_pedido = ?', [id]
        );

        for (const item of detalles) {
            // MERMA: Restamos (-) la cantidad del stock actual
            await connection.query(
                'UPDATE productos SET stock = stock - ? WHERE id = ?',
                [item.cantidad, item.id_producto]
            );
        }

        await connection.commit();
        res.json({ mensaje: "Venta restaurada y stock mermado nuevamente" });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "Error al restaurar: " + error.message });
    } finally {
        connection.release();
    }
};

// Borrado definitivo
exports.vaciarVenta = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM detalles_pedido WHERE id_pedido = ?', [id]);
        await db.query('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
        res.json({ mensaje: "Venta eliminada permanentemente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};