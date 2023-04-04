import NextImage from "../elements/image"
import Video from "../elements/video"
import { getStrapiURL } from "utils/api"
import SectionWithBackGround from "../elements/section-with-bg"
import SectionTitle from "../elements/section-title"
import React, { useEffect } from "react"
import ReactPlayer from "react-player/lazy"
import { Skeleton } from "antd"
import { sleep } from "utils/hooks"
import { COLOR_PALETTE } from "common/const/color-palette"

const FeatureRowsGroup = ({ data }) => {
  const [loading, setLoading] = React.useState(false)
  const backgroundColor =
    data.featureRowBgColor === "gray" ? COLOR_PALETTE.grayWhite : "white"
  useEffect(() => {
    setLoading(true)
    sleep(2000)
    setLoading(false)
  }, [])
  return (
    <div
      style={{ background: backgroundColor }}
      className={`carousel-container pb-8 md:pb-16 xl:pb-32`}
    >
      <div className="flex justify-center items-center">
        {data.title ? <SectionTitle text={data.title} /> : ""}
      </div>
      {data.features.map((feature, index) => (
        <React.Fragment key={index + "frg"}>
          <div className="container flex justify-center py-4">
            {index !== 0 && <hr className="w-1/2 border-t" />}
          </div>
          <SectionWithBackGround
            className="my-2"
            sectionIndex={1}
            key={feature.id}
          >
            <div
              className={`container gap-x-10 text-lg flex  ${
                feature.isMediaLeft ? "flex-col-reverse" : "flex-col"
              }   justify-between items-center xl:flex-row `}
            >
              {/* Media section */}
              {feature.isMediaLeft && (
                <div className="max-h-full w-full flex justify-center xl:w-1/2">
                  {/* Images */}
                  {feature.media.data.attributes.mime.startsWith("image") &&
                    !feature.useVideoLink && (
                      <div className="h-auto relative">
                        <NextImage
                          media={feature.media}
                          width={data.imageWidth}
                          height={data.imageHeight}
                          className="rounded-[11px] z-10"
                        />
                        {feature.isShowBorder && (
                          <div className="absolute w-80 h-52 bg-[#fb8020] rounded-tl-2xl top-[-5px] left-[-6px]" />
                        )}
                      </div>
                    )}
                  {/* Videos */}
                  {feature.media.data.attributes.mime.startsWith("video") &&
                    !feature.useVideoLink && (
                      <Video
                        media={feature.media}
                        className="w-full h-auto my-2 rounded-[11px]"
                        autoPlay={false}
                      />
                    )}
                  {/* Youtube Link */}
                  {feature.videoLink && feature.useVideoLink && (
                    <ReactPlayer
                      url={feature.videoLink}
                      controls
                      width={data.imageWidth}
                      height={data.imageHeight}
                      fallback={<Skeleton loading={loading} />}
                    />
                  )}
                </div>
              )}
              {/* Text section */}
              <div className="w-full py-2 xl:w-1/2">
                {feature.isShowIconContent && (
                  <div className="h-auto hidden md:block">
                    <NextImage
                      media={feature.iconContent}
                      width={50}
                      height={50}
                      className="rounded-[11px]"
                    />
                  </div>
                )}
                <div
                  className={`ck-content`}
                  dangerouslySetInnerHTML={{
                    __html: feature.title,
                  }}
                ></div>
                {feature.description && (
                  <div
                    className="my-6 tracking-wide text-[16px]"
                    dangerouslySetInnerHTML={{
                      __html: feature.description,
                    }}
                  ></div>
                )}
                <div
                  className="my-6 tracking-wide text-justify ck-content"
                  dangerouslySetInnerHTML={{
                    __html: feature.content.replace(
                      new RegExp("/uploads", "g"),
                      `${getStrapiURL("/uploads")}`
                    ),
                  }}
                />
              </div>
              {/* Media section */}
              {!feature.isMediaLeft && feature.media.data && (
                <div className="max-h-full w-full flex justify-center xl:w-1/2">
                  {/* Images */}
                  {feature.media.data.attributes.mime.startsWith("image") &&
                    !feature.useVideoLink && (
                      <div className="h-auto relative">
                        <NextImage
                          media={feature.media}
                          width={data.imageWidth}
                          height={data.imageHeight}
                          className="rounded-[11px] z-10"
                        />
                        {feature.isShowBorder && (
                          <div className="absolute w-80 h-52 bg-[#fb8020] rounded-tr-2xl top-[-5px] right-[-6px]" />
                        )}
                      </div>
                    )}
                  {/* Videos */}
                  {feature.media.data.attributes.mime.startsWith("video") &&
                    !feature.useVideoLink && (
                      <Video
                        media={feature.media}
                        className="w-full h-auto my-2 rounded-[11px]"
                      />
                    )}
                  {/* Youtube Link */}
                  {feature.videoLink && feature.useVideoLink && (
                    <ReactPlayer
                      url={feature.videoLink}
                      controls
                      width={data.imageWidth}
                      height={data.imageHeight}
                      fallback={<Skeleton loading={loading} />}
                    />
                  )}
                </div>
              )}
            </div>
          </SectionWithBackGround>
        </React.Fragment>
      ))}
    </div>
  )
}

export default FeatureRowsGroup
