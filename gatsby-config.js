const autoprefixer = require('autoprefixer');

module.exports = {
  pathPrefix: `/the-greate-gatsby`,
  siteMetadata: {
    title: `dudulu`,
    description: `dudulu's blog, write, code, listen to music, watch movie, etc`,
    author: `dudulu`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-postcss`,
      options: {
        postCssPlugins: [autoprefixer()],
      },
    },
    // `gatsby-plugin-sass`,
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require('sass'),
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'dudulu',
        short_name: 'dudulu',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'standlone',
        icon: 'src/images/icon.png',
      },
    },
    `gatsby-plugin-offline`,
  ],
};
