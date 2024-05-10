const jwt = require('jsonwebtoken');
const agents = require('../data/agentes');
const { request, response } = require('express');

const validateJWT = (req = request, res = response) => {
    const { token } = req.query;
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición.'
        });
    }
    jwt.verify(token, process.env.SECRETKEY, (err, data) => {
        err ? res.status(401).send({ error: "401 Unauthorized", message: err.message }) : res.send(`Bienvenido al Dashboard ${data.data.email}`)
    });
};

module.exports = {
    validateJWT
}