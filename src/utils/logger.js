const picocolors = require("picocolors");

module.exports = {

    info: function (text){
        console.log(picocolors.blue(`[X] [INFO]      ${text}`));
    },

    warning: function (text){
        console.log(picocolors.bold(picocolors.yellow(`[X] [WARNING]   ${text}`)));
    },

    error: function (text){
        console.log(picocolors.bold(picocolors.red(`[X] [ERROR]     ${text}`)));
    },

    success: function (text){
        console.log(picocolors.green(`[✔] [SUCCESS]   ${text}`));
    },

    flashSuccess: function (text){
        console.log(picocolors.bgGreen(picocolors.white(`[✔] [SUCCESS]   ${text}`)));
    }

}