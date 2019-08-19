/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
const Sentry = require('@sentry/browser');

exports.onClientEntry = () => {
    Sentry.init({ dsn: "https://3bb04b1ea2da4af78316c3e22c703cc3@sentry.io/1531639" });
};
