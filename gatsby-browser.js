/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
const Sentry = require('@sentry/browser');

exports.onClientEntry = () => {
    const language = navigator.language;
    Sentry.init({
        environment: "development", // 标识应用环境，Sentry的面板上提供了Environment筛选
        release: "Dudulu@1.0.0", // 标识版本，可以过滤出对应版本的错误
        dsn: "https://3bb04b1ea2da4af78316c3e22c703cc3@sentry.io/1531639"
    });

    // modify scope
    Sentry.configureScope(scope => {
        scope.setTag("page_language", language);
        scope.setLevel("debug")
    });
    Sentry.addBreadcrumb({
        category: 'tail',
        message: 'Little tail',
        level: Sentry.Severity.Info
    });
};
