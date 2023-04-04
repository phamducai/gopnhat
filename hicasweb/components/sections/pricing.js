import { MdCheckBox } from "react-icons/md"
import classNames from "classnames"
import SectionTitle from "../elements/section-title"
import NextImage from "../elements/image"
import CustomLink from "../elements/custom-link"
import ButtonIcon from "../elements/buttonIcon"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"

const Pricing = ({ data }) => {
  return (
    <div className="bg-[#F2F2F2] pb-12 xl:pb-32">
      <div className="container">
        <div className="flex justify-center items-center">
          {data.title ? <SectionTitle text={data.title} /> : ""}
        </div>
        <div className="flex flex-col lg:flex-row gap-8 md:gap-8 lg:gap-4 xxl:gap-16 lg:justify-center ">
          {data.plans.map((plan) => (
            <div
              className={classNames(
                // Common classes
                "rounded-2xl shadow-lg border-2 py-4 px-4 flex-1 md:w-lg bg-white",
                // Normal plan
                {
                  "text-gray-900": !plan.isRecommended,
                },
                // Recommended plan
                {
                  "bg-primary-100 text-primary-900 border-primary-300":
                    plan.isRecommended,
                }
              )}
              key={plan.id}
            >
              <div
                className={classNames(`rounded-3xl text-center py-2 px-4 `)}
                style={{ backgroundColor: plan.backgroundColor }}
              >
                {plan.title && (
                  <div
                    className={`ck-content`}
                    dangerouslySetInnerHTML={{
                      __html: plan.title,
                    }}
                  ></div>
                )}
                {plan.description && (
                  <div
                    className={`ck-content`}
                    dangerouslySetInnerHTML={{
                      __html: plan.description,
                    }}
                  ></div>
                )}
              </div>
              <div
                className="flex justify-center text-5xl !my-8 text-[#575656]"
                style={{ fontFamily: "SVN-Gilroy" }}
              >
                <div>{plan.price === 0 ? "Free " : `$${plan.price} `}</div>
                {plan.pricePeriod && (
                  <span className="text-base font-medium mt-1 text-[#575656]">
                    {plan.pricePeriod}
                  </span>
                )}
              </div>
              <div className="relative">
                <ul className="mt-4 flex flex-col border-2 rounded-xl">
                  {plan.features.map((feature, index) => (
                    <li
                      className="flex items-center h-12"
                      key={feature.id}
                      style={
                        index % 2 != 0
                          ? { backgroundColor: "#FFFFFF", opacity: "0.74" }
                          : { backgroundColor: "#EEEEEE" }
                      }
                    >
                      {feature.icon && (
                        <div className="h-auto px-4">
                          <NextImage
                            media={feature.icon}
                            className="rounded-[11px]"
                          />
                        </div>
                      )}
                      {feature.title && (
                        <div
                          className={`ck-content px-4`}
                          dangerouslySetInnerHTML={{
                            __html: feature.title,
                          }}
                        ></div>
                      )}
                    </li>
                  ))}
                </ul>
                <div className=" absolute w-1/2 lg:w-3/5 text-center left-[25%] lg:left-[20%] -bottom-14">
                  {/* <CustomLink > */}
                  <ButtonIcon
                    icon={
                      <IoIosArrowForward className="text-2xl text-white-600" />
                    }
                    text={"Mua ngay"}
                    className={
                      " border-2 text-white h-[41px] text-[16px] rounded-3xl bg-[#FB8020] hover:border-transparent transition-all duration-300 px-0 hover:text-white button-icon"
                    }
                  />
                  {/* </CustomLink> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pricing
