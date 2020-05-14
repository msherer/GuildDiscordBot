const Command = require('../Command');
const httpsClient = require('../Utilities/Http/Client');
const puppeteer = require('puppeteer');
const fs = require('fs');

class Craft extends Command {
    commandName = 'Craft';

    commandAliases = ['craft'];

    processMessage(message, tokens) {
        var crafterConfig = this.dependencies.craft;
        console.log(crafterConfig);
        const keywords = ['Formula', 'Plans', 'Recipe', 'Pattern', 'Schematic'];
        var queryString = this.generateQueryString(tokens);
        const msg = message;
        const opts = {
            'method': 'GET',
            'hostname': 'classic.wowhead.com',
            'path': '/search/suggestions-template?q=' + queryString
        };

        (new httpsClient).sendGet(opts).then(results => {
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

                            var existingFile = 'images/' + results[key].id + '.png';
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
                                        'https://classic.wowhead.com/item=' + results[key].id,
                                        {"waitUntil": "domcontentloaded"}
                                    );

                                    async function screenshotDOMElement(opts = {}) {
                                        const padding = 'padding' in opts ? opts.padding : 0;
                                        const path = 'path' in opts ? opts.path : null;
                                        const selector = opts.selector;
                                        console.log(opts.selector);
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
                                        path: 'images/' + results[key].id + '.png',
                                        selector: '#tt' + results[key].id,
                                        id: results[key].id,
                                        padding: 16
                                    });

                                    console.log('After screenshot function.');

                                    console.log('Closing browser');
                                    await browser.close();

                                    console.log('Returning response.');
                                    var craft = results[key].name
                                        + "\nCrafters: " + crafters.trim();
                                    msg.channel.send(craft, {files: ["images/" + results[key].id + ".png"]});
                                })();
                            } else {
                                console.log('Returning cached image.');
                                var craft = results[key].name
                                    + "\nCrafters: " + crafters.trim();
                                msg.channel.send(craft, {files: ["images/" + results[key].id + ".png"]});
                            }
                        }
                    });
                }
            });
        });
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
