import NextImage from "../elements/image"
import { COLOR_PALETTE } from "common/const/color-palette"
import SectionTitle from "../elements/section-title"
import CustomLink from "../elements/custom-link"
import ButtonIcon from "../elements/buttonIcon"
import { IoIosArrowForward } from "react-icons/io"
import { useRouter } from "next/router"

// ${
//     index === 0
//       ? "border-corner-right-bottom"
//       : index === data.features.length - 1
//       ? "border-corner-left-top"
//       : index === 1
//       ? "border-corner-left-bottom"
//       : "border-corner-right-top"
//   }
const FeatureColumnsGroup = ({ data }) => {
  const router = useRouter()
  const backgroundColor =
    data.featureColumnBgColor === "gray" ? COLOR_PALETTE.grayWhite : "white"
  return (
    <div
      style={{ background: backgroundColor, scrollMarginTop: "4.5rem" }}
      className={`carousel-container `}
      id={"section-products"}
    >
      <div className="flex justify-center items-center">
        <SectionTitle text={data.featureColumnsTitle} />
      </div>
      <div className="container flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-4 pb-16 gap-8">
          {data.features.map((feature) => (
            <div
              className={`col-span-1 sm:col-span-2 lg:col-span-1 bg-white rounded-xl text-[14px] h-[500px] max-w-[357px] flex flex-col items-center`}
              key={feature.id}
            >
              <div className="cut-off-display">
                {feature.link ? (
                  <div
                    className="img-wrapper"
                    onClick={() => router.push(feature.link.url)}
                  >
                    <NextImage
                      media={feature.icon}
                      width={357}
                      height={184}
                      className="rounded-t-xl"
                    />
                  </div>
                ) : (
                  <NextImage media={feature.icon} width={357} height={184} />
                )}
              </div>
              {feature.logo && (
                <div
                  style={{ width: 63, height: 72 }}
                  className="flex justify-center items-center flex-0 my-2"
                >
                  <NextImage media={feature.logo} />
                </div>
              )}
              <div className="px-7 pb-8 flex flex-col justify-between flex-1">
                <div className="text-center">
                  {feature.link ? (
                    <CustomLink link={feature.link}>
                      <h3
                        style={{
                          color: COLOR_PALETTE.orange,
                          fontFamily: "SVN-Gilroy-Bold",
                        }}
                        className={`font-bold tracking-wider text-[20px] md:text-[24px]`}
                      >
                        {feature.title}
                      </h3>
                    </CustomLink>
                  ) : (
                    <h3
                      style={{
                        color: COLOR_PALETTE.orange,
                        fontFamily: "SVN-Gilroy-Bold",
                      }}
                      className={`font-bold tracking-wider text-[28px] md:text-[33px]`}
                    >
                      {feature.title}
                    </h3>
                  )}
                  <p className="text-gray-600 text-[14px]">
                    {feature.description}
                  </p>
                </div>
                <div>
                  {feature.link && (
                    <CustomLink
                      linkClassName={`text-black`}
                      link={feature.link}
                    >
                      <ButtonIcon
                        text={feature.link.text}
                        icon={<IoIosArrowForward />}
                        className="border py-2 hover:bg-[#f36c00] hover:border-transparent transition-all duration-300 hover:text-white rounded-3xl text-[14px]"
                      />
                    </CustomLink>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeatureColumnsGroup
