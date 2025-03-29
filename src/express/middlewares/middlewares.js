/**
 * @file middlewares.js
 * @author Maxencexz
 * @description Module contenant tous les middlewares nécessaires à l'application.
 */

// Importation des modules requis
const __modules = {
    ironSession: require("iron-session"),
    database: require("../../database/databaseManager")
}

module.exports = {

    // Middleware pour initialiser la session de l'utilisateur
    sessionMiddleware: async function (request, response, next) {

        try {
            // Récupération de la session de l'utilisateur à partir du cookie
            request.session = await __modules.ironSession.getIronSession(request, response, {
                cookieName: process.env.SESSION_COOKIE_NAME,
                password: process.env.SESSION_COOKIE_SECRET,
                cookieOptions: {
                    httpOnly: true, // La session est accessible uniquement en HTTP (pas via JavaScript)
                    secure: (process.env.NODE_ENV === 'production'), // La session est sécurisée uniquement en production
                    sameSite: "lax", // Protection contre les attaques CSRF
                }
            });

            // Vérification de la présence de la session de l'utilisateur (email)
            if (request.session && request.session.user) {

                // Récupération de l'utilisateur depuis la base de données
                const utilisateur = await __modules.database.utilisateurs.getUtilisateur({
                    email: request.session.user.email
                });

                if (utilisateur) {

                    request.user = utilisateur;
                    request.isLogged = true;

                    if (!utilisateur.status && request.path !== "/no-access") {
                        return response.redirect("/no-access");
                    }

                } else {

                    request.session.destroy();
                    return response.redirect("/login");

                }

            } else {

                request.user = null;
                request.isLogged = false;

            }

            // Passage au middleware suivant
            next();
        } catch (error) {
            console.log(error);
            // Si une erreur survient lors de l'initialisation de la session, on renvoie une erreur serveur
            return response.status(500).json({
                message: "Échec de l'initialisation de la session."
            });
        }
    },

};