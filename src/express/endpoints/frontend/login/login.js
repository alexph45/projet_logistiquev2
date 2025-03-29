/**
 * @file login.js
 * @author Maxencexz
 * @description Endpoint qui affiche la page de connexion
 */

module.exports = {
    "enabled": true,
    "method": "GET",
    "path": "/login",
    "execute": async function (routerRequest, routerResponse) {

        if(routerRequest.isLogged) {
            return routerResponse.redirect("/");
        }

        // On affiche la page de login
        routerResponse.status(200).render("login/login");

    }
}