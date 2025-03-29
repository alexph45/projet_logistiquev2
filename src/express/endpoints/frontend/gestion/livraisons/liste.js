/**
 * @file livraisons.js
 * @author Maxencexz
 * @description Endpoint qui affiche la page de gestion des livraisons
 */

const logger = require("../../../../../utils/logger");
const databaseManager = require("../../../../../database/databaseManager");

module.exports = {
    "enabled": true,
    "method": "GET",
    "path": "/admin/livraisons",
    "execute": async function (routerRequest, routerResponse) {

        if (!routerRequest.isLogged) {
            return routerResponse.redirect("/");
        }

        // Check if the user has the required permissions
        const user = routerRequest.user;
        const requiredPermissions = ["ADMIN", "VIEW_DELIVERIES"];

        if (!user.permissions.some(permission => requiredPermissions.includes(permission))) {
            logger.warning("[ADMINISTRATION] L'utilisateur " + user.email + " a tenté d'accéder à la page de gestion des livraisons sans les permissions nécessaires.");
            return routerResponse.redirect("/");
        }

        const livraisons = await databaseManager.livraisons.getLivraisons({});

        // On affiche la page de login
        routerResponse.status(200).render("admin/livraisons/livraisons", { user: routerRequest.user, livraisons });

    }
}