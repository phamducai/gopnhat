import React from "react"
import ReactHtmlParser from "react-html-parser"

function SectionTitle({ text, titleClassName, ...rest }) {
  return (
    <div
      style={{
        background: `url("/assets/HICAS.png")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundOrigin: "content-box",
        backgroundPosition: "center",
        fontFamily: "SVN-Gilroy-Black",
      }}
      className="my-8 p-2 flex items-center justify-center min-h-[80px] min-w-[250px] lg:min-h-[95px] lg:min-w-[382px] font-bold tracking-wide text-center"
    >
      <div
        className={`${titleClassName} flex justify-center items-center text-4xl md:text-[40px] leading-normal pb-[0.5em]`}
      >
        {ReactHtmlParser(text)}
      </div>
    </div>
  )
}

export default SectionTitle
