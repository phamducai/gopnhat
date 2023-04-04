import NextImage from "../elements/image"
import CustomButtonLink from "../elements/custom-button-link"
import SectionTitle from "../elements/section-title"
import { COLOR_PALETTE } from "common/const/color-palette"

const AdvantagesRow = ({ data }) => {
  const backgroundColor =
    data.advantagesBgColor === "gray" ? COLOR_PALETTE.grayWhite : "white"
  return (
    <div
      style={{ background: backgroundColor }}
      className={`carousel-container `}
    >
      <div className="flex justify-center items-center">
        <SectionTitle text={data.advantageRowTitle} />
      </div>
      <div className="container grid grid-cols-5 gap-8 py-8 pb-16 md:pb-24 xl:pb-40">
        {data.advantagesFeatures.map((feature) => (
          <div className="col-span-5 lg:col-span-1" key={feature.id}>
            {feature.itemIcon && (
              <div className="flex justify-center items-center ">
                <div
                  style={{ background: feature.iconWrapperBackground }}
                  className="w-[150px] h-[150px] xl:w-[162px] xl:h-[162px] p-2 flex justify-center items-center rounded-full"
                >
                  <NextImage media={feature.itemIcon} width={70} height={70} />
                </div>
              </div>
            )}
            <div>
              <h3 className="font-bold tracking-wider mt-4 mb-2 text-2xl">
                {feature.itemTitle}
              </h3>
              <p className="text-center text-[14px] text-gray-600 tracking-wide">
                {feature.description}
              </p>
              {feature.url && (
                <div className="lg:w-max">
                  <CustomButtonLink
                    link={{
                      url: feature.url,
                      text: "link",
                      newTab: false,
                      id: "linkId",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdvantagesRow
