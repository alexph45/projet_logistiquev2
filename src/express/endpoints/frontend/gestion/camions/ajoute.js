/**
 * @file camions.js
 * @author Maxencexz
 * @description Endpoint qui affiche la page de gestion des camions
 */

const logger = require("../../../../../utils/logger");
const databaseManager = require("../../../../../database/databaseManager");

module.exports = {
    "enabled": true,
    "method": "POST",
    "path": "/camions",
    "execute": async function (routerRequest, routerResponse) {

        if (!routerRequest.isLogged) {
            return routerResponse.redirect("/");
        }

        // Check if the user has the required permissions
        const user = routerRequest.user;
        const requiredPermissions = ["ADMIN", "MANAGE_TRUCKS"];

        if (!user.permissions.some(permission => requiredPermissions.includes(permission))) {
            logger.warning("[ADMINISTRATION] L'utilisateur " + user.email + " a tenté d'ajouter un nouveau camion sans les permissions nécessaires.");
            return routerResponse.redirect("/");
        }

        // On obtient les données du formulaire
        const { marque, modele, immatriculation, poids, hauteur, longueur, largeur } = routerRequest.body;

        // On vérifie que la marque et le modèle sont valides
        const models = {
            VOLVO: [{
                value: "VOLVO_VNL",
                label: "Volvo VNL"
            },
            {
                value: "VOLVO_VNR",
                label: "Volvo VNR"
            },
            {
                value: "VOLVO_VHD",
                label: "Volvo VHD"
            }
            ],
            MERCEDES: [{
                value: "MERCEDES_BENZ_ACTROS",
                label: "Mercedes-Benz Actros"
            },
            {
                value: "MERCEDES_BENZ_Antos",
                label: "Mercedes-Benz Antos"
            },
            {
                value: "MERCEDES_BENZ_Arocs",
                label: "Mercedes-Benz Arocs"
            }
            ],
            RENAULT: [{
                value: "RENAULT_T",
                label: "Renault T"
            },
            {
                value: "RENAULT_K",
                label: "Renault K"
            },
            {
                value: "RENAULT_C",
                label: "Renault C"
            }
            ],
            FREIGHTLINER: [{
                value: "FREIGHTLINER_CASCADIA",
                label: "Freightliner Cascadia"
            },
            {
                value: "FREIGHTLINER_CORONADO",
                label: "Freightliner Coronado"
            },
            {
                value: "FREIGHTLINER_M2",
                label: "Freightliner M2"
            }
            ],
            KENWORTH: [{
                value: "KENWORTH_T680",
                label: "Kenworth T680"
            },
            {
                value: "KENWORTH_T880",
                label: "Kenworth T880"
            },
            {
                value: "KENWORTH_W990",
                label: "Kenworth W990"
            }
            ],
            TESLA: [{
                value: "TESLA_SEMI",
                label: "Tesla Semi"
            }]
        };

        // Validate fields: marque and modele
        if (!marque || !modele) {
            return routerResponse.status(400).send("Marque et modèle sont requis.");
        }

        if (!models[marque.toUpperCase()]) {
            return routerResponse.status(400).send("Marque invalide.");
        }

        const modelExists = models[marque.toUpperCase()].some(m => m.value === modele);
        if (!modelExists) {
            return routerResponse.status(400).send("Modèle invalide pour la marque spécifiée.");
        }

        // Validate immatriculation (Assuming format like 'AB-123-CD')
        const immatriculationPattern = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/;
        if (!immatriculationPattern.test(immatriculation)) {
            return routerResponse.status(400).send("Immatriculation invalide.");
        }

        // Validate poids, hauteur, longueur, largeur (ensure they are positive numbers)
        if (isNaN(poids) || poids <= 0) {
            return routerResponse.status(400).send("Poids invalide.");
        }

        await databaseManager.camions.editCamion({
            id: require("uuid").v4(),
        }, {
            marque,
            modele,
            immatriculation,
            poids,
            dimensions: {
                hauteur,
                longueur,
                largeur
            }
        });

        // On affiche la page de login
        routerResponse.status(200).redirect("/admin/camions")

    }
}