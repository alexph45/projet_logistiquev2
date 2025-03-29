/**
 * @file image.js
 * @author Maxencexz
 * @description Endpoint qui délivre les images
 */

const fs = require('fs');
const path = require('path');
const logger = require("../../../../utils/logger");

module.exports = {
    "enabled": true,
    "method": "GET",
    "path": "/cdn/image/:folder/:image",
    "execute": async function (routerRequest, routerResponse) {
        const folder = routerRequest.params.folder;
        const image = routerRequest.params.image;

        if (!folder || !image) {
            return routerResponse.status(400).send("Le dossier ou le nom de l'image est manquant.");
        }

        const imagePath = path.resolve(__dirname, "../../../../public/assets/images/", folder, image);

        fs.readFile(imagePath, (err, data) => {
            if (err) {
                return routerResponse.status(500).send("Une erreur s'est produite pendant la lecture de l'image, ou l'image n'existe pas.");
            }

            // Set appropriate content type based on image extension
            const ext = path.extname(image).toLowerCase();
            const contentType = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp'
            }[ext] || 'application/octet-stream';

            routerResponse.setHeader('Content-Type', contentType);
            routerResponse.send(data);
        });
    }
}