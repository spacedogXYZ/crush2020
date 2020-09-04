const { GATSBY_GOOGLE_ANALYTICS_ID } = process.env
const { GATSBY_SENTRY_DSN } = process.env
var sentryTracing = require('@sentry/tracing')

module.exports = {
  siteMetadata: {
    title: `Crush2020`,
    description: `We crushed the midterms. Now, let’s finish the job.`,
    author: `@jlev`,
    siteUrl: 'https://crush2020.netlify.app',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/data/`,
      },
    },
    `gatsby-transformer-csv`,
    {
      resolve: 'gatsby-source-custom-api',
      options: {
        url: 'https://api.voteamerica.com/v1/election/field/',
        rootKey: 'VoteAmericaStateField',
        schemas:  {
          VoteAmericaStateField: `
            slug: String
            long_name: String
          `
        }
      }
    },
    {
      resolve: 'gatsby-source-custom-api',
      options: {
        url: 'https://api.voteamerica.com/v1/election/state/',
        rootKey: 'VoteAmericaStateInformation',
        schemas:  {
          VoteAmericaStateInformation: `
            text: String
            field_type: VoteAmericaStateField @link(by: "slug")
            modified_at: Date
          `,
          VoteAmericaState: `
            name: String
            code: ID
            state_information: [VoteAmericaStateInformation]
          `
        }
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/form/*`, `/plan/*`] },
    },
    `gatsby-plugin-sass`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: GATSBY_GOOGLE_ANALYTICS_ID,
        head: true,
        anonymize: true,
        respectDNT: true,
      },
    },
    {
      resolve: "gatsby-plugin-sentry",
      options: {
        dsn: GATSBY_SENTRY_DSN,
        integrations: [
          new sentryTracing.Integrations.BrowserTracing(),
        ],
        tracesSampleRate: 1.0,
        environment: process.env.NODE_ENV,
        enabled: (() => ["production", "stage"].indexOf(process.env.NODE_ENV) !== -1)(),
        beforeSend(event, hint) {
          // Check if it is an exception, and if so, show the report dialog
          if (event.exception) {
            Sentry.showReportDialog({ eventId: event.event_id });
          }
          return event;
        },
      }
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
