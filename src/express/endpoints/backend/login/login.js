/**
 * @file login.js
 * @author Maxencexz
 * @description Fichier utilisé pour gérer les connexions et les déconnexions des utilisateurs.
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
    "path": "/login",
    "execute": async function (routerRequest, routerResponse) {

        // On obtient le mail et le mot de passe depuis le corps de la requête
        const email = routerRequest.body.email;
        const password = routerRequest.body.password;

        // On vérifie que le mail est correct à l'aide d'une regex
        if (!email || !email.match(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim)) {
            return routerResponse.status(400).json({
                success: false,
                message: "Veuillez saisir une adresse email valide."
            });
        }

        // On vérifie que le mot de passe est correct
        if (!password || !password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)) {
            return routerResponse.status(400).json({
                success: false,
                message: "Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre."
            });
        }

        // On vérifie si un utilisateur avec ce email existe
        const utilisateur = await database.utilisateurs.getUtilisateur({
            email: email
        })

        // Si l'utilisateur n'existe pas, on le crée
        if (!utilisateur) {
            logger.warning(`[TENTATIVE DE CONNEXION] Aucune compte trouvé pour l'adresse email ${email}. Création du compte...`);

            bcrypt.genSalt(BCRYPT_SALT_ROUNDS, async function (err, salt) {

                if (err) return routerResponse.status(400).json({
                    success: false,
                    message: "Une erreur s'est produite lors de la création du compte."
                });

                bcrypt.hash(password, salt, async function (err, hash) {

                    if (err) return routerResponse.status(400).json({
                        success: false,
                        message: "Une erreur s'est produite lors de la création du compte."
                    });

                    const creationSuccess = await database.utilisateurs.editUtilisateur({
                        email: email
                    }, {
                        id: require("uuid").v4(),
                        email: email,
                        password: hash,
                        status: true,
                        permissions: ["ADMIN"]
                    })

                    if(!creationSuccess) return routerResponse.status(400).json({
                        success: false,
                        message: "Une erreur s'est produite lors de la création du compte."
                    });

                    // On stock le mail de l'utilisateur dans la session
                    routerRequest.session.user = { email };
                    await routerRequest.session.save();

                    return routerResponse.status(200).json({
                        success: true,
                        message: "ok"
                    });

                })

            })

        } else {

            bcrypt.compare(password, utilisateur.password, async function (err, result) {

                if(err) return routerResponse.status(400).json({
                    success: false,
                    message: "Une erreur s'est produite lors de la connexion."
                });

                if(!result) return routerResponse.status(400).json({
                    success: false,
                    message: "Le mot de passe est incorrect."
                });

                // On stock le mail de l'utilisateur dans la session
                routerRequest.session.user = { email };
                await routerRequest.session.save();

                return routerResponse.status(200).json({
                    success: true,
                    message: "ok"
                });

            })

        }

    }
}