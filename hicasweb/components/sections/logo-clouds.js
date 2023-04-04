import { COLOR_PALETTE } from "common/const/color-palette"
import React, { useEffect, useState } from "react"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { Autoplay, Controller, Pagination } from "swiper"
import "swiper/css"
import "swiper/css/pagination"
import { Swiper, SwiperSlide, useSwiper } from "swiper/react"
import { useWindowSize } from "utils/hooks"
import NextImage from "../elements/image"
import SectionTitle from "../elements/section-title"

const LogoClouds = ({ data }) => {
  const [controlledSwiper, setControlledSwiper] = useState(null)
  const windowSize = useWindowSize()
  const backgroundColor =
    data.logoCloudsBgColor === "gray" ? COLOR_PALETTE.grayWhite : "white"

  const responsive = {
    // the naming can be any, depends on you.
    3000: {
      slidesPerView: 6,
      slidesPerGroup: 1,
      spaceBetween: 20,
    },
    1420: {
      slidesPerView: 6,
      slidesPerGroup: 1,
      spaceBetween: 20,
    },
    1330: {
      slidesPerView: 5,
      slidesPerGroup: 1,
      spaceBetween: 20,
    },
    1140: {
      slidesPerView: 5,
      spaceBetween: 20,
      slidesPerGroup: 1,
    },
    860: {
      slidesPerView: 4,
      spaceBetween: 20,
      slidesPerGroup: 1,
    },
    600: {
      slidesPerView: 4,
      spaceBetween: 20,
      slidesPerGroup: 1,
    },
    0: {
      slidesPerView: 4,
      spaceBetween: 15,
      slidesPerGroup: 1,
    },
  }
  const arrowStyle = {
    background: "#F4F4F4",
    border: "1px solid rgba(196, 196, 196, 1)",
    color: "rgba(61, 60, 60, 1)",
    borderRadius: "100%",
  }
  const CustomRight = () => {
    const swiper = useSwiper()

    return (
      <button
        className="absolute hidden lg:right-16 3xl:right-24 4xl:right-36 top-1/3 z-50 h-[47px] w-[47px] p-auto text-center xl:inline-block "
        onClick={() => swiper.slideNext()}
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
        className="absolute hidden lg:left-16 3xl:left-24 4xl:left-36 top-1/3 z-50 w-[47px] h-[47px] p-auto text-center xl:inline-block "
        onClick={() => swiper.slidePrev()}
        style={arrowStyle}
      >
        <IoIosArrowBack
          className="flex items-center justify-center"
          style={{ fontSize: "1.9rem", display: "initial" }}
        />
      </button>
    )
  }

  const pagination = {
    clickable: false,
    renderBullet: function (index, className) {
      return `<span class="${className}"></span>`
    },
  }
  return (
    <div
      style={{ background: backgroundColor }}
      className={`carousel-container lg:pb-16 pb:8`}
    >
      <div className="flex justify-center items-center">
        <SectionTitle text={data.logoCloudsTitle} />
      </div>
      <Swiper
        className="h-20"
        modules={[Controller]}
        controller={{ control: controlledSwiper }}
        breakpoints={responsive}
        allowSlideNext
        allowSlidePrev
        loopFillGroupWithBlank={true}
        loop={true}
      >
        <CustomLeft />
        {data.logoCloudsItems.map((logo, index) => (
          <div key={logo.id + "c" + index} className="hidden">
            <SwiperSlide
              key={logo.id + "c" + index}
              className="h-2 w-2"
            ></SwiperSlide>
          </div>
        ))}
        <CustomRight />
      </Swiper>
      <div className="container -mt-20">
        <Swiper
          loop={true}
          allowSlideNext
          allowSlidePrev
          loopFillGroupWithBlank={true}
          modules={[Autoplay, Controller, Pagination]}
          pagination={
            !["3xl", "xl", "4xl"].includes(windowSize) ? pagination : false
          }
          onSwiper={setControlledSwiper}
          className="customdotsSwiper !pb-8"
          breakpoints={responsive}
          autoplay={
            data.autoplay
              ? {
                  delay: 5000,
                  disableOnInteraction: true,
                  pauseOnMouseEnter: true,
                }
              : false
          }
        >
          {data.logoCloudsItems.map((logo, index) => (
            <SwiperSlide
              key={logo.id + "-lgI-" + index}
              className="bg-white shadow-lg rounded-xl flex justify-center items-center p-2"
              style={{
                width:
                  windowSize === "sm" ? 90 : windowSize === "md" ? 98 : 108,
                height:
                  windowSize === "sm" ? 60 : windowSize === "md" ? 90 : 100,
              }}
            >
              {logo.icon && (
                <div className="flex justify-center items-center">
                  <NextImage
                    height={
                      windowSize === "sm" ? 60 : windowSize === "md" ? 90 : 100
                    }
                    media={logo.icon}
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default LogoClouds
