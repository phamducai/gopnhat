import PropTypes from "prop-types"
import { getStrapiURL } from "utils/api"
const RichText = ({ data }) => {
  return (
    <div
      className="container text-lg pt-4 pb-8 md:pb-16 xl:pb-32"
      style={{
        margin: "auto",
      }}
    >
      <div
        className="my-6 ck-content"
        dangerouslySetInnerHTML={{
          __html: data.content.replace(
            new RegExp("/uploads", "g"),
            `${getStrapiURL("/uploads")}`
          ),
        }}
      />
    </div>
  )
}

RichText.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string,
  }),
}

export default RichText
