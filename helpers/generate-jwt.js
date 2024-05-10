const jwt = require('jsonwebtoken');
const agents = require('../data/agentes');
const { request, response } = require('express');

const generateJWT = (req = request, res = response) => {
    const { email, password } = req.query;
    try {
        // Verificar si el usuario existe
        const agent = agents.find(agent => agent.email === email && agent.password === password);
        // Crear Token
        if (agent) {
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + 120,
                data: agent,
            },
            process.env.SECRETKEY);
            res.send(`<a href="/Dashboard?token=${token}"><p> Ir al Dashboard</p></a>
            Bienvenido, ${email}.
            <script>
            sessionStorage.setItem('token', JSON.stringify("${token}"));
            </script>`);
        }else{
            res.status(400).redirect('/error.html');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
};

module.exports = {
    generateJWT
}