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
    "path": "/logistique/livraisons",
    "execute": async function (routerRequest, routerResponse) {

        if (!routerRequest.isLogged) {
            return routerResponse.redirect("/");
        }

        // Check if the user has the required permissions
        const user = routerRequest.user;
        const requiredPermissions = ["ADMIN", "VIEW_DELIVERIES"];

        if (!user.permissions.some(permission => requiredPermissions.includes(permission))) {
            logger.warning("[ADMINISTRATION] L'utilisateur " + user.email + " a tenté d'accéder à la page de création des livraisons sans les permissions nécessaires.");
            return routerResponse.redirect("/");
        }

        const livraisons = await databaseManager.livraisons.getLivraisons({});

        // Pour chaque livraisons, on obtient les infos du camion et du chauffeur
        for (let i = 0; i < livraisons.length; i++) {
            const livraison = livraisons[i];
            const camion = await databaseManager.camions.getCamion({ id: livraison.camion });
            const chauffeur = await databaseManager.utilisateurs.getUtilisateur({ id: livraison.livreur });

            livraisons[i] = {
                ...livraison,
                camion,
                chauffeur
            }
        }

        // On affiche la page de login
        routerResponse.status(200).render("logistique/livraisons", { user: routerRequest.user, livraisons });

    }
}