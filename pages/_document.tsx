import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        })
      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render = () => {
    return (
      <Html lang="en">
        <Head>
          <link href="/favicon/favicon.svg" rel="icon" type="image/svg+xml" />
          <link href="/favicon/favicon.png" rel="icon" type="image/png"></link>
          <link href="/favicon/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
          {/* <link href="/favicon/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
          <link href="/favicon/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
          <link href="/favicon/site.webmanifest" rel="manifest" /> */}
          <link color="#5bbad5" href="/favicon/safari-pinned-tab.svg" rel="mask-icon" />
          <meta content="#da532c" name="msapplication-TileColor" />
          <meta content="#ffffff" name="theme-color" />
          <meta content="description" name="description" />
          <meta content="OG title" property="og:title" />
          <meta content="https://THE_URL" property="og:url" />
          <meta content="https://THE_URL/shareable/ogImage.jpg" property="og:image" />
          <meta content="website" property="og:type" />
          <meta content="OG description" property="og:description" />
          <meta content="summary_large_image" name="twitter:card" />
          <meta content="THE_SITE" name="twitter:site" />
          <meta content="@THE_HANDLE" name="twitter:creator" />
          <link href="https://fonts.googleapis.com" rel="preconnect" />
          <link crossOrigin="crossorigin" href="https://fonts.gstatic.com" rel="preconnect" />
          <link
            href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&family=Nunito:wght@800;900&family=Roboto:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
          <style global jsx>{`
            body,
            html {
              margin: 0;
              padding: 0;
            }

            body:empty {
              background-color: #fff;
              height: 100vh;
              width: 100vw;
            }

            #__next:empty {
              align-items: center;
              display: flex;
              height: 100vh;
              justify-content: center;
              width: 100vw;
            }

            #__next:empty:before {
              animation: rotate 2s linear infinite;
              background-image: url('data:image/svg+xml;base64,PHN2ZwogIGhlaWdodD0iNDAiCiAgdmlld0JveD0iMCAwIDUwIDUwIgogIHdpZHRoPSI0MCIKICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCj4KICA8Y2lyY2xlCiAgICBjeD0iMjUiCiAgICBjeT0iMjUiCiAgICBmaWxsPSIjRTU2Mzk5IgogICAgcj0iMjUiCiAgLz4KICA8cGF0aAogICAgZD0iTTI0LjcwOCA0Mi40MTdBMTcuNzA4IDE3LjcwOCAwIDEgMCA3IDI0LjQxOGExLjc3MSAxLjc3MSAwIDAgMCAzLjU0Mi4wNTcgMTQuMTY3IDE0LjE2NyAwIDEgMSAxNC4xNjUgMTQuNCAxLjc3MSAxLjc3MSAwIDEgMCAwIDMuNTQyeiIKICAgIGZpbGw9IiNmZmYiCiAgICB0cmFuc2Zvcm09InRyYW5zbGF0ZSguMjkyIC4yOTIpIgogIC8+Cjwvc3ZnPgo=');
              background-position: 50% 50%;
              background-repeat: no-repeat;
              background-size: cover;
              content: '';
              display: block;
              flex-grow: 0;
              flex-shrink: 0;
              height: 50px;
              width: 50px;
            }

            @keyframes rotate {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
