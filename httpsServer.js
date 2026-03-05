/* eslint-disable @typescript-eslint/no-require-imports */
/*
 *  Use this script when debugging or developing on Safari or a local environment where HTTPS is required.
 *  This script allows you to run a server over HTTPS for localhost.
 *  This is due to the HSTS policy which forces all URLs on Safari to be served over HTTPS instead of HTTP.
 *
 *  Prerequisites:
 *      - `brew install mkcert nss`
 *      - cd to root of a-cubed-new-frontend
 *      - `mkcert localhost 127.0.0.1 ::1`
 *      - Change the key and cert strings to the respective names in httpsOptions
 *      - `npm install` (to install the nodemon package as a dev dependency)
 *      - Run `npm run dev:https` instead of `npm run dev`
 *
 *  The above steps only need to be run once.
 *  Following this setup, you can run `npm run dev:https` on future occasions.
 *  Please ensure your .gitignore files contains *.pem to prevent any keys/certs being pushed to GitLab
 */

const fs = require("fs");
const https = require("https");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./localhost+2-key.pem"),
  cert: fs.readFileSync("./localhost+2.pem"),
};

app.prepare().then(() => {
  https
    .createServer(httpsOptions, (req, res) => {
      handle(req, res);
    })
    .listen(3000, () => {
      console.log("Ready on https://localhost:3000");
    });
});
