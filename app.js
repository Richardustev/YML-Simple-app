const express = require('express');
const yaml = require('yamljs');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const configPath = path.join(__dirname, 'config/config.yml');
let config = yaml.load(configPath);

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Servir archivos estáticos de Bootstrap desde node_modules
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// Ruta principal
app.get('/', (req, res) => {
    res.render('index', {
        titleSize: config.styles.titleSize,
        showNews: config.news.showNews,
        modoOscuro: config.styles.modoOscuro
    });
});

// Ruta para la página de configuración
app.get('/config', (req, res) => {
    res.render('config', {
        titleSize: config.styles.titleSize,
        showNews: config.news.showNews,
        modoOscuro: config.styles.modoOscuro
    });
});

// Ruta para actualizar la configuración
app.post('/update-config', (req, res) => {
    const { titleSize, showNews, modoOscuro } = req.body;

    // Actualizar el objeto de configuración
    config.styles.titleSize = titleSize;
    config.news.showNews = showNews === 'on'; // 'on' si el checkbox está marcado
    config.styles.modoOscuro = modoOscuro === 'on'; // 'on' si el checkbox está marcado

    // Convertir el objeto a YAML y guardarlo en el archivo
    const yamlString = yaml.stringify(config);
    fs.writeFileSync(configPath, yamlString, 'utf8');

    // Redirigir a la página principal para ver los cambios
    res.redirect('/');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});