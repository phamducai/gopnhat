import Link from "next/link"
import PropTypes from "prop-types"
import { linkPropTypes } from "utils/types"
import NextImage from "./image"

const IconLink = ({ link }) => {
  const isInternalLink = link.url.startsWith("/")

  // For internal links, use the Next.js Link component
  if (isInternalLink) {
    return (
      <Link href={link.url}>
        <a className="tracking-wide">
          <NextImage media={link.icon} />
        </a>
      </Link>
    )
  }

  // Plain <a> tags for external links
  if (link.newTab) {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        <NextImage media={link.icon} />
      </a>
    )
  }

  return (
    <a href={link.url} target="_self">
      <NextImage media={link.icon} />
    </a>
  )
}

IconLink.propTypes = {
  link: linkPropTypes,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

export default IconLink
