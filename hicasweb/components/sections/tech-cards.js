import { COLOR_PALETTE } from "common/const/color-palette"
import React from "react"
import NextImage from "../elements/image"
import SectionTitle from "../elements/section-title"
import ReactHtmlParser from "react-html-parser"
import Link from "next/link"
import ButtonIcon from "../elements/buttonIcon"
import { IoIosArrowForward } from "react-icons/io"
const TechCards = ({ data }) => {
  const backgroundColor =
    data.techBgColor === "gray" ? COLOR_PALETTE.grayWhite : "white"

  return (
    <div
      className={`relative mb-8`}
      style={{ scrollMarginTop: "4.5rem", background: backgroundColor }}
      id="technology-home"
    >
      <SectionTitle text={data?.bigTitle ?? ""} />
      <div className="container grid grid-cols-4 md:gap-7 gap-2">
        {data?.techItems.map((item) => (
          <div
            key={item.id + "tc"}
            className="xl:col-span-1 col-span-2 md:h-[300px] h-[260px] rounded-lg"
            style={{ backgroundColor: COLOR_PALETTE.grayWhite }}
          >
            <div
              className="w-1/2 h-[4px] rounded-lg"
              style={{ backgroundColor: COLOR_PALETTE.orange, margin: "auto" }}
            />
            <div className="md:p-10 p-7">
              <div className="flex items-center gap-5">
                <NextImage media={item.techIcon} width={45} height={45} />
                <div className="md:text-[18px] text-xl font-semibold">
                  {ReactHtmlParser(item.techTitle ?? "")}
                </div>
              </div>
              <div className="custom-text-html lg:text-[14px] md:text-[14px] text-base font-normal mt-5">
                {ReactHtmlParser(item.description ?? "")}
              </div>
            </div>
          </div>
        ))}
        {data?.buttonLink && (
          <div className="col-span-4 flex justify-center mt-8 h-[50px]">
            <Link href={data?.buttonLink.url ?? "/"}>
              <a>
                <ButtonIcon
                  icon={<IoIosArrowForward />}
                  text={data.buttonLink.text}
                  className="border py-2 px-5 hover:bg-[#f36c00] hover:border-transparent transition-all duration-300 hover:text-white rounded-3xl text-[14px]"
                />
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default TechCards
