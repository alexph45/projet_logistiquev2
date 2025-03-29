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

        const { camion, chauffeur, date_debut, date_fin } = routerRequest.body;

        // On vérifie que tout les champs sont remplis
        if (!camion || !chauffeur || !date_debut || !date_fin) {
            return routerResponse.status(400).json({
                success: false,
                message: "Veuillez remplir tout les champs."
            })
        }

        // On vérifie que la date de début est bien avant la date de fin
        if (new Date(date_debut) >= new Date(date_fin)) {
            return routerResponse.status(400).json({
                success: false,
                message: "La date de début doit être avant la date de fin."
            })
        }

        const livraisonId = require("uuid").v4();
        const livraison = await databaseManager.livraisons.editLivraison({
            id: livraisonId
        }, {
            camion: camion,
            livreur: chauffeur,
            colis: [],
            livreur: chauffeur,
            dateDebut: new Date(date_debut),
            dateFin: new Date(date_fin),
            status: "inactive"
        })

        // On affiche la page de login
        routerResponse.status(200).redirect("/logistique/livraison?id=" + livraisonId)

    }
}