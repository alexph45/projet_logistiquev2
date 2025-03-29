/**
 * @file camions.js
 * @author Maxencexz
 * @description Endpoint qui affiche la page de gestion des camions
 */

const logger = require("../../../../../utils/logger");
const databaseManager = require("../../../../../database/databaseManager");

module.exports = {
    "enabled": true,
    "method": "GET",
    "path": "/admin/camions",
    "execute": async function (routerRequest, routerResponse) {

        if (!routerRequest.isLogged) {
            return routerResponse.redirect("/");
        }

        // Check if the user has the required permissions
        const user = routerRequest.user;
        const requiredPermissions = ["ADMIN", "VIEW_TRUCKS"];

        if (!user.permissions.some(permission => requiredPermissions.includes(permission))) {
            logger.warning("[ADMINISTRATION] L'utilisateur " + user.email + " a tenté d'accéder à la page de gestion des camions sans les permissions nécessaires.");
            return routerResponse.redirect("/");
        }

        const camions = await databaseManager.camions.getCamions({});

        // On affiche la page de login
        routerResponse.status(200).render("admin/camions/camions", { user: routerRequest.user, camions });

    }
}