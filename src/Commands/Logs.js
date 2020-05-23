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
        const log = this.dependencies.log;
        const reportType = tokens[1];
        const reportId = tokens[2];
        const term = this.generateQueryString(tokens);
        const msg = message;
        let bossMatch, logType, imagePath;

        log.log(message, reportType, `Query: ${term}`);

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

        imagePath = `images/${reportId}/${reportType}/${bossMatch.id}.png`;

        if (!fs.existsSync(imagePath)) {
            (async () => {
                const browser = await puppeteer.launch({args: ['--no-sandbox']});
                const page = await browser.newPage();
                await page.setViewport({ width: 2880, height: 1800 });
                await page.goto(`https://classic.warcraftlogs.com/reports/${reportId}`);
                const targetElements = await page.$$('.report-overview-boss-text');
                const chartSelector = logType.id === 'tps' ? '.dialog-block' : '.summary-table';
                // await page.screenshot({path: `${reportId}-${bossMatch.id}.png`, fullPage: true});
                var count = 0;

                try {
                    for (let target of targetElements) {
                        ++count;
                        const innerHtml = await page.evaluate(el => el.innerHTML, target);
                        console.log(innerHtml);
                        if (innerHtml.includes(bossMatch.name)) {
                            console.log('Clicking on the match!');
                            await target.click();
                            break;
                        }

                        if (targetElements.length === count) {
                            throw Error(`Boss with name ${term} could not be found in this Warcraftlog.`);
                        }
                    }
                } catch(e) {
                    console.log(e);
                    log.log(message, reportType, `Query: ${term}`, e);
                    return await msg.channel.send(`${e}`);
                }

                await page.waitForNavigation({
                    waitUntil: 'networkidle0',
                });

                console.log(`Page Url: ${page.url()}`);
                await page.goto(`${page.url()}&type=${logType.id}`);
                console.log(`Page Url: ${page.url()}`);
                await page.waitFor(5000);

                try {
                    async function screenshotDOMElement(opts = {}) {
                        const padding = 'padding' in opts ? opts.padding : 0;
                        const path = 'path' in opts ? opts.path : null;
                        const selector = opts.selector;
                        console.log(opts.selector);

                        if (!selector) { throw Error('Please provide a selector.'); }

                        const rect = await page.evaluate(selector => {
                            const element = document.querySelector(selector);
                            if (!element) { return null; }
                            const {x, y, width, height} = element.getBoundingClientRect();
                            return {left: x, top: y, width, height, id: element.id};
                        }, selector);

                        var dir = `images/${reportId}/${reportType}`;
                        if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
                        if (!rect) { throw Error(`Could not find element that matches selector: ${selector}.`); }

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

                    try {
                        await screenshotDOMElement({
                            path: imagePath,
                            selector: chartSelector,
                            padding: 16
                        });
                    } catch (e) {
                        console.log(`Could not find element that matches selector: ${chartSelector}.`);
                        await page.screenshot({path: imagePath, fullPage: false});
                    }
                } catch (e) {
                    console.log(e);
                }

                var res = `Report ID: ${reportId} | Type: ${reportType} | Boss: ${bossMatch.name}`;
                msg.channel.send(res, {files: [imagePath]});
                await browser.close();
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