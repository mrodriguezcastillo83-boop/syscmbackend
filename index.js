const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a la base de datos usando las variables de entorno de Railway
const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Ruta de prueba para verificar que el servidor responde
app.get('/', (req, res) => {
    res.json({ mensaje: "API del Sistema Hospitalario Syscm20 funcionando correctamente" });
});

// --- EJEMPLO DE ENDPOINTS PARA PACIENTES ---

// Obtener todos los pacientes
app.get('/pacientes', (req, res) => {
    pool.query('SELECT * FROM pacientes', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Registrar un nuevo paciente
app.post('/pacientes', (req, res) => {
    const { nombre, edad, genero, telefono, direccion } = req.body;
    const query = 'INSERT INTO pacientes (nombre, edad, genero, telefono, direccion) VALUES (?, ?, ?, ?, ?)';
    pool.query(query, [nombre, edad, genero, telefono, direccion], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: results.insertId, mensaje: 'Paciente registrado con éxito' });
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});