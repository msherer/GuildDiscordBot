const https = require('https');

class Client {
    get(opts, body = null) {
        return new Promise((resolve, reject) => {
            var req = https.get(`https://${opts.hostname}${opts.path}`, (res) => {
                let ds = [];
                let response;

                res.on('data', (d) => {
                    ds.push(d);
                });

                res.on('end', (e) => {
                    var body = Buffer.concat(ds);
                    var payload = JSON.parse(body.toString());
                    response = payload.results;
                    resolve(response);
                });

            }).on('error', (err) => {
                console.error(err);
            });

            if (body) {
                req.write(body);
            }

            req.end();
        });
    }

    async sendGet(opts) {
        return await this.get(opts);
    }
}

module.exports = Client;
