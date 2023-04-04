import { getStrapiMedia } from "utils/media"
const FeatureProvided = ({ data }) => {
  return (
    <div className="container">
      <p className="Font-Styles-Title-Global">{data.headline}</p>
      <div className="w-full flex items-center">
        <div
          className="w-3/4 m-auto feature-provided"
          style={{
            backgroundImage: `url(${getStrapiMedia(
              data.image.data.attributes.url
            )})`,
          }}
        >
          <div style={{ maxWidth: "400px", margin: "auto", marginTop: "75px" }}>
            <p
              style={{
                fontFamily: "Roboto,sans-serif",
                fontWeight: "bold",
                fontSize: "28px",
                lineHeight: "36px",
                textTransform: "uppercase",
                color: "#F58220",
                textAlign: "center",
                marginTop: "30px",
              }}
            >
              {data.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureProvided
