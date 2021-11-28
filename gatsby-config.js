const config = require('./config');
const feedPlugin = require('./gatsby-config.plugins.feed')

module.exports = {
  pathPrefix: config.pathPrefix,
  siteMetadata: {
    // Data used by some gatsby plugins
    siteUrl: config.siteUrl,
    title: config.siteTitle,
    description: config.siteDescription
  },
  plugins: [
    "gatsby-plugin-sass",
    'gatsby-plugin-less',
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    // {
    //   resolve: "gatsby-plugin-sharp",
    //   options: {
    //     icon: "src/images/dark-icon.png"
    //   }
    // },
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: 'UA-151033495-1',
    //     head: true,
    //     anonymize: true,
    //   },
    // },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Jerson Alexander Blog',
        short_name: 'Jerson Alexander',
        start_url: '/',
        background_color: '#0C2744',
        theme_color: '#0C2744',
        display: 'standalone',
        icon: 'src/images/icon.png', // This path is relative to the root of the site.
        legacy: true, // this will add apple-touch-icon links to <head>. Required for versions prior to iOS 11.3.
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1000,
              quality: 80,
              showCaptions: true,
              linkImagesToOriginal: false,
            },
          },
          'gatsby-remark-prismjs',
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-i18n',
      options: {
        langKeyDefault: config.defaultLanguage,
        useLangKeyLayout: false,
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `json-data`,
        path: `${__dirname}/data`,
      },
    },
    feedPlugin,
    `gatsby-plugin-robots-txt`,
  ],
};
