import { getStrapiMedia } from "utils/media"
import Image from "next/image"
import PropTypes from "prop-types"
import { mediaPropTypes } from "utils/types"

const NextImage = ({ media, ...props }) => {
  if (media === null || media.data === null) return <></>
  const { url, alternativeText, width, height, mime } = media.data.attributes
  const layout = mime === "image/svg+xml" ? "fill" : "intrinsic"
  const loader = ({ src, width, quality }) => {
    const url = getStrapiMedia(src)
    return `${url}?w=${width}&q=${quality || 75}`
  }

  // The image has a fixed width and height
  if (props.width && props.height) {
    return (
      <Image
        loader={loader}
        src={url}
        alt={alternativeText || ""}
        width={props.width}
        height={props.height}
        {...props}
      />
    )
  }
  // The image is responsive
  return (
    <Image
      loader={loader}
      layout={layout}
      width={width}
      height={height}
      objectFit="contain"
      src={url}
      alt={alternativeText || ""}
      {...props}
    />
  )
}

Image.propTypes = {
  // media: mediaPropTypes.isRequired,
  className: PropTypes.string,
}

export default NextImage
