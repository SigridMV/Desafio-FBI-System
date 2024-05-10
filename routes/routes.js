// Importar los módulos necesarios
const jwt = require('jsonwebtoken');
const agents = require('../data/agentes');
const express = require('express'); // Importar Express
const router = express.Router();  // Crear un enrutador de Express

// Ruta para autenticar a un agente (Inicio de sesión)
router.post('/SignIn', (req, res) => {
     // Obtener el email y la contraseña del cuerpo de la solicitud
    const { email, password } = req.body;
    // Buscar al agente (usuario) correspondiente en el array de agentes
    const agent = agents.find(agent => agent.email === email && agent.password === password);
    // Si se encontró al agente
    if (agent) {
        // Generar un token JWT con el email del agente
        const token = jwt.sign({
            email: agent.email,
        }, process.env.SECRETKEY, { expiresIn: '2m' });
         // Enviar el token como respuesta en formato JSON
        res.status(200).json({ token });
    } else {
        // Si las credenciales son incorrectas, devolver un error 401 (No autorizado)
        res.status(401).json({ error: 'Credenciales incorrectas' });
    }
});

// Ruta para el dashboard, que requiere autenticación con token JWT
router.get('/Dashboard', (req, res) => {
     // Obtener el token de la consulta (query) de la URL
    const token = req.query.token;
    if (!token) {
        // Si no se proporcionó un token, devolver un error 401 (No autorizado)
        return res.status(401).json({ error: 'No se proporcionó un token' });
    }
     // Verificar el token JWT utilizando la clave secreta
    jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
        // Si hay un error al verificar el token, devolver un error 401 (No autorizado)
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        // Si el token es válido, obtener el email decodificado del agente
        const email = decoded.email;
        return res.status(200).send(`Bienvenido al Dashboard ${email}`);
    });
});


router.post('/SignIn', (req, res) => {
     
    if (agent) {
        const token = jwt.sign({
            email: agent.email,
        }, process.env.SECRETKEY, { expiresIn: '2m' });

        const htmlResponse = `
            <p>Bienvenido, ${agent.email}</p>
            <a href="/Dashboard?token=${token}">Ir al Dashboard</a>
            <script>
                sessionStorage.setItem('token', '${token}');
            </script>
        `;
        res.send(htmlResponse);
    } else {
        // Devolver error si las credenciales son incorrectas
    }
});



module.exports = router;
