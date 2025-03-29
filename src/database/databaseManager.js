/**
 * @file databaseManager.js
 * @description Fichier de gestion de la base de données.
 */

// On importe les modules nécessaires
const __modules = {
    Mongoose: require("mongoose"),
    MongoMemoryServer: require("mongodb-memory-server").MongoMemoryServer,
    UtilisateurSchema: require("./models/Utilisateur"),
    CamionSchema: require("./models/Camion"),
    LivraisonSchema: require("./models/Livraison"),
    SacSchema: require("./models/Sac"),
    ColisSchema: require("./models/Colis")
}

module.exports = {

    connect: async () => {
        try {

            const mongoServer = await __modules.MongoMemoryServer.create({
                instance: {
                    port: 60254,
                    dbName: "logistique_second",
                    dbPath: "C:\\MongoDBData"
                }
            });

            const uri = mongoServer.getUri();
            const dbName = "logistique_second";

            await __modules.Mongoose.connect(`${uri}${dbName}`);

            console.log(`Connected to database: ${dbName}`);
            console.log("URI:", `${uri}${dbName}`);

            return true;

        } catch (error) {

            console.error(error);
            return false;

        }
    },

    utilisateurs: {

        getUtilisateur: async (query) => {
            try {
                const utilisateur = await __modules.UtilisateurSchema.findOne(query);
                return utilisateur || null;
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        editUtilisateur: async (query, data) => {
            try {
                const result = await __modules.UtilisateurSchema.updateOne(
                    query,
                    { $set: { ...data } },
                    { upsert: true }
                );
                return result.modifiedCount > 0 || result.upsertedCount > 0;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        getUtilisateurs: async (query) => {
            try {
                const utilisateurs = await __modules.UtilisateurSchema.find(query);
                return utilisateurs || [];
            } catch (error) {
                console.error(error);
                return [];
            }
        },

    },

    camions: {

        getCamion: async (query) => {
            try {
                const camion = await __modules.CamionSchema.findOne(query);
                return camion || null;
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        editCamion: async (query, data) => {
            try {
                const result = await __modules.CamionSchema.updateOne(
                    query,
                    { $set: { ...data } },
                    { upsert: true }
                );
                return result.modifiedCount > 0 || result.upsertedCount > 0;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        getCamions: async (query) => {
            try {
                const camions = await __modules.CamionSchema.find(query);
                return camions || [];
            } catch (error) {
                console.error(error);
                return [];
            }
        },

    },

    livraisons: {

        getLivraison: async (query) => {
            try {
                const livraison = await __modules.LivraisonSchema.findOne(query);
                return livraison || null;
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        editLivraison: async (query, data) => {
            try {
                const result = await __modules.LivraisonSchema.updateOne(
                    query,
                    { $set: { ...data } },
                    { upsert: true }
                );
                return result.modifiedCount > 0 || result.upsertedCount > 0;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        getLivraisons: async (query) => {
            try {
                const livraisons = await __modules.LivraisonSchema.find(query);
                return livraisons || [];
            } catch (error) {
                console.error(error);
                return [];
            }
        },

    },

    sacs: {

        getSac: async (query) => {
            try {
                const livraison = await __modules.SacSchema.findOne(query);
                return livraison || null;
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        editSac: async (query, data) => {
            try {
                const result = await __modules.SacSchema.updateOne(
                    query,
                    { $set: { ...data } },
                    { upsert: true }
                );
                return result.modifiedCount > 0 || result.upsertedCount > 0;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        getSacs: async (query) => {
            try {
                const livraisons = await __modules.SacSchema.find(query);
                return livraisons || [];
            } catch (error) {
                console.error(error);
                return [];
            }
        },

    },

    colis: {

        getColis: async (query) => {
            try {
                const livraison = await __modules.ColisSchema.findOne(query);
                return livraison || null;
            } catch (error) {
                console.error(error);
                return null;
            }
        },

        editColis: async (query, data) => {
            try {
                const result = await __modules.ColisSchema.updateOne(
                    query,
                    { $set: { ...data } },
                    { upsert: true }
                );
                return result.modifiedCount > 0 || result.upsertedCount > 0;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        getToutLesColis: async (query) => {
            try {
                const livraisons = await __modules.ColisSchema.find(query);
                return livraisons || [];
            } catch (error) {
                console.error(error);
                return [];
            }
        },

    }

}