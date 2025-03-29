/**
 * @file index.js
 * @author Maxencexz
 * @description Fichier en charge de démarrer le serveur Express avec HTTPS.
 */

// On charge les variables d'environnement
require("dotenv").config();

// On importe les modules requis
const __modules = {
    express: require("express"),
    bodyParser: require("body-parser"),
    path: require("path"),
    middlewares: require("./src/express/middlewares/middlewares"),
    endpointsLoader: require("./src/express/endpointLoader"),
    nocache: require("nocache"),
    https: require("https"),
    fs: require("fs"),
    databaseManager: require("./src/database/databaseManager"),
    logger: require("./src/utils/logger"),
    picolors: require("picocolors")
};

// Création de l'application Express
const app = __modules.express();
app.disable("x-powered-by");
app.set("view engine", "ejs");
app.set("view cache", false);
app.set("trust proxy", 1);

// Servir les fichiers statiques
app.use(__modules.express.static(__dirname + "/src/public"));

// Configuration des chemins pour les vues
app.set("views", __modules.path.join(__dirname, "/src/views"));

// Utilisation des middlewares body-parser pour analyser les requêtes JSON et URL-encoded
app.use(__modules.bodyParser.json());
app.use(__modules.bodyParser.urlencoded({ extended: true }));

// Désactivation du cache côté client
app.use(__modules.nocache());

// Ajout des middlewares personnalisés
app.use(__modules.middlewares.sessionMiddleware);

// Chargement des certificats HTTPS
const httpsOptions = {
    key: __modules.fs.readFileSync(__dirname + "/certificate/localhost+2-key.pem"),
    cert: __modules.fs.readFileSync(__dirname + "/certificate/localhost+2.pem")
};

// Démarrage du serveur HTTPS
const server = __modules.https.createServer(httpsOptions, app).listen(process.env["EXPRESS_PORT"], async () => {
    try {

        console.log(__modules.picolors.bgCyan(__modules.picolors.white(`

         █████╗ ███████╗████████╗██████╗  ██████╗     ██████╗ ███████╗██╗   ██╗
        ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗    ██╔══██╗██╔════╝██║   ██║
        ███████║███████╗   ██║   ██████╔╝██║   ██║    ██║  ██║█████╗  ██║   ██║
        ██╔══██║╚════██║   ██║   ██╔══██╗██║   ██║    ██║  ██║██╔══╝  ╚██╗ ██╔╝
        ██║  ██║███████║   ██║   ██║  ██║╚██████╔╝    ██████╔╝███████╗ ╚████╔╝ 
        ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝     ╚═════╝ ╚══════╝  ╚═══╝
        Projet réalisé par REGIEN Valentin, DUVIVE Mathis, PECHROSSEL Alexandre, HAMAD Jamal, DESIR Lenaik
        `)));

        // Connexion à la base de données
        const dbConnect = await __modules.databaseManager.connect();
        if (!dbConnect) {
            __modules.logger.error("[BASE DE DONNÉES] Une erreur est survenue lors de la connexion à la base de données.");
            process.exit(1);
        }

        __modules.logger.success("[BASE DE DONNÉES] Connexion à la base de données réussie.");

    } catch (error) {
        __modules.logger.error("[BASE DE DONNÉES] Une erreur est survenue lors de la connexion à la base de données :", error);
        process.exit(1);
    }

    __modules.logger.success("[SERVEUR EXPRESS] Application Express démarrée en HTTPS ; chargement des endpoints...");

    try {
        // Chargement des endpoints de l'application
        await __modules.endpointsLoader(app);
        __modules.logger.success("[SERVEUR EXPRESS] Les endpoints ont été chargés avec succès.");
        __modules.logger.info("[SERVEUR EXPRESS] Le serveur Express est prêt à recevoir des connexions.");
    } catch (error) {
        __modules.logger.error("[SERVEUR EXPRESS] Une erreur est survenue lors du chargement des endpoints :", error);
        process.exit(1);
    }
});