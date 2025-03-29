/**
 * @file configuration-compte.js
 * @author Maxencexz
 * @description Configure le nom et le prénom de l'utilisateur
 */

const fs = require('fs');
const path = require('path');
const logger = require("../../../../utils/logger");
const database = require("../../../../database/databaseManager");
const bcrypt = require('bcrypt');

const BCRYPT_SALT_ROUNDS = 10;

module.exports = {
    "enabled": true,
    "method": "POST",
    "path": "/configuration-compte",
    "execute": async function (routerRequest, routerResponse) {

        if (!routerRequest.isLogged) {
            return routerResponse.redirect("/");
        }

        // On obtient le firstName et le lastName depuis le corps de la requête
        const firstName = routerRequest.body.firstName;
        const lastName = routerRequest.body.lastName;

        // On vérifie que le firstName/lastName est correct à l'aide d'une regex (min 3 caractères et max 30)
        if (!firstName || !firstName.match(/^[a-zA-Z]{3,30}$/)) return routerResponse.redirect("/");
        if (!lastName || !lastName.match(/^[a-zA-Z]{3,30}$/)) return routerResponse.redirect("/");

        await database.utilisateurs.editUtilisateur({
            email: routerRequest.user.email
        }, {
            nom: lastName,
            prenom: firstName
        })

        return routerResponse.redirect("/");

    }
}