import { useRef, useState } from "react"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { Autoplay, Controller, Pagination } from "swiper"
import { Swiper, SwiperSlide, useSwiper } from "swiper/react"
import { useWindowSize } from "utils/hooks"
import { getStrapiMedia } from "utils/media"
import ButtonIcon from "../elements/buttonIcon"
import CustomLink from "../elements/custom-link"
import SectionTitle from "../elements/section-title"
import { COLOR_PALETTE } from "common/const/color-palette"
import NextImage from "../elements/image"
import ReactHtmlParser from "react-html-parser"

const FlatCardGroup = ({ data }) => {
  const [controlledSwiper, setControlledSwiper] = useState(null)
  const swiperRef = useRef(null)
  const size = useWindowSize()
  const backgroundColor =
    data.flatCardBgColor === "gray" ? COLOR_PALETTE.grayWhite : "white"

  const responsive = {
    // the naming can be any, depends on you.
    3000: {
      slidesPerView: 3,
      spaceBetween: 22,
      slidesPerGroup: 1,
    },
    1420: {
      slidesPerView: 3,
      spaceBetween: 22,
      slidesPerGroup: 1,
    },
    1369: {
      slidesPerView: 3,
      spaceBetween: 25,
      slidesPerGroup: 1,
    },
    1280: {
      slidesPerView: 3,
      spaceBetween: 20,
      slidesPerGroup: 1,
    },
    1140: {
      slidesPerView: 2,
      spaceBetween: 20,
      slidesPerGroup: 1,
    },
    860: {
      slidesPerView: 2,
      spaceBetween: 20,
      slidesPerGroup: 1,
    },
    600: {
      slidesPerView: 1,
      spaceBetween: 20,
      slidesPerGroup: 1,
    },
    0: {
      slidesPerView: 1,
      spaceBetween: 20,
      slidesPerGroup: 1,
    },
  }
  const arrowStyle = {
    background: "#F4F4F4",
    border: "1px solid rgba(196, 196, 196, 1)",
    color: "rgba(61, 60, 60, 1)",
    borderRadius: "100%",
  }

  const pagination = {
    clickable: true,
  }
  const CustomRight = () => {
    const swiper = useSwiper()

    return (
      <button
        className="absolute hidden xl:inline-block xl:right-16 4xl:right-36 top-[60%] p-auto text-center h-[47px] w-[47px] z-10 p-1"
        onClick={() => {
          swiper.slideNext()
        }}
        style={arrowStyle}
      >
        <IoIosArrowForward
          className="flex items-center justify-center"
          style={{ fontSize: "1.9rem", display: "initial" }}
        />
      </button>
    )
  }
  const CustomLeft = () => {
    const swiper = useSwiper()

    return (
      <button
        className="absolute hidden xl:inline-block xl:left-16 4xl:left-36 top-[60%] p-auto text-center h-[47px] w-[47px] z-10 p-1"
        onClick={() => {
          swiper.slidePrev()
        }}
        style={arrowStyle}
      >
        <IoIosArrowBack
          className="flex items-center justify-center"
          style={{ fontSize: "1.9rem", display: "initial" }}
        />
      </button>
    )
  }

  return (
    <div
      className={`relative pb-12`}
      style={{ scrollMarginTop: "4.5rem", background: backgroundColor }}
      id="service-home"
      //   onMouseEnter={() =>
      //     data.cardActivity2.length > 0 &&
      //     swiperRef.current.swiper.autoplay.stop()
      //   }
      //   onMouseLeave={() =>
      //     data.cardActivity2.length > 0 &&
      //     swiperRef.current.swiper.autoplay.start()
      //   }
    >
      <div className="flex justify-center items-center">
        {data.title ? <SectionTitle text={data.title} /> : ""}
      </div>
      {data.announcement ? (
        <div
          className="mx-6 md:mx-12 lg:mx-40 xl:mx-56 3xl:mx-96 text-center !text-base"
          dangerouslySetInnerHTML={{
            __html: data.announcement,
          }}
        />
      ) : (
        ""
      )}
      {data.cardActivity2.length > 0 && (
        <Swiper
          className="h-10"
          style={{ position: "unset" }}
          modules={[Autoplay, Controller]}
          controller={{ control: controlledSwiper }}
          breakpoints={responsive}
          allowSlideNext
          allowSlidePrev
          allowTouchMove
          loop={true}
        >
          <CustomLeft />
          {data.cardActivity2.map((card, index) => (
            <SwiperSlide key={card.id}></SwiperSlide>
          ))}
          <CustomRight />
        </Swiper>
      )}
      {data.cardActivity2.length > 0 ? (
        <div className="container">
          <Swiper
            slidesPerView={3}
            loop={true}
            allowSlideNext
            allowSlidePrev
            allowTouchMove
            loopFillGroupWithBlank={true}
            modules={[Controller, Pagination]}
            onSwiper={setControlledSwiper}
            breakpoints={responsive}
            pagination={size === "sm" ? pagination : false}
            ref={swiperRef}
            autoplay={false}
            className="customdotsSwiper"
          >
            {data.cardActivity2.map((card, index) => (
              <SwiperSlide key={card.id + index} className="card-item">
                <div
                  className="flex flex-col items-center rounded-xl bg-[#F9F8F8] h-full img-wrapper"
                  style={{
                    "--tw-shadow":
                      "1 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <NextImage
                    media={card.image}
                    width={610}
                    height={175}
                    className="w-full rounded-t-xl min-h-[170px] max-h-[170px] object-cover"
                  />
                  <h2
                    className="font-bold text-xl pt-3 px-10"
                    style={{ color: COLOR_PALETTE.orange }}
                  >
                    {card.itemTitle ?? ""}
                  </h2>
                  <hr className="h-[1px] bg-[#C4C4C4] w-5/6 my-2" />
                  <div className="flex flex-1 justify-between flex-col px-8 w-full">
                    <div className="h-full w-full pt-3 px-6 xl:px-2 ck-content flex-0 text-content">
                      {ReactHtmlParser(card.content ?? "")}
                    </div>
                    <div className="w-full mb-8">
                      {card?.link && (
                        <CustomLink link={card?.link}>
                          <ButtonIcon
                            icon={
                              <IoIosArrowForward className="text-2xl text-black-600" />
                            }
                            text={card.link.text ?? ""}
                            className={
                              " border-2 text-black h-[41px] text-[16px] rounded-3xl hover:bg-[#f36c00] hover:border-transparent transition-all duration-300 px-0 hover:text-white button-icon"
                            }
                          />
                        </CustomLink>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default FlatCardGroup
