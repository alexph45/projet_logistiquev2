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
    "path": "/logistique/ajoutColis",
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
            logger.warning("[ADMINISTRATION] L'utilisateur " + user.email + " a tenté d'ajouter un colis.");
            return routerResponse.status(403).send({
                success: false,
                message: "Vous n'avez pas la permission d'ajouter un colis."
            });
        }

        // On obtient les informations depuis le body
        const { idColis, idLivraison, idSac, positionSac } = routerRequest.body;

        if (!idColis || !idLivraison || !idSac) {
            const missingFields = [];

            if (!idColis) missingFields.push("idColis");
            if (!idLivraison) missingFields.push("idLivraison");
            if (!idSac) missingFields.push("idSac");
            if (!positionSac) missingFields.push("positionSac");

            return routerResponse.status(400).send({
                success: false,
                message: "La requête n'est pas complète. Champ(s) manquant(s): " + missingFields.join(", ")
            });
        }

        // On vérifie que la livraison existe
        const livraison = await databaseManager.livraisons.getLivraison({ id: idLivraison });
        if (!livraison) {
            return routerResponse.status(404).send({
                success: false,
                message: "La livraison n'existe pas."
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

        if (colis.statut !== "ongoing") {
            return routerResponse.status(400).send({
                success: false,
                message: "Le colis a été indiqué comme étant déjà livré."
            });
        }

        // On vérifie que le sac existe
        const sac = await databaseManager.sacs.getSac({ id: idSac });
        if (!sac) {

            function generateRandomId() {
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let result = '';
                const length = 4;  // Maximum length of the ID

                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    result += characters.charAt(randomIndex);
                }

                return result;
            }

            await databaseManager.sacs.editSac({ id: idSac }, {
                id: idSac,
                label: generateRandomId()
            });
        }

        // On vérifie si 'idColis' est dans le tableau 'colis' de l'objet 'livraison'
        const colisExistant = livraison.colis.some(colis => colis.colis === idColis);

        if (colisExistant) {
            return routerResponse.status(400).send({
                success: false,
                message: "Le colis est déjà dans la livraison."
            });
        }

        // On ajoute le colis dans la livraison
        const listeColis = livraison.colis;
        listeColis.push({
            colis: idColis,
            sac: idSac
        });

        await databaseManager.colis.editColis({ id: idColis }, {
            positionSac: positionSac
        })

        console.log("positionSac");

        await databaseManager.livraisons.editLivraison({ id: idLivraison }, {
            colis: listeColis
        })

        // On renvoie un code 200
        return routerResponse.status(200).send({
            success: true,
            message: "Le colis a été ajouté à la livraison."
        });

    }
}