import { getStrapiMedia } from "utils/media"
const FeatureWithBackgroundImage = ({ data }) => {
  return (
    <div className="px-3">
      <div
        className="flex flex-col items-center feature-backgound"
        style={{
          backgroundImage: `url(${getStrapiMedia(
            data.image.data.attributes.url
          )})`,
        }}
      >
        <div
          className="Font-Styles-Title-Global"
          style={{ backgroundColor: "#FFFFFF", padding: "15px" }}
        >
          {data.title}
        </div>
        <div className="my-6 mx-auto" style={{ color: "#FFFFFF" }}>
          {data.announce}
        </div>
      </div>
    </div>
  )
}

export default FeatureWithBackgroundImage
