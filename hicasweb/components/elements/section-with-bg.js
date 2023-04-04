import { COLOR_PALETTE } from "common/const/color-palette"

const SectionWithBackGround = ({
  sectionIndex,
  className,
  children,
  ...rest
}) => {
  const backgroundColor =
    sectionIndex % 2 === 0 ? COLOR_PALETTE.grayWhite : "white"
  return (
    <div {...rest} className={`${className} bg-[${backgroundColor}]`}>
      {children}
    </div>
  )
}

export default SectionWithBackGround
