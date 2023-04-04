import { getStrapiMedia } from "utils/media"
const OnDemandSoftware = ({ data }) => {
  return (
    <div className="container">
      <p
        style={{
          fontFamily: "Roboto,sans-serif",
          fontWeight: "bold",
          fontSize: "24px",
          lineHeight: "33px",
          textTransform: "uppercase",
          color: "#F58220",
          textAlign: "center",
          marginTop: "18px",
        }}
      >
        {data.title}
      </p>
      <div className="max-w-screen-xl m-auto px-5 my-10 grid grid-cols-2 gap-2 md:grid-cols-4 ">
        {data.productCards.map((pc) => (
          <div key={pc.id} className="flex items-center flex-col">
            <img
              src={`${getStrapiMedia(pc.image.data.attributes.url)}`}
              style={{ width: "204px", height: "200px" }}
            />
            <p className="text-center text-[#707070] font-sans text-base font-medium">
              {pc.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OnDemandSoftware
