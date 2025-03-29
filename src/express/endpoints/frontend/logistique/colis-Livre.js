/**
 * @file nouvelle-livraison.js
 * @author Maxencexz
 * @description Endpoint qui affiche la page de gestion des livraisons
 */

const logger = require("../../../../utils/logger");
const databaseManager = require("../../../../database/databaseManager");

module.exports = {
    "enabled": true,
    "method": "POST",
    "path": "/logistique/colis-delivered",
    "execute": async function (routerRequest, routerResponse) {

        if (!routerRequest.isLogged) {
            return routerResponse.status(403).send({
                success: false,
                message: "Utilisateur non connecté."
            })
        }

        // Check if the user has the required permissions
        const user = routerRequest.user;
        const requiredPermissions = ["ADMIN", "MANAGE_DELIVERIES"];

        if (!user.permissions.some(permission => requiredPermissions.includes(permission))) {
            logger.warning("[ADMINISTRATION] L'utilisateur " + user.email + " a tenté de marquer un colis comme étant livré.");
            return routerResponse.status(403).send({
                success: false,
                message: "Vous n'avez pas la permission d'effectuer cette action."
            });
        }

        // On obtient les informations depuis le body
        const { idColis } = routerRequest.body;

        if (!idColis) {
            const missingFields = [];

            if (!idColis) missingFields.push("idColis");

            return routerResponse.status(400).send({
                success: false,
                message: "La requête n'est pas complète. Champ(s) manquant(s): " + missingFields.join(", ")
            });
        }

        // On vérifie que le colis existe
        const colis = await databaseManager.colis.getColis({ id: idColis });
        if (!colis) {
            return routerResponse.status(404).send({
                success: false,
                message: "Le colis n'existe pas."
            });
        }

        await databaseManager.colis.editColis({ id: idColis }, {
            statut: "delivered"
        });

        // On renvoie un code 200
        return routerResponse.status(200).send({
            success: true,
            message: "Le colis a été livré."
        });

    }
}