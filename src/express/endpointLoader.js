/**
 * @file endpointsLoader.js
 * @author Maxencexz
 * @description Charge de façon dynamique les endpoints de l'application.
 */

// Importation des modules nécessaires
const path = require("path");
const fs = require("fs");
const logger = require("../utils/logger");

const middlewaresList = require("./middlewares/middlewares");

// Fonction permettant de configurer une route (endpoint) dans l'application Express
function configurerRoute(app, routerData) {
    const middlewares = [];

    // Si des middlewares spécifiques sont définis pour l'endpoint, on les ajoute
    if (Array.isArray(routerData.middlewares)) {
        middlewares.push(...routerData.middlewares);
    }

    // Fonction pour exécuter les routes avec gestion des erreurs
    const executeWithCatch = async (req, res, next) => {
        try {
            await routerData.execute(req, res);
        } catch (error) {
            logger.error(`[SERVEUR EXPRESS] Erreur détectée pour l'endpoint ${routerData.method} ${routerData.path}: ${error}`);
            res.status(500).json({
                erreur: {
                    message: "Une erreur inattendue s'est produite.",
                    type: "erreur_serveur",
                    code: "erreur_interne_serveur",
                },
            });
        }
    };

    // Ajout de la fonction d'exécution avec gestion d'erreurs dans la liste des middlewares
    middlewares.push(executeWithCatch);

    // Enregistrement de la route dans l'application Express en fonction de la méthode HTTP
    const { method, path } = routerData;
    var loaded = true;
    switch (method) {
        case "GET":
            app.get(path, middlewares);
            break;
        case "POST":
            app.post(path, middlewares);
            break;
        case "DELETE":
            app.delete(path, middlewares);
            break;
        case "PUT":
            app.put(path, middlewares);
            break;
        default:
            loaded = false;
            logger.warning(`[SERVEUR EXPRESS] L'endpoint ${path} est configuré pour utiliser une méthode non supportée ou invalide. Skipping...`);
            break;
    }

    // Affichage d'un message de confirmation dans la console
    if (loaded) {
        logger.info(`[SERVEUR EXPRESS] Endpoint chargé avec succès : ${path} [${method}]`);
    }
}

// Fonction récursive pour charger les endpoints à partir du dossier
async function chargerEndpoints(app, cheminDossier) {
    const fichiers = fs.readdirSync(cheminDossier);

    // Tableaux pour les endpoints avec priorités normales et faibles
    const normalPriorityEndpoints = [];
    const lowPriorityEndpoints = [];

    fichiers.forEach((fichier) => {
        const cheminFichier = path.resolve(cheminDossier, fichier);
        const statsFichier = fs.statSync(cheminFichier);

        if (statsFichier.isFile() && fichier.endsWith(".js")) {
            const donneesRouteur = require(cheminFichier);

            // Vérification si l'endpoint est activé et priorisation
            if (donneesRouteur.enabled) {
                if (donneesRouteur.lowRegisterPriority) {
                    lowPriorityEndpoints.push(donneesRouteur);
                } else {
                    normalPriorityEndpoints.push(donneesRouteur);
                }
            }
        } else if (statsFichier.isDirectory()) {
            // Appel récursif pour traiter les sous-dossiers
            chargerEndpoints(app, cheminFichier);
        }
    });

    // Chargement des endpoints avec priorité normale
    for (const routeur of normalPriorityEndpoints) {
        await configurerRoute(app, routeur);
    }

    // Chargement des endpoints avec priorité basse
    for (const routeur of lowPriorityEndpoints) {
        await configurerRoute(app, routeur);
    }
}

// Exportation de la fonction principale pour charger les endpoints
module.exports = async function (app) {
    // Détermination du dossier contenant tous les endpoints
    const endpointsDir = path.join(__dirname, "endpoints");

    try {
        // Chargement des endpoints à partir du dossier spécifié
        await chargerEndpoints(app, endpointsDir);
    } catch (error) {
        logger(`[SERVEUR EXPRESS] Erreur lors du chargement des endpoints : ${error.message}`);
    }
};