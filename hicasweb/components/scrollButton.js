import { BackTop } from "antd"
import { useEffect } from "react"
import { IoIosArrowUp } from "react-icons/io"

const ScrollButton = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <BackTop
        duration={800}
        visibilityHeight={500}
        className="back-top opacity-60 bg-transparent"
      >
        <div
          className={
            "w-12 h-12 rounded-full bg-[#7c7c7c] hover:border-transparent transition-all duration-300 text-white px-0 flex items-center justify-center"
          }
        >
          <IoIosArrowUp
            className="text-3xl text-black-600"
            style={{ fontSize: "1.5rem" }}
          />
        </div>
      </BackTop>
    </>
  )
}

export default ScrollButton
