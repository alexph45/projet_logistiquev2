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
    "path": "/logistique/livraison",
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

        // Ob vérifie qu'un ID est bien passé en paramètre
        if (!routerRequest.query.id) {
            return routerResponse.redirect("/logistique/livraisons");
        }

        const livraison = await databaseManager.livraisons.getLivraison({
            id: routerRequest.query.id
        });
        if(!livraison) {
            return routerResponse.redirect("/logistique/livraisons");
        }

        // Pour chaque colis dans livraison.colis[i], on obtient les informations du sac
        for (let i = 0; i < livraison.colis.length; i++) {
            const colis = livraison.colis[i];
            const sac = await databaseManager.sacs.getSac({
                id: colis.sac
            });

            if (sac) {
                livraison.colis[i].colis = await databaseManager.colis.getColis({ id: colis.colis });
                livraison.colis[i].sac = await databaseManager.sacs.getSac({ id: colis.sac });
            }
        }

        console.log(livraison);

        // On affiche la page de login
        routerResponse.status(200).render("logistique/livraison", { user: routerRequest.user, livraison });

    }
}