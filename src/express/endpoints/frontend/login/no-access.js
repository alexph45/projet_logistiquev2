/**
 * @file login.js
 * @author Maxencexz
 * @description Endpoint qui affiche la page de connexion
 */

module.exports = {
    "enabled": true,
    "method": "GET",
    "path": "/no-access",
    "execute": async function (routerRequest, routerResponse) {

        if(!routerRequest.isLogged || routerRequest.user.status) {
            return routerResponse.redirect("/");
        }

        // On affiche la page de login
        routerResponse.status(200).render("login/no-access");

    }
}