import App from "next/app"
import Head from "next/head"
import ErrorPage from "next/error"
import { useRouter } from "next/router"
import { DefaultSeo } from "next-seo"
import { getStrapiMedia } from "utils/media"
import { getGlobalData } from "utils/api"
import "@/styles/index.css"
import "@/styles/content-styles.css"
import "@/styles/nav.css"
import "@/styles/banner.css"
import "@/styles/contact.css"
import "@/styles/testimonial.css"
import "@/styles/loading.css"
import "@/styles/video.css"

import { useEffect, useState } from "react"
import Loading from "@/components/loading"
import { sleep, useRefreshScrollRestoration } from "utils/hooks"

const MyApp = ({ Component, pageProps }) => {
  // Extract the data we need
  const [loading, setLoading] = useState(false)
  useRefreshScrollRestoration()
  const router = useRouter()

  useEffect(() => {
    // const handleStart = (url) => {
    //   setLoading(true)
    // }
    // const handleComplete = (url) => setLoading(false)

    // router.events.on("routeChangeStart", handleStart)
    // router.events.on("routeChangeComplete", handleComplete)
    // router.events.on("routeChangeError", handleComplete)
    setLoading(true)
    sleep(3000)
    setLoading(false)
  }, [router])

  const { global } = pageProps
  if (global == null) {
    return <ErrorPage statusCode={404} />
  }

  const { metadata, favicon, metaTitleSuffix } = global.attributes
  return (
    <>
      {/* Favicon */}
      <Head>
        <link
          rel="shortcut icon"
          href={getStrapiMedia(favicon.data.attributes.url)}
          style={{ width: 20, height: 20 }}
        />
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration = "manual"`,
          }}
        /> */}
      </Head>
      {/* Global site metadata */}
      {/* <DefaultSeo
        titleTemplate={`%s | ${metaTitleSuffix}`}
        title="Page"
        description={metadata.metaDescription}
        openGraph={{
          images: tmp.map((image) => {
            return {
              url: getStrapiMedia(image.url),
              width: image.width,
              height: image.height,
            }
          }),
        }}
        twitter={{
          cardType: metadata.twitterCardType,
          handle: metadata.twitterUsername,
        }}
      /> */}
      {/* Display the content */}
      <Loading visible={loading}>
        <Component {...pageProps} />
      </Loading>
    </>
  )
}

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So [[...slug]] pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
MyApp.getInitialProps = async (appContext) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext)
  const globalLocale = await getGlobalData(appContext.router.locale ?? "vi")

  return {
    ...appProps,
    pageProps: {
      global: globalLocale.data,
    },
  }
}

export default MyApp
