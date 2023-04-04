import { getStrapiMedia } from "utils/media"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import CustomButtonLink from "./custom-button-link"
import React from "react"
import BreadCrumb from "../elements/breadcrumb"
import ReactHtmlParser from "react-html-parser"

const BannerSilder = ({ data }) => {
  const { banner } = data
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
      slidesToSlide: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1420 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1419, min: 1140 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 1139, min: 860 },
      items: 1,
      slidesToSlide: 1,
    },
    small_mobile: {
      breakpoint: { max: 859, min: 600 },
      items: 1,
      slidesToSlide: 1,
    },
    mobiles: {
      breakpoint: { max: 600, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  }

  return (
    <Carousel
      swipeable={false}
      draggable={false}
      showDots={banner?.data?.length > 1 ? true : false}
      responsive={responsive}
      ssr={false} // means to render carousel on server-side.
      infinite={true}
      autoPlay={banner?.data?.length > 1 ? true : false}
      autoPlaySpeed={5000}
      arrows={banner?.data?.length > 1 ? true : false}
      keyBoardControl={false}
      customTransition="all 2s"
      transitionDuration={2000}
      containerClass={`carousel-container`}
      removeArrowOnDeviceType={["mobile"]}
      dotListClass="custom-dot-list-style"
      itemClass={`carousel-item-padding-40-px `}
      //   className="pb-4 lg:pb-8"
    >
      {banner &&
        banner.data.map((pic) => (
          <div
            key={pic.id}
            className="banner-slider-item flex items-center justify-center banner-gradient-background"
            style={{
              backgroundImage: `url(${getStrapiMedia(pic.attributes.url)})`,
            }}
          >
            <div className="w-4/5 lg:w-2/5 z-20 ck-content">
              <div className="text-center">
                <label style={{ lineHeight: "2rem" }}>
                  {ReactHtmlParser(data.title ?? "")}
                </label>
                <p className="mt-5">
                  {ReactHtmlParser(data.description ?? "")}
                </p>
                <div className="mt-2">
                  <BreadCrumb />
                </div>
                <div className="flex items-center justify-center gap-x-2 mt-5">
                  {data.buttons.map((item) => (
                    <div key={item.id} className="w-1/4">
                      {item.type === "secondary" ? (
                        <CustomButtonLink
                          link={item}
                          text={item.text}
                          className="customer-color-button text-[1.125rem] text-white bg-transparent border-2 !border-white h-14 flex items-center"
                        />
                      ) : (
                        <CustomButtonLink
                          link={item}
                          text={item.text}
                          className="bg-[#f36c00] md:text-[1.125rem] text-[1rem] color-button-link md:h-14 h-10 flex items-center custom-butom-header"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
    </Carousel>
  )
}

export default BannerSilder
