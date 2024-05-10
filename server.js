// Importar módulos necesarios
const express = require("express");
// Importar funciones para generar y validar tokens JWT
const { generateJWT } = require("./helpers/generate-jwt");
const { validateJWT } = require("./helpers/validate-jwt");
// Importar las rutas definidas en el archivo routes.js
const routes = require("./routes/routes");
require("dotenv").config();
const path = require("path");

// Crear una instancia de la aplicación Express
const app = express();
// Obtener el número de puerto del archivo .env
const port = process.env.PORT;

// Middleware para procesar datos en formato JSON
app.use(express.json());
// Registrar las rutas definidas en routes.js
app.use(routes);
// Middleware para servir archivos estáticos desde el directorio 'public'
app.use(express.static("public"));

// Definir ruta para manejar la autenticación de agentes
app.get("/SignIn", generateJWT);
// Definir ruta para el dashboard, que requiere validación del token JWT
app.get("/Dashboard", validateJWT);

// Ruta genérica
app.get("*", (req, res) => {
  // Enviar el archivo 404.html como respuesta
  res.sendFile(path.join(__dirname, "/public", "404.html"));
});
// Iniciar el servidor y hacerlo escuchar en el puerto
app.listen(port, () => console.log(`Servidor iniciado en el puerto ${port}.`));
