import ReactPlayer from "react-player"
import { getStrapiURL } from "utils/api"
import NextImage from "../../elements/image"

const SectionIntroduction = ({ data }) => {
  const { introduction } = data
  return (
    <div className="container flex flex-col gap-12 py-12">
      {/* Giới thiệu */}
      <p className="Font-Styles-Title-Global">{introduction.title}</p>
      <div className="flex flex-col justify-start md:justify-between md:items-center gap-10 lg:flex-row-reverse">
        <div className="w-full lg:w-6/12 lg:pr-6 text-lg">
          <div
            dangerouslySetInnerHTML={{
              __html: introduction.content.replace(
                new RegExp("/uploads", "g"),
                `${getStrapiURL("/uploads")}`
              ),
            }}
          />
        </div>
        <div className="w-full sm:9/12 lg:w-4/12 max-h-full">
          {introduction.introMedia.data &&
            introduction.introMedia.data.attributes.mime.startsWith(
              "image"
            ) && (
              <div className="w-full h-auto">
                <NextImage
                  media={introduction.introMedia}
                  width={500}
                  height={500}
                />
              </div>
            )}
          {/* VIDEO */}
          {introduction.videoUrl && (
            <div className="w-full h-auto">
              <ReactPlayer
                url={introduction.videoUrl}
                width="100%"
                height="300px"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SectionIntroduction
