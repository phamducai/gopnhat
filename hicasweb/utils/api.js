import qs from "qs"

export function getStrapiURL(path) {
  return `${
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1338"
  }${path}`
}

export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  // Merge default and user options
  const mergedOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  }

  // Build request URL
  const queryString = qs.stringify(urlParamsObject)
  const requestUrl = `${getStrapiURL(
    `/api${path}${queryString ? `?${queryString}` : ""}`
  )}`

  // Trigger API call
  const response = await fetch(requestUrl, mergedOptions)

  // Handle response
  if (!response.ok) {
    console.error(response.statusText)
    throw new Error(`An error occured please try again`)
  }
  const data = await response.json()
  return data
}

/**
 *
 * @param {Object} options
 * @param {string} options.slug The page's slug
 * @param {string} options.locale The current locale specified in router.locale
 * @param {boolean} options.preview router isPreview value
 */
export async function getPageData({ slug, locale, preview }) {
  // Find the pages that match this slug
  const gqlEndpoint = getStrapiURL("/graphql")
  const pagesRes = await fetch(gqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        fragment FileParts on UploadFileEntityResponse {
          data {
            id
            attributes {
              alternativeText
              width
              height
              mime
              url
              formats
            }
          }
        }
        query GetPages(
          $slug: String!
          $publicationState: PublicationState!
          $locale: I18NLocaleCode!
        ) {        
          pages(
            filters: { slug: { eq: $slug } }
            publicationState: $publicationState
            locale: $locale
          ) {
            data {
              id
              attributes {
                locale
                localizations {
                  data {
                    id
                    attributes {
                      locale
                    }
                  }
                }
                slug
                metadata {
                  metaTitle
                  metaDescription
                  shareImage {
                    ...FileParts
                  }
                }
                contentSections {
                  __typename
                  ... on ComponentSectionsBannerSlider {
                    id
                    banner: picture {
                      data {
                        id
                        attributes {
                          alternativeText
                          width
                          height
                          mime
                          url
                          formats
                        }
                      }
                    }
                    buttons {
                      id
                      newTab
                      text
                      type
                      url
                    }
                    title
                    description
                    label
                    styling
                    isStylingContact
                  }
                  ... on ComponentSectionsBottomActions {
                    id
                    title
                    buttons {
                      id
                      newTab
                      text
                      type
                      url
                    }
                  }
                  ... on ComponentSectionsHero {
                    id
                    buttons {
                      id
                      newTab
                      text
                      type
                      url
                    }
                    title
                    description
                    label
                    picture {
                      ...FileParts
                    }
                  }
                  ... on ComponentSectionsFeatureColumnsGroup {
                    id
                    featureColumnBgColor: backgroundColor
                    featureColumnsTitle: title
                    features {
                      id
                      description
                      icon: media {
                        ...FileParts
                      }
                      title
                      link {
                          id
                          url
                          text
                          newTab
                      }
                      logo {
                          ...FileParts
                      }
                    }
                  }
                  ... on ComponentSectionsFeatureRowsGroup {
                    id
                    title
                    featureRowBgColor: backgroundColor
                    firstImageLeft
                    features {
                      id
                      description
                      media {
                        ...FileParts
                      }
                      title
                      content
                      isMediaLeft
                      videoLink
                      useVideoLink
                      iconContent {
                        ...FileParts
                      }
                      isShowBorder
                      isShowIconContent
                    }
                    imageWidth
                    imageHeight
                  }
                  ... on ComponentSectionsTestimonialsGroup {
                    id
                    testimonialsBgColor: backgroundColor
                    description
                    title
                    autoPlay
                    link {
                      id
                      newTab
                      text
                      url
                    }
                    logos {
                      id
                      title
                      logo {
                        ...FileParts
                      }
                    }
                    testimonials {
                      id
                      logo {
                        ...FileParts
                      }
                      text
                      authorName
                      authorTitle
                      link
                    }
                  }
                  ... on ComponentSectionsLargeVideo {
                    id
                    description
                    title
                    poster {
                      ...FileParts
                    }
                    video {
                      ...FileParts
                    }
                  }
                  ... on ComponentSectionsRichText {
                    id
                    content
                  }
                  ... on ComponentSectionsPricing {
                    id
                    title
                    plans {
                        title
                      description
                      features {
                        id
                        title
                        description
                        icon {
                            ...FileParts
                        }
                        iconWrapperBackground
                        url
                      }
                      id
                      isRecommended
                      price
                      pricePeriod
                      backgroundColor
                    }
                  }
                  ... on ComponentSectionsLeadForm {
                    id
                    emailPlaceholder
                    location
                    submitButton {
                      id
                      text
                      type
                    }
                    title
                  }
                  ... on ComponentSectionsFeatureCards {
                    id
                    featureCardBgColor: backgroundColor
                    headline: title
                    announce
                    cards {
                      id
                      title
                      description
                      image {
                        ...FileParts
                      }
                    }
                  }
                  ... on ComponentSectionsContactForm {
                    id
                    title
                    namePlaceholder
                    emailPlaceholder
                    phonePlaceholder
                    contentPlaceholder
                    typeOfForm
                    submitButton {
                      id
                      text
                      type
                    }
                    backgroundImage {
                      ...FileParts
                    }
                    map {
                        longitudeX
                        longitudeY
                        zoomLevel
                        apiKey
                        useMaps
                        mapLink
                        width
                        height
                    }
                    subtitle
                    titleForm
                    subscribeTitle {
                        icon {
                            ...FileParts
                        }
                        title
                        announce
                    }
                  }
                  ... on ComponentSectionsNews {
                    id
                    title
                    announce
                    category {
                      data {
                        id
                      }
                    }
                    articlesPerPage
                    showLoadMore
                    titleCategory
                    titleFilterOther
                  }
                  ... on ComponentSectionsFeatureWithBackgroundImage {
                    id
                    title
                    announce
                    image {
                      ...FileParts
                    }
                  }
                  ... on ComponentSectionsProfileCard {
                    id
                    title
                    cards {
                      id
                      title
                      image {
                        ...FileParts
                      }
                    }
                  }
                  ... on ComponentSectionsTrialsRegister {
                    id
                    title
                    namePlaceholder
                    phonePlaceholder
                    emailPlaceholder
                    numberPlaceholder
                    trialTitle
                    companyPlaceholder
                    photo: image {
                      ...FileParts
                    }
                    submitButton {
                      id
                      text
                      type
                    }
                  }
                  ... on ComponentSectionsFeatureProvided {
                    id
                    featureProvidedHeadline : headline
                    title
                    image {
                      ...FileParts
                    }
                  }
                  ... on ComponentSectionsProvidedLinks {
                    id
                    title
                    links {
                      id
                      icon {
                        ...FileParts
                      }
                      text
                      url
                      newTab
                    }
                  }
                  ... on ComponentSectionsOnDemandSoftware {
                    id
                    title
                    productCards {
                      id
                      title
                      image {
                        ...FileParts
                      }
                    }
                  }
                  ... on ComponentSectionsProductIntroduction {
                    id
                    introduction {
                      title
                      videoUrl
                      introMedia {
                        ...FileParts
                      }
                      content
                    }
                  }
                  ... on ComponentSectionsStackedLayout {
                    id
                    stackedBgColor: backgroundColor
                    bigTitle
                    buttonLink {
                      id
                      url
                      newTab
                      text
                      type
                    }
                  }
                  ... on ComponentSectionsAdvantagesRow {
                    id
                    advantagesBgColor: backgroundColor
                    advantagesFeatures: features {
                      id
                      itemTitle: title
                      url
                      itemIcon: icon {
                        ...FileParts
                      }
                      description
                      iconWrapperBackground
                    }
                    advantageRowTitle: title
                  }
                  ... on ComponentSectionsLogoClouds {
                    id
                    logoCloudsBgColor: backgroundColor
                    logoCloudsItems: logos {
                      id
                      text
                      url
                      newTab
                      icon {
                        ...FileParts
                      }
                    }
                    logoCloudsTitle: title
                    logoCloudsLink: link {
                      id
                      url
                      newTab
                      text
                    }
                    autoplay
                  }
                  ... on ComponentSectionsBannerSliderCustom {
                    id
                    BannerItems {
                      id
                      title
                      subTitle
                      positionContent
                      description
                      image {
                        ...FileParts
                      }
                      buttonLink {
                        id
                        url
                        newTab
                        text
                        type
                      }
                      iconFooter {
                        ...FileParts
                      }
                      article {
                        data {
                          id
                          attributes{
                            slug
                            title
                            showOnHome
                          }
                        }
                      }
                    }
                  }
                ... on ComponentSectionsFlatCardGroup {
                    id
                    title
                    flatCardBgColor: backgroundColor
                    announcement
                    cardActivity2 {
                      id
                      itemTitle: title
                      image {
                        ...FileParts
                      }
                      content
                      isDisplayCard
                      link {
                        id
                        url
                        newTab
                        text
                      }
                    }
                  }
                  ... on ComponentSectionsSearchResultSection {
                    id
                    search {
                        listPlaceholder {
                            value
                        }
                        titleAllCategory
                        titleCategoryFilter
                        articlesPerPage
                    }
                  }
                  ... on ComponentSectionsTechCards {
                    id
                    bigTitle
                    techBgColor: backgroundColor
                    techItems {
                      id
                      techIcon{
                        ...FileParts
                      }
                      techTitle
                      description
                    }
                    buttonLink {
                      url
                      text
                    }
                  }
                }
              }
            }
          }
        }      
      `,
      variables: {
        slug,
        publicationState: preview ? "PREVIEW" : "LIVE",
        locale,
      },
    }),
  })

  const pagesData = await pagesRes.json()
  // Make sure we found something, otherwise return null
  if (pagesData.data?.pages == null || pagesData.data.pages.length === 0) {
    return null
  }

  // Return the first item since there should only be one result per slug
  return pagesData.data.pages.data[0]
}

/**
 *
 * @param {Object} options
 * @param {string} options.slug The article's slug
 * @param {string} options.locale The current locale specified in router.locale
 * @param {boolean} options.preview router isPreview value
 */
export async function getArticleData({ slug, locale, preview }) {
  // Find the pages that match this slug
  const gqlEndpoint = getStrapiURL("/graphql")
  const articlesRes = await fetch(gqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        fragment FileParts on UploadFileEntityResponse {
          data {
            id
            attributes {
              alternativeText
              width
              height
              mime
              url
              formats
            }
          }
        }
        query GetArticles(
          $slug: String!
          $publicationState: PublicationState!
          $locale: I18NLocaleCode!
        ) {        
          articles(
            filters: { slug: { eq: $slug } }
            publicationState: $publicationState
            locale: $locale
          ) {
            data {
              id
              attributes {
                title
                announce
                image {
                  ...FileParts
                }
                locale
                localizations {
                  data {
                    id
                    attributes {
                      locale
                    }
                  }
                }
                slug
                metadata {
                  metaTitle
                  metaDescription
                  shareImage {
                    ...FileParts
                  }
                }
                contentSections {
                  __typename
                  ... on ComponentSectionsBannerSlider {
                    id
                    banner: picture {
                      data {
                        id
                        attributes {
                          alternativeText
                          width
                          height
                          mime
                          url
                          formats
                        }
                      }
                    }
                    buttons {
                      id
                      newTab
                      text
                      type
                      url
                    }
                    title
                    description
                    label
                    styling
                    isStylingContact
                  }
                  ... on ComponentSectionsBottomActions {
                    id
                    title
                    buttons {
                      id
                      newTab
                      text
                      type
                      url
                    }
                  }
                  ... on ComponentSectionsHero {
                    id
                    buttons {
                      id
                      newTab
                      text
                      type
                      url
                    }
                    title
                    description
                    label
                    picture {
                      ...FileParts
                    }
                  }
                  ... on ComponentSectionsFeatureColumnsGroup {
                    id
                    features {
                      id
                      description
                      icon: media {
                        ...FileParts
                      }
                      title
                      link {
                        id
                        url
                        text
                        newTab
                      }
                    }
                  }
                  ... on ComponentSectionsFeatureRowsGroup {
                    id
                    features {
                      id
                      description
                      link {
                        id
                        newTab
                        text
                        url
                      }
                      media {
                        ...FileParts
                      }
                      title
                      isMediaLeft
                      icon {
                        ...FileParts
                      }
                      isShowBorder
                      isShowIconContent
                    }
                  }
                  ... on ComponentSectionsTestimonialsGroup {
                    id
                    description
                    title
                    autoPlay
                    link {
                      id
                      newTab
                      text
                      url
                    }
                    logos {
                      id
                      title
                      logo {
                        ...FileParts
                      }
                    }
                    testimonials {
                      id
                      logo {
                        ...FileParts
                      }
                      text
                      authorName
                      authorTitle
                      link
                    }
                  }
                  ... on ComponentSectionsLargeVideo {
                    id
                    description
                    title
                    useVideoLink
                    videoLinks
                    poster {
                      ...FileParts
                    }
                    video {
                      ...FileParts
                    }
                  }
                  ... on ComponentSectionsRichText {
                    id
                    content
                  }
                  ... on ComponentSectionsPricing {
                    id
                    title
                    plans {
                      description
                      features {
                        id
                        title
                        description
                        icon {
                            ...FileParts
                        }
                        iconWarapperBackround
                        url
                      }
                      id
                      isRecommended
                      title
                      price
                      pricePeriod
                      backgroundColor
                    }
                  }
                  ... on ComponentSectionsLeadForm {
                    id
                    emailPlaceholder
                    location
                    submitButton {
                      id
                      text
                      type
                    }
                    title
                  }
                  ... on ComponentSectionsFeatureCards {
                    id
                    headline: title
                    announce
                    cards {
                      id
                      title
                      description
                      image {
                        ...FileParts
                      }
                    }
                  }
                  ... on ComponentSectionsContactForm {
                    id
                    title
                    namePlaceholder
                    emailPlaceholder
                    phonePlaceholder
                    contentPlaceholder
                    submitButton {
                      id
                      text
                      type
                    }
                    backgroundImage {
                      ...FileParts
                    }
                    map {
                        longitudeX
                        longitudeY
                        zoomLevel
                        apiKey
                        useMaps
                        mapLink
                        width
                        height
                    }
                    subtitle
                    titleForm
                    subscribeTitle {
                        icon {
                            ...FileParts
                        }
                        title
                        announce
                    }
                  }
                  ... on ComponentSectionsNews {
                    id
                    title
                    announce
                    category {
                      data {
                        id
                      }
                    }
                    articlesPerPage
                    showLoadMore
                    titleCategory
                    titleFilterOther
                  }
                  ... on ComponentSectionsFeatureWithBackgroundImage {
                    id
                    title
                    announce
                    image {
                      ...FileParts
                    }
                  }
                }
              }
            }
          }
        }      
      `,
      variables: {
        slug,
        publicationState: preview ? "PREVIEW" : "LIVE",
        locale,
      },
    }),
  })

  const articlesData = await articlesRes.json()
  // Make sure we found something, otherwise return null
  if (
    articlesData.data?.articles == null ||
    articlesData.data.articles.length === 0
  ) {
    return null
  }

  // Return the first item since there should only be one result per slug
  return articlesData.data.articles.data[0]
}

