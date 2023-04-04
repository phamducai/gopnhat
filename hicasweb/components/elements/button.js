import classNames from "classnames"
import PropTypes from "prop-types"
import { buttonLinkPropTypes } from "utils/types"
import Loader from "./loader"

const Button = ({
  button,
  appearance,
  compact = false,
  handleClick,
  loading = false,
  type,
  className,
}) => {
  return (
    <button onClick={handleClick} type={type}>
      <div
        className={classNames(
          // Common classes
          `${className} flex w-full text-[#FFFFFF] justify-center lg:w-auto text-center uppercase tracking-wide font-semibold text-base md:text-sm rounded-[19px]`,
          // Full-size button
          {
            "px-10 py-3 bg-[#F58220]": compact === false,
          },
          // Compact button
          {
            "px-4 py-2 bg-[#FFFFFF] border-[1px] border-[#F58220] text-[#F58220]":
              compact === true,
          },
          // Specific to when the button is fully dark
          {
            "bg-primary-600 text-white border-primary-600":
              appearance === "dark",
          },
          // Specific to when the button is dark outlines
          {
            "text-primary-600 border-primary-600":
              appearance === "dark-outline",
          },
          // Specific to when the button is fully white
          {
            "bg-white text-primary-600 border-white": appearance === "white",
          },
          // Specific to when the button is white outlines
          {
            "text-white border-white": appearance === "white-outline",
          }
        )}
      >
        {loading && <Loader />}
        {button.text}
      </div>
    </button>
  )
}

Button.propTypes = {
  button: buttonLinkPropTypes,
  appearance: PropTypes.oneOf([
    "dark",
    "white-outline",
    "white",
    "dark-outline",
  ]),
  compact: PropTypes.bool,
}

export default Button
