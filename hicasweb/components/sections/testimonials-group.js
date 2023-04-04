import { COLOR_PALETTE } from "common/const/color-palette"
import { useState } from "react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import { Autoplay, Controller, Pagination } from "swiper"
import { Swiper, SwiperSlide, useSwiper } from "swiper/react"
import { useWindowSize } from "utils/hooks"
import NextImage from "../elements/image"
import SectionTitle from "../elements/section-title"
import ArrowLeft from "../icons/arrow-left"
import ArrowRight from "../icons/arrow-right"
import ReactHtmlParser from "react-html-parser"

const TestimonialsGroup = ({ data }) => {
  const size = useWindowSize()
  const backgroundColor =
    data.testimonialsBgColor === "gray" ? COLOR_PALETTE.grayWhite : "white"
  // Only show one testimonial at a time
  const responsive = {
    // the naming can be any, depends on you.
    3000: {
      slidesPerView: data.testimonials.length > 1 ? 2 : 1,
      spaceBetween: 12,
      slidesPerGroup: 1,
    },
    1420: {
      slidesPerView: data.testimonials.length > 1 ? 2 : 1,
      spaceBetween: 12,
      slidesPerGroup: 1,
    },
    1369: {
      slidesPerView: data.testimonials.length > 1 ? 2 : 1,
      spaceBetween: 15,
      slidesPerGroup: 1,
    },
    1280: {
      slidesPerView: data.testimonials.length > 1 ? 2 : 1,
      spaceBetween: 15,
      slidesPerGroup: 1,
    },
    1140: {
      slidesPerView: 1,
      spaceBetween: 13,
      slidesPerGroup: 1,
    },
    860: {
      slidesPerView: 1,
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

  const pagination = {
    clickable: true,
  }
  return (
    <section
      style={{ background: backgroundColor }}
      className={`container text-center text-lg relative pb-8`}
    >
      <div className="flex justify-center items-center mt-4">
        <SectionTitle text={data.title} />
      </div>
      {/* <NextImage media={data.logos[0].logo} /> */}
      <div
        className=" relative"
        style={{ paddingLeft: "0 !important", paddingRight: "0 !important" }}
      >
        <div
          className={`${
            data.testimonials.length > 1
              ? "corner-dot-bot1"
              : "corner-dot-bot-single-upper"
          }`}
        >
          <div
            className={`${
              data.testimonials.length > 1
                ? "corner-dot-bot2"
                : "corner-dot-bot-single-down"
            } `}
          >
            <div
              className={`${
                data.testimonials.length > 1
                  ? "corner-dot-top1"
                  : "corner-dot-top-single-upper"
              } `}
            >
              <div
                className={`${
                  data.testimonials.length > 1
                    ? "corner-dot-top2"
                    : "corner-dot-top-single-down"
                } `}
              >
                <Swiper
                  slidesPerView={3}
                  loop={true}
                  allowSlideNext
                  allowSlidePrev
                  allowTouchMove
                  loopFillGroupWithBlank={true}
                  modules={[Autoplay, Controller, Pagination]}
                  breakpoints={responsive}
                  pagination={pagination}
                  autoplay={
                    data.autoplay
                      ? {
                          delay: 5000,
                          disableOnInteraction: true,
                        }
                      : false
                  }
                  className="customdotsSwiperTestimonial container"
                >
                  {data.testimonials.map((item, index) => (
                    <SwiperSlide
                      key={item.id}
                      className={` lg:mt-12 text-left cursor-pointer ${
                        data.testimonials.length === 1 ? "container" : ""
                      } `}
                    >
                      <div
                        className={`px-4 sm:px-8 py-12 !rounded shadow-md mt-4 bg-[#DCF3FC] text-justify ck-content text-small leading-normal`}
                      >
                        {ReactHtmlParser(item.text ?? "")}
                      </div>
                      <div className="flex flex-row justify-center mt-8">
                        <div>
                          <NextImage media={item.logo} width={80} height={80} />
                        </div>
                        <div className="px-3 pt-2">
                          <span className="text-[24px] font-bold">
                            {item.authorName}
                          </span>
                          <p>{item.authorTitle}</p>
                        </div>
                        <div
                          className={`${
                            data.testimonials.length === 1
                              ? "arrow-header-single"
                              : "arrow-header"
                          }`}
                        ></div>
                      </div>
                      <div
                        style={{
                          fontFamily: "SVN-Gilroy",
                          fontSize: 175,
                        }}
                        className={`hidden sm:block font-black text-[#FB8020] absolute  ${
                          data.testimonials.length === 1
                            ? "left-40 xl:left-80 md:left-56 lg:left-52 top-[5.5rem] sm:top-[2.5rem]"
                            : "left-24 sm:top-[2.5rem] top-[5.5rem]"
                        }`}
                      >
                        {`“`}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsGroup
