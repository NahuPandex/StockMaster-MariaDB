const db = require('../config/db');
const bcrypt = require('bcrypt');

// 1. Obtener usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id_user, nombre, apellido, correo, rol FROM usuarios');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Crear usuario
exports.crearUsuario = async (req, res) => {
    const { nombre, apellido, correo, rol, contraseña } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPasword = await bcrypt.hash(contraseña, salt);
        const query = 'INSERT INTO usuarios (nombre, apellido, correo, rol, contraseña) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [nombre, apellido, correo, rol, hashPasword]);
        res.json({ id_user: result.insertId, nombre, apellido, correo, rol });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Login
exports.login = async (req, res) => {
    const { correo, contraseña } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (rows.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });
        const usuario = rows[0];
        const valido = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!valido) return res.status(401).json({ error: "Contraseña incorrecta" });
        res.json({ id_user: usuario.id_user, nombre: usuario.nombre, rol: usuario.rol });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Cambiar Contraseña
exports.cambiarPassword = async (req, res) => {
    const { id_user } = req.params;
    const { actual, nueva } = req.body;
    try {
        const [rows] = await db.query('SELECT contraseña FROM usuarios WHERE id_user = ?', [id_user]);
        if (rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
        const valido = await bcrypt.compare(actual, rows[0].contraseña);
        if (!valido) return res.status(401).json({ error: "La clave actual es incorrecta" });
        const salt = await bcrypt.genSalt(10);
        const nuevoHash = await bcrypt.hash(nueva, salt);
        await db.query('UPDATE usuarios SET contraseña = ? WHERE id_user = ?', [nuevoHash, id_user]);
        res.json({ message: "Contraseña actualizada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};