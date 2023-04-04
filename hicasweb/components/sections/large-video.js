import { Skeleton } from "antd"
import React, { useEffect } from "react"
import ReactPlayer from "react-player"
import { sleep } from "utils/hooks"
import SectionTitle from "../elements/section-title"
import Video from "../elements/video"

const LargeVideo = ({ data }) => {
  const [loading, setLoading] = React.useState(false)
  useEffect(() => {
    setLoading(true)
    sleep(2000)
    setLoading(false)
  }, [])
  return (
    <section className="w-full flex flex-col text-center">
      <div className="flex justify-center items-center ">
        {data.title ? (
          <SectionTitle text={data.title} titleClassName="colorTitle" />
        ) : (
          ""
        )}
      </div>
      {data.description && (
        <div
          className={`ck-content mb-8`}
          dangerouslySetInnerHTML={{
            __html: data.description,
          }}
        ></div>
      )}
      {/* Video wrapper */}
      <div className="flex justify-center mx-auto overflow-hidden">
        <div className="w-full shadow-md mx-2 rounded-lg video">
          {/* Videos */}
          {!data.useVideoLink && data.video && (
            <Video
              media={data.video}
              className="rounded-[11px]"
              autoPlay={false}
            />
          )}
          {/* Youtube Link */}
          {data.videoLinks && data.useVideoLink && (
            <ReactPlayer
              url={
                "https://www.youtube.com/watch?v=pM3mnj2XemQ&ab_channel=HicasChannel"
              }
              controls
              width="100%"
              height="100%"
              fallback={<Skeleton loading={loading} />}
              style={{
                borderRadius: "11px !important",
              }}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default LargeVideo
