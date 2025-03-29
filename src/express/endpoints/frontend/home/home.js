/**
 * @file home.js
 * @author Maxencexz
 * @description Endpoint qui affiche la page d'accueil
 */

module.exports = {
    "enabled": true,
    "method": "GET",
    "path": "/",
    "execute": async function (routerRequest, routerResponse) {

        if(!routerRequest.isLogged) {
            return routerResponse.redirect("/login");
        }

        // On affiche la page de login
        routerResponse.status(200).render("home/home", { user: routerRequest.user });

    }
}