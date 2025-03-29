/**
 * @file membres.js
 * @author Maxencexz
 * @description Endpoint qui affiche la page de gestion des membres
 */

const logger = require("../../../../../utils/logger");
const databaseManager = require("../../../../../database/databaseManager");

module.exports = {
    "enabled": true,
    "method": "GET",
    "path": "/admin/sacs",
    "execute": async function (routerRequest, routerResponse) {

        if (!routerRequest.isLogged) {
            return routerResponse.redirect("/");
        }

        // Check if the user has the required permissions
        const user = routerRequest.user;
        const requiredPermissions = ["ADMIN", "VIEW_DELIVERIES"];

        if (!user.permissions.some(permission => requiredPermissions.includes(permission))) {
            logger.warning("[ADMINISTRATION] L'utilisateur " + user.email + " a tenté d'accéder à la page de gestion des sacs sans les permissions nécessaires.");
            return routerResponse.redirect("/");
        }

        const sacs = await databaseManager.sacs.getSacs({});

        // On affiche la page de login
        routerResponse.status(200).render("admin/sacs/sacs", { user: routerRequest.user, sacs });

    }
}