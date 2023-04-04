import { COLOR_PALETTE } from "common/const/color-palette"
import { useRouter } from "next/dist/client/router"
import Link from "next/link"
import React from "react"
import { fetchAPI } from "utils/api"
import { IoIosArrowForward } from "react-icons/io"
import ButtonIcon from "../elements/buttonIcon"
import SectionTitle from "../elements/section-title"
import { getStrapiMedia } from "utils/media"
import { useWindowSize } from "utils/hooks"
import CustomLink from "../elements/custom-link"
const HomeNews = ({ data }) => {
  const [articles, setArticles] = React.useState([])
  const router = useRouter()
  const size = useWindowSize()
  const backgroundColor =
    data.stackedBgColor === "gray" ? COLOR_PALETTE.grayWhite : "white"

  React.useEffect(() => {
    const fetchArticleByCategoryData = async (pageSize, page, locale) => {
      const localeArticles = await fetchAPI("/articles", {
        locale,
        fields: ["title", "announce", "slug"],
        filters: {
          showOnHome: {
            $eq: true,
          },
        },
        populate: ["image", "category"],
        pagination: { pageSize: pageSize, page },
        sort: ["createdAt:desc"],
      })
      setArticles(localeArticles.data)
    }
    fetchArticleByCategoryData(5, 1, router.locale)
  }, [router])

  return (
    <div style={{ background: backgroundColor }} className={`relative pb-8`}>
      <div className="flex justify-center items-center">
        <SectionTitle text={data?.bigTitle ?? ""} />
      </div>
      <div className="container grid grid-cols-12 gap-3 mt-8">
        {articles.map(
          (cards, index) =>
            index === 0 && (
              <Link key={index} passHref href={`news/${cards.attributes.slug}`}>
                <a
                  className={`cursor-pointer xl:col-span-6 col-span-12 shadow-md overflow-hidden rounded-lg`}
                >
                  <div
                    style={{ backgroundColor: COLOR_PALETTE.orange }}
                    className="h-full"
                  >
                    <img
                      className="w-full object-cover xl:h-[431px] lg:h-[400px] h-[300px]"
                      src={getStrapiMedia(
                        cards.attributes.image.data.attributes.url
                      )}
                    />
                    <div className="w-full pl-8 pt-1 pb-2 md:pt-2 md:pb-0 h-[60px]">
                      <h2 className="cursor-pointer text-[18px] font-semibold">
                        {cards.attributes.title ?? ""}
                      </h2>
                    </div>
                  </div>
                </a>
              </Link>
            )
        )}
        {size !== "sm" ? (
          <div className="xl:col-span-6 col-span-12 grid grid-cols-2 gap-3">
            {articles.map(
              (cards, index) =>
                index !== 0 && (
                  <Link key={index} href={`news/${cards.attributes.slug}`}>
                    <a
                      className="text-black hover:text-black cursor-pointer rounded-lg shadow-md max-w-xs md:max-w-none overflow-hidden"
                      style={{ backgroundColor: COLOR_PALETTE.darkGray2 }}
                    >
                      <img
                        className="xl:h-48 h-40 w-full object-cover"
                        src={`${getStrapiMedia(
                          cards.attributes.image?.data
                            ? cards.attributes.image?.data.attributes.url
                            : ""
                        )}`}
                      />
                      <div className="custom-title-cards p-2 px-5 cursor-pointer text-[14px] font-semibold">
                        {cards.attributes.title ?? ""}
                      </div>
                    </a>
                  </Link>
                )
            )}
          </div>
        ) : (
          <div className="col-span-12">
            {articles.map(
              (cards, index) =>
                index !== 0 && (
                  <Link key={index} href={`news/${cards.attributes.slug}`}>
                    <a className="text-black cursor-pointer flex w-full my-4 gap-x-1">
                      <div className={`flex flex-1 gap-x-4`}>
                        <div className="w-[200px] h-full">
                          <img
                            src={`${getStrapiMedia(
                              cards.attributes.image?.data
                                ? cards.attributes.image?.data.attributes.url
                                : ""
                            )}`}
                            className="rounded-lg w-[141px] h-[87px]"
                          />
                        </div>
                        <div className="w-full">
                          <h2 className="cursor-pointer text-lg font-semibold">
                            {cards.attributes.title}
                          </h2>
                        </div>
                      </div>
                    </a>
                  </Link>
                )
            )}
          </div>
        )}
        <div className="col-span-12 flex justify-center mt-0 md:mt-8 md:h-[38px] h-[36px]">
          {data?.buttonLink && (
            <CustomLink link={data?.buttonLink} linkClassName={`text-black`}>
              <ButtonIcon
                icon={<IoIosArrowForward />}
                text={data.buttonLink.text}
                className="border py-2 px-5 hover:bg-[#f36c00] hover:border-transparent transition-all duration-300 hover:text-white rounded-3xl text-[14px]"
              />
            </CustomLink>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomeNews
