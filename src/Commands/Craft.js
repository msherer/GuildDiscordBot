const Command = require('../Command');
const crafterConfig = require('../../config/craft');
const https = require('https');

class Craft extends Command {
    commandName = 'Craft';

    commandAliases = ['craft'];

    processMessage(message, tokens) {
        console.log(crafterConfig);
        const keywords = ['Formula', 'Plans', 'Recipe'];
        var queryString = this.generateQueryString(tokens);
        const msg = message;
        const options = {
            'method': 'GET',
            'hostname': 'classic.wowhead.com',
            'path': '/search/suggestions-template?q=' + queryString
        };

        const req = https.request(options, function (res) {
            let chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                var payload = JSON.parse(body.toString());
                var results = payload.results;

                Object.keys(results).forEach(function (key) {
                    if (results[key].type === 3) {
                        keywords.forEach(keyword => {
                            if (results[key].name.includes(keyword)) {
                                var n = results[key].name;
                                var str = keyword.toLowerCase();
                                var recipes = crafterConfig[str];
                                let crafters = '';

                                console.log("----------------");
                                console.log("RECIPIES:");
                                console.log(recipes);
                                recipes.forEach(recipe => {
                                    if (recipe[n]) {
                                        console.log("----------------");
                                        console.log("RECIPE:");
                                        console.log(recipe);
                                        console.log("----------------");
                                        console.log(recipe[n]);
                                        console.log("----------------");
                                        crafters += recipe[n] + " ";
                                    }
                                });

                                var craft = results[key].name
                                    + "\nCrafters: " + crafters.trim();
                                msg.channel.send(craft);
                            }
                        });
                    }
                });
            });

            res.on("error", function (error) {
                console.error(error);
            });
        });

        req.end();
    }

    generateQueryString(tokens) {
        console.log(tokens);
        let queryString = '';

        for (var isk = 2; isk < tokens.length; isk++) {
            queryString += tokens[isk] + " ";
        }
        console.log(queryString);
        return encodeURI(queryString.trim());
    }
}

module.exports = Craft;
