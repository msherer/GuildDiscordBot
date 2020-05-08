const Command = require('../Command');
const puppeteer = require('puppeteer');
const fs = require('fs');

class Logs extends Command
{
    commandName = 'Dpscheck';

    commandAliases = ['tps', 'hps', 'dps'];

    processMessage(message, tokens)
    {
        // !gdb [tps|hps|dps] [reportId] [boss]
        const reportType = tokens[1];
        const reportId = tokens[2];
        const term = this.generateQueryString(tokens);
        const msg = message;
        let bossMatch, logType, imagePath;

        // Hakkar's ID can also be 56... What do we do?
        // This applies to any boss that comes last in the warcraftlogs they use the
        // ID of "last" for some reason.
        this.dependencies.config.logs["bosses"].forEach(boss => {
            if (term === boss.name || term.toLowerCase() === boss.name || boss.name.toLowerCase().includes(term)) {
                bossMatch = boss;
            }
        });

        this.dependencies.config.logs["types"].forEach(type => {
            if (reportType === type.name) {
                logType = type;
            }
        });

        imagePath = `images/${reportId}/${bossMatch.id}.png`;

        if (!fs.existsSync(imagePath)) {
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
                await page.goto(`https://classic.warcraftlogs.com/reports/${reportId}/#fight=${bossMatch.id}&type=${logType.id}`);

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

                    var dir = `images/${reportId}`;

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir);
                    }

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
                    path: imagePath,
                    selector: '.summary-table',
                    id: reportId,
                    padding: 16
                });

                console.log('After screenshot function.');

                console.log('Closing browser');
                await browser.close();

                console.log('Returning response.');
                var res = `Report ID: ${reportId} | Type: ${reportType} | Boss: ${bossMatch.name}`;
                msg.channel.send(res, {files: [imagePath]});
                console.log('Response returned.');
            })();
        } else {
            console.log('Returning cached image.');
            var res = `Report ID: ${reportId} | Type: ${reportType} | Boss: ${bossMatch.name}`;
            msg.channel.send(res, {files: [imagePath]});
            console.log('Response returned.');
        }
    }

    generateQueryString(tokens) {
        console.log(tokens);
        let queryString = '';

        for (var isk = 3; isk < tokens.length; isk++) {
            queryString += tokens[isk] + " ";
        }
        console.log(queryString);
        return encodeURI(queryString.trim());
    }
}

module.exports = Logs;