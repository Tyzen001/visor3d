// Archivo: puente.js
const fs = require('fs');
const path = require('path');

// --- Configuración ---
const RUTA_IMAGENES = 'C:/Users/Kute-lap/Downloads/3D/visor3d/images'; // La ruta a tu carpeta 'images'
const PUERTO = 5000; // Un puerto para la comunicación

// --- No necesitas cambiar nada debajo de esta línea ---
const http = require('http');

function vaciarYReemplazar(rutaDestino, rutaOrigen) {
    if (!fs.existsSync(rutaDestino)) {
        fs.mkdirSync(rutaDestino, { recursive: true });
    }
    fs.readdirSync(rutaDestino).forEach(file => fs.unlinkSync(path.join(rutaDestino, file)));
    fs.readdirSync(rutaOrigen).forEach(file => fs.copyFileSync(path.join(rutaOrigen, file), path.join(rutaDestino, file)));
}

const servidor = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/reemplazar' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const { producto, rutaHorizontal, rutaVertical } = JSON.parse(body);
                const destinoH = path.join(RUTA_IMAGENES, producto, 'horizontal');
                const destinoV = path.join(RUTA_IMAGENES, producto, 'vertical');

                vaciarYReemplazar(destinoH, rutaHorizontal);
                vaciarYReemplazar(destinoV, rutaVertical);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensaje: `¡ÉXITO! Las imágenes de '${producto}' han sido reemplazadas.` }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ mensaje: `ERROR: ${error.message}` }));
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

servidor.listen(PUERTO, () => {
    console.log('----------------------------------------------------');
    console.log('✅ EL PUENTE ESTÁ LISTO Y FUNCIONANDO.');
    console.log(`No cierres esta ventana. Déjala abierta en segundo plano.`);
    console.log('Ahora, abre tu archivo "panel.html" en el navegador.');
    console.log('----------------------------------------------------');
});