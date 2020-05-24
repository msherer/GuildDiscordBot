const Command = require('../Command');
const httpsClient = require('../Utilities/Http/Client');
const puppeteer = require('puppeteer');
const fs = require('fs');

class Craft extends Command {
    commandName = 'Craft';

    commandAliases = ['craft'];

    processMessage(message, tokens) {
        const log = this.dependencies.log;
        var queryString = this.generateQueryString(tokens);
        log.log(message, 'craft', `Query: ${queryString}`);
        let response;
        const msg = message;
        const opts = {
            'method': 'GET',
            'hostname': 'classic.wowhead.com',
            'path': '/search/suggestions-template?q=' + queryString
        };

        (new httpsClient).sendGet(opts).then(results => {
            let matchingResults = this.getCraftResults(results);

            console.log("----------------");
            console.log('MATCHING RESULTS');
            console.log(matchingResults);
            console.log("----------------");

            if (matchingResults.length === 1) {
                response = this.getMatchingImage(msg, matchingResults);
            } else {
                response = this.getMatchingWithoutImage(matchingResults);
            }

            if (response.crafters.length >= 1) {
                if (response.files) {
                    msg.channel.send(response.crafters, {files: [response.files]});
                } else {
                    msg.channel.send(response.crafters);
                }
            }
        }, this);
    }

    getCraftResults(results) {
        var crafterConfig = this.dependencies.craft;
        const keywords = ['Enchant', 'Plans', 'Recipe', 'Pattern', 'Schematic'];
        let craftables = [];

        Object.keys(results).forEach(function (key) {
                keywords.forEach(keyword => {
                    if (results[key].name.startsWith('Enchant') && keyword === 'Enchant' && results[key].type === 6) {
                        craftables.push(this.findRecipeMatches(results[key], keyword, crafterConfig));
                    } else if (keyword !== 'Enchant' && results[key].name.startsWith(keyword) && results[key].type === 3) {
                        craftables.push(this.findRecipeMatches(results[key], keyword, crafterConfig));
                    }
                });
        }, this);

        return craftables;
    }

    findRecipeMatches(result, keyword, crafterConfig) {
        var n = result.name;
        var str = keyword.toLowerCase();
        var recipes = crafterConfig[str];
        let crafters = '';

        console.log("----------------");
        console.log("RECIPIES:");
        console.log(recipes);
        if (recipes !== undefined && recipes.length !== 0) {
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
        }

        return {
            result: result,
            crafters: crafters
        };
    }

    getMatchingWithoutImage(msg, results) {
        let response = {
            "crafters": "",
            "files": false
        };

        results.forEach(result => {
            const c = result.crafters.trim() !== '' ? result.crafters.trim() : 'None';
            response['crafters'] += `${result.result.name}\nCrafters: ${c}\n\n`;
        });

        return response;
    }

    // Temporarily passing in message client until I can figure out the scoping issue with this async function
    getMatchingImage(msg, results) {
        let response = {
            "crafters": "",
            "files": false
        };
        const result = results[0];
        var existingFile = 'images/' + result.result.id + '.png';

        if (!fs.existsSync(existingFile)) {
            console.log('File does not exist, creating...');
            (async () => {
                const browser = await puppeteer.launch({
                    //headless: true,
                    args: ['--no-sandbox']
                });
                const page = await browser.newPage();
                await page.setViewport({
                    width: 2880,
                    height: 1800,
                    deviceScaleFactor: 1,
                });
                await page.setDefaultNavigationTimeout(0);
                await page.goto(
                    `https://classic.wowhead.com/${result.result.typeName.toLowerCase()}=${result.result.id}`,
                    {"waitUntil": "domcontentloaded"}
                );

                async function screenshotDOMElement(opts = {}) {
                    const padding = 'padding' in opts ? opts.padding : 0;
                    const path = 'path' in opts ? opts.path : null;
                    const selector = opts.selector;
                    console.log(`Selector: ${opts.selector}`);
                    if (!selector)
                        throw Error('Please provide a selector.');

                    const rect = await page.evaluate(selector => {
                        const element = document.querySelector(selector);
                        if (!element)
                            return null;
                        const {x, y, width, height} = element.getBoundingClientRect();
                        return {left: x, top: y, width, height, id: element.id};
                    }, selector);

                    if (!rect)
                        throw Error(`Could not find element that matches selector: ${selector}.`);

                    console.log('Screenshotting image now...');
                    return await page.screenshot({
                        path,
                        clip: {
                            x: rect.left - (padding + 55),
                            y: rect.top - (padding - 10),
                            width: rect.width + 50 + padding * 2,
                            height: rect.height - 15 + padding * 2
                        }
                    });
                }

                await screenshotDOMElement({
                    path: 'images/' + result.result.id + '.png',
                    selector: '#tt' + result.result.id,
                    id: result.result.id,
                    padding: 16
                });

                console.log('After screenshot function.');

                console.log('Closing browser');
                await browser.close();

                console.log('Returning response.');
                const c = result.crafters.trim() !== '' ? result.crafters.trim() : 'None';

                response.crafters = `${result.result.name}\nCrafters: ${c}`
                response.files = `images/${result.result.id}.png`;
                msg.channel.send(response.crafters, {files: [response.files]});
            })();
        } else {
            const c = result.crafters.trim() !== '' ? result.crafters.trim() : 'None';

            response.crafters = `${result.result.name}\nCrafters: ${c}`
            response.files = `images/${result.result.id}.png`;
        }

        return response;
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
