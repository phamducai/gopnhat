import classNames from "classnames"
import CustomLink from "../elements/custom-link"

const CustomButtonLink = ({ link, className }) => {
  return (
    <div
      className={classNames(
        className,
        `border border-[#f36c00] tracking-wide rounded-[5px] flex justify-center py-3 text-xl font-medium text-link-yellow-500 bg-transparent hover:bg-[#f2b566] hover:border-[#f2b566] transition-all duration-300 ease-in-out hover:cursor-pointer px-4`
      )}
    >
      <CustomLink link={link}>{link.text}</CustomLink>
    </div>
  )
}

export default CustomButtonLink
