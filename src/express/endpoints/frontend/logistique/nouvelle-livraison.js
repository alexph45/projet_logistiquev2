/**
 * @file nouvelle-livraison.js
 * @author Maxencexz
 * @description Endpoint qui affiche la page de gestion des livraisons
 */

const logger = require("../../../../utils/logger");
const databaseManager = require("../../../../database/databaseManager");

module.exports = {
    "enabled": true,
    "method": "GET",
    "path": "/logistique/nouvelle-livraison",
    "execute": async function (routerRequest, routerResponse) {

        if (!routerRequest.isLogged) {
            return routerResponse.redirect("/");
        }

        // Check if the user has the required permissions
        const user = routerRequest.user;
        const requiredPermissions = ["ADMIN", "MANAGE_DELIVERIES"];

        if (!user.permissions.some(permission => requiredPermissions.includes(permission))) {
            logger.warning("[ADMINISTRATION] L'utilisateur " + user.email + " a tenté d'accéder à la page de création des livraisons sans les permissions nécessaires.");
            return routerResponse.redirect("/");
        }

        const livraisons = await databaseManager.livraisons.getLivraisons({});
        const camions = await databaseManager.camions.getCamions({});
        const utilisateurs = await databaseManager.utilisateurs.getUtilisateurs({});

        // On garde uniquement les utilisateurs dont le compte a été activé
        const utilisateursActifs = utilisateurs.filter(utilisateur => utilisateur.status === true);

        // On affiche la page de login
        routerResponse.status(200).render("logistique/nouvelle-livraison", { user: routerRequest.user, livraisons, camions, utilisateurs: utilisateursActifs });

    }
}