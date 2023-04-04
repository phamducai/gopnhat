import NextImage from "@/components/elements/image"
import { Image } from "antd"
import ReactPlayer from "react-player"
import { getStrapiURL } from "utils/api"
import { getStrapiMedia } from "utils/media"

const ProductTingConnect = ({ data }) => {
  const {
    introduction,
    tingProvidedTitle,
    tingForResident,
    residentList,
    tingManage,
    tingMangeList,
    tingChanel,
    tingChanelList,
    tingFeatureImage,
    tingImageTile,
    tingImages,
    testimonialTitle,
    testimonialImages,
    testimonialBackground,
    testimonialAnnouce,
    testimonialContent,
  } = data

  return (
    <div className="text-lg">
      {/* Giới thiệu */}
      <p className="Font-Styles-Title-Global pb-4 pt-8">{introduction.title}</p>
      <div className="flex flex-col-reverse px-4 sm:flex-row sm:px-48">
        {introduction.videoUrl && (
          <div className="hidden 2xl:block w-1/2 sm:pr-24">
            <ReactPlayer url={introduction.videoUrl} />
          </div>
        )}
        {introduction.videoUrl && (
          <div className="w-full block 2xl:hidden sm:mr-24">
            <ReactPlayer url={introduction.videoUrl} width="100%" />
          </div>
        )}
        <div
          className="ck-content pb-8 sm:pb-0 w-1/2"
          dangerouslySetInnerHTML={{
            __html: introduction.content.replace(
              new RegExp("/uploads", "g"),
              `${getStrapiURL("/uploads")}`
            ),
          }}
        />
      </div>
      {/* Ting cung cấp */}
      <div>
        <p className="Font-Styles-Title-Global pb-12 pt-20">
          {tingProvidedTitle}
        </p>
        <div className="mx-4 sm:mx-48 sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="mb-8 sm:mb-0">
            <div className="flex justify-center mb-16">
              <Image src="../../app.svg" width={75} height={75} />
            </div>
            <p className="font-bold text-2xl">{tingForResident}</p>
            {residentList &&
              residentList.map((item) => <p key={item.id}>{item.title}</p>)}
          </div>
          <div className="mb-8 sm:mb-0">
            <div className="flex justify-center mb-16">
              <Image src="../../business.svg" width={75} height={75} />
            </div>
            <p className="font-bold text-2xl">{tingManage}</p>
            {tingMangeList &&
              tingMangeList.map((item) => <p key={item.id}>{item.title}</p>)}
          </div>
          <div className="mb-8 sm:mb-0">
            <div className="flex justify-center mb-16">
              <Image src="../../customer.svg" width={75} height={75} />
            </div>
            <p className="font-bold text-2xl">{tingChanel}</p>
            {tingChanelList &&
              tingChanelList.map((item) => <p key={item.id}>{item.title}</p>)}
          </div>
        </div>
      </div>
      <div className="pt-8 hidden 3xl:flex w-full">
        <NextImage media={tingFeatureImage} height="100%" width="100%" />
      </div>
      <div className="pt-8 w-full ml-4 block sm:hidden">
        <NextImage media={tingFeatureImage} height="250" width="350" />
      </div>
      <div className="pt-8 w-full hidden sm:block 3xl:hidden">
        <NextImage media={tingFeatureImage} height="500" width="1366" />
      </div>
      {/* hình ảnh tingconnect */}
      <div className="pb-16">
        <p className="Font-Styles-Title-Global pb-4 pt-8">{tingImageTile}</p>
        <div className="ml-4 sm:mx-48 sm:grid sm:grid-cols-3 sm:gap-16">
          {tingImages &&
            tingImages.map((item) => (
              <div key={item.id} className="bg-gray-200 pt-4 pr-4 pl-4 ">
                <div className="w-full h-3/4">
                  <NextImage
                    media={item.image}
                    height="200"
                    width="492"
                    className="rounded-md "
                  />
                </div>
                <p className="pt-8 flex justify-center font-bold">
                  {item.title}
                </p>
              </div>
            ))}
        </div>
      </div>
      {/* khách hàng của ting */}
      <div>
        <p className="Font-Styles-Title-Global pb-4 pt-8">{testimonialTitle}</p>
        <div className="ml-4 sm:mx-48 sm:grid sm:grid-cols-4 sm:gap-4">
          {testimonialImages &&
            testimonialImages.map((item) => (
              <div key={item.id} className="border mb-12 h-88 rounded-md">
                <div className="w-full h-3/4">
                  <NextImage
                    media={item.image}
                    height="300"
                    width="400"
                    className="rounded-md "
                  />
                </div>
                <p className="py-5 pt-8 flex justify-center font-bold">
                  {item.title}
                </p>
              </div>
            ))}
        </div>
      </div>
      {/* khách hàng nói về ting */}
      <div
        className="mx-4 sm:mx-48 text-white mb-8"
        style={{
          backgroundImage: `url(${getStrapiMedia(
            testimonialBackground.data.attributes.url
          )})`,
          height: "460px",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="ml-4 pt-8 sm:w-1/2 sm:ml-24 sm:pt-24 sm:pr-32">
          <p className="font-bold text-2xl">{testimonialAnnouce}</p>
          <div
            className="ck-content"
            dangerouslySetInnerHTML={{
              __html: testimonialContent.replace(
                new RegExp("/uploads", "g"),
                `${getStrapiURL("/uploads")}`
              ),
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductTingConnect
