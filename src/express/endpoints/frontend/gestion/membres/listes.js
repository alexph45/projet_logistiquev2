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
    "path": "/admin/membres",
    "execute": async function (routerRequest, routerResponse) {

        if (!routerRequest.isLogged) {
            return routerResponse.redirect("/");
        }

        // Check if the user has the required permissions
        const user = routerRequest.user;
        const requiredPermissions = ["ADMIN", "VIEW_MEMBERS"];

        if (!user.permissions.some(permission => requiredPermissions.includes(permission))) {
            logger.warning("[ADMINISTRATION] L'utilisateur " + user.email + " a tenté d'accéder à la page de gestion des membres sans les permissions nécessaires.");
            return routerResponse.redirect("/");
        }

        const members = await databaseManager.utilisateurs.getUtilisateurs({});

        // On affiche la page de login
        routerResponse.status(200).render("admin/membres/membres", { user: routerRequest.user, members });

    }
}