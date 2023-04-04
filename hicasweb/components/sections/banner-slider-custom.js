import { COLOR_PALETTE } from "common/const/color-palette"
import ReactHtmlParser from "react-html-parser"
import { IoIosArrowForward } from "react-icons/io"
import "react-multi-carousel/lib/styles.css"
import { Autoplay, Pagination } from "swiper"
import "swiper/css"
import "swiper/css/pagination"
import { Swiper, SwiperSlide } from "swiper/react"
import {
  checkShowGradient,
  getPositionTitle,
  showPositionGradient,
} from "utils/button"
import { useWindowSize } from "utils/hooks"
import { getStrapiMedia } from "utils/media"
import ButtonIcon from "../elements/buttonIcon"
import CustomLink from "../elements/custom-link"

const BannerSilderCustom = ({ data }) => {
  const { BannerItems } = data
  const size = useWindowSize()
  return (
    <div className="w-full h-max">
      <Swiper
        style={{
          "--swiper-navigation-color": COLOR_PALETTE.orange,
          "--swiper-pagination-color": COLOR_PALETTE.orange,
        }}
        pagination={
          size == "sm"
            ? false
            : {
                dynamicBullets: true,
                clickable: true,
              }
        }
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="custom-banner-silder"
      >
        {BannerItems &&
          BannerItems.map((pic) => {
            const position = getPositionTitle(pic.positionContent)
            return (
              pic.image.data && (
                <SwiperSlide key={pic.id}>
                  <div
                    key={pic.id}
                    className={`banner-item flex ${showPositionGradient(
                      pic.positionContent
                    )}`}
                    style={{
                      backgroundImage: `url(${getStrapiMedia(
                        pic.image.data ? pic.image.data.attributes.url : "/"
                      )})`,
                    }}
                  >
                    {checkShowGradient(pic) && (
                      <div
                        className={`container flex items-center ${position}`}
                      >
                        <div className="z-20 mt-3 lg:mt-0 ck-content text-center md:text-left">
                          {ReactHtmlParser(pic.title ?? "")}
                          {ReactHtmlParser(pic.subTitle ?? "")}
                          {ReactHtmlParser(pic.description ?? "")}
                          <div
                            className={`custom-reponsive-button flex justify-center md:justify-start items-center gap-x-5 mt-5 h-[45px] ${position}`}
                          >
                            {pic.buttonLink.map((item) => (
                              <div key={item.id} className="h-[45px]">
                                <CustomLink link={item}>
                                  <ButtonIcon
                                    icon={
                                      <IoIosArrowForward
                                        style={{
                                          fontSize: "1.2rem",
                                        }}
                                      />
                                    }
                                    text={item.text}
                                    className={
                                      item.type === "secondary"
                                        ? "bg-white text-black w-[160px] rounded-3xl"
                                        : "bg-[#f36c00] text-white w-[160px] rounded-3xl"
                                    }
                                  />
                                </CustomLink>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* <div
                className={`w-ful cursor-pointer`}
                style={{ backgroundColor: COLOR_PALETTE.orange }}
              >
                {pic.article?.data ? (
                  <Link
                    href={`/news/${pic.article.data.attributes?.slug ?? "/"}`}
                  >
                    <div className="container flex items-center md:h-[92px] h-[50px] md:gap-x-7 gap-x-4">
                      <span className="bg-white rounded-[10px] flex items-center justify-center md:w-[58px] md:h-[58px] w-[40px] h-[40px]">
                        <NextImage
                          width="48"
                          height="48"
                          media={pic.iconFooter}
                        />
                        {pic.icon}
                      </span>
                      <span className="md:text-2xl text-sm text-white">
                        {pic.article.data.attributes?.title}
                      </span>
                      <BsArrowRight
                        style={{ fontSize: "2rem", color: "white" }}
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="container md:h-[92px] h-[80px]" />
                )}
              </div> */}
                </SwiperSlide>
              )
            )
          })}
      </Swiper>
    </div>
  )
}

export default BannerSilderCustom