// Get site data from Strapi (metadata, navbar, footer...)
export async function getGlobalData(locale) {
  const gqlEndpoint = getStrapiURL("/graphql")
  const globalRes = await fetch(gqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        fragment FileParts on UploadFileEntityResponse {
          data {
            id
            attributes {
              alternativeText
              width
              height
              mime
              url
              formats
            }
          }
        }
        query GetGlobal($locale: I18NLocaleCode!) {
          global(locale: $locale) {
            data {
              id
              attributes {
                favicon {
                  ...FileParts
                }
                metadata {
                  metaTitle
                  metaDescription
                  shareImage {
                    ...FileParts
                  }
                }
                metaTitleSuffix
                notificationBanner {
                  type
                  text
                }
                navbar {
                  logo {
                    ...FileParts
                  }
                  searchPlaceholder
                  leftLinks {
                    id
                    url
                    newTab
                    text
                  }
                  dropdownLinks {
                    id
                    text
                    subMenuLinks{
                      id
                      title
                      subtitle
                      url
                      icon{
                        ...FileParts
                      }
                      isArrow
                      isParent
                    }
                    NameFocusSection
                  }
                  links {
                    id
                    url
                    newTab
                    text
                  }
                  button {
                    id
                    url
                    newTab
                    text
                    type
                  }
                }
                footer {
                  logo {
                    ...FileParts
                  }
                  slogan
                  company
                  address
                  phone
                  smallText
                  columns {
                    id
                    title
                    links {
                      id
                      url
                      newTab
                      text
                    }
                  }
                  advertisingBanners {
                    id
                    logos {
                      data {
                        id
                        attributes {
                          alternativeText
                          width
                          height
                          mime
                          url
                          formats
                        }
                      }
                    }
                  }
                  socials {
                    id
                    url
                    newTab
                    text
                    icon {
                        ...FileParts
                    }
                  }
                  subcriptionBox {
                    id
                    title
                    description
                    emailPlaceholder
                    submitbutton
                    Logo {
                        ...FileParts
                      }
                  }
                }
              }
            }
          }
        }      
      `,
      variables: {
        locale,
      },
    }),
  })
  const global = await globalRes.json()
  return global.data.global
}
