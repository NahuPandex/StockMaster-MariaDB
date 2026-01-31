const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const { correo, contraseña } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        
        if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

        const usuario = rows[0];
        const valido = await bcrypt.compare(contraseña, usuario.contraseña);

        if (!valido) return res.status(401).json({ error: "Contraseña incorrecta" });

        // Enviamos los datos básicos al frontend (Sin la contraseña)
        res.json({ 
            id_user: usuario.id_user, 
            nombre: usuario.nombre, 
            rol: usuario.rol 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};