import classNames from "classnames"
import CustomLink from "../elements/custom-link"

const CustomButtonLink = ({ link, text, className }) => {
  return (
    <div
      className={classNames(
        className,
        `border border-[#f36c00] rounded-[24px] tracking-wide flex justify-center py-3 text-xl font-medium text-link-yellow-500 bg-white hover:bg-[#f2b566] hover:border-[#f2b566] transition-all duration-300 ease-in-out hover:cursor-pointer`
      )}
    >
      <CustomLink link={link}>{text}</CustomLink>
    </div>
  )
}

export default CustomButtonLink
