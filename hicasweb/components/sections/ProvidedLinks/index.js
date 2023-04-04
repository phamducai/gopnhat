import { getStrapiMedia } from "utils/media"
import Link from "next/link"

const ProvidedLinks = ({ data }) => {
  return (
    <div
      className="hidden md:block scrollbar scrollbar-thumb-red-500 scrollbar-track-gray-200"
      style={{
        backgroundColor: "#F2F2F2",
      }}
    >
      <div
        className="flex flex-row h-24 "
        style={{
          backgroundColor: "#F2F2F2",
          width: "1200px",
          height: "420px",
          margin: "auto",
        }}
      >
        <div style={{ marginRight: "-30px" }}>
          <Link href="/product/anyon">
            <div
              style={{ marginTop: "50px", cursor: "pointer" }}
              className="cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
            >
              <img
                src={`${getStrapiMedia(
                  data.links[0].icon.data.attributes.url
                )}`}
              />

              <div style={{ marginTop: "-68px", paddingLeft: "80px" }}>
                <p className="text-lg font-medium text-white">
                  {data.links[0].text}
                </p>
              </div>
            </div>
          </Link>

          <Link href="/product/smartmto">
            <div
              style={{ marginTop: "125px", cursor: "pointer" }}
              className="cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
            >
              <img
                src={`${getStrapiMedia(
                  data.links[1].icon.data.attributes.url
                )}`}
              />

              <div style={{ marginTop: "-74px", paddingLeft: "60px" }}>
                <p className="text-lg font-medium text-white">
                  {data.links[1].text}
                </p>
              </div>
            </div>
          </Link>
        </div>
        {/* center */}
        <div className="flex items-center flex-col w-full">
          <div style={{ marginRight: "50px" }}>
            <img
              src="https://res.cloudinary.com/hiname/image/upload/v1641374844/4_boeezq.png"
              className="w-4/5 m-auto"
            />
            <div style={{ margin: "auto", width: "200px" }}>
              <p
                style={{
                  marginTop: "-270px",
                  fontFamily: "Roboto,sans-serif",
                  fontWeight: "bold",
                  fontSize: "21px",
                  textAlign: "center",
                  lineHeight: "28px",
                  textTransform: "uppercase",
                  color: "#FFFFFF",
                }}
              >
                {data.title}
              </p>
            </div>
          </div>
          <div style={{ marginTop: "-210px" }}>
            <img
              src="https://res.cloudinary.com/hiname/image/upload/v1641374843/3_oa8oi5.png"
              className="w-full"
            />
          </div>
        </div>
        {/* right */}
        <div style={{ marginLeft: "-65px" }}>
          <Link href="/product/ting">
            <div
              style={{
                marginTop: "45px",
                cursor: "pointer",
              }}
              className="cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
            >
              <img
                src={`${getStrapiMedia(
                  data.links[2].icon.data.attributes.url
                )}`}
              />

              <div style={{ marginTop: "-74px", marginLeft: "150px" }}>
                <p className="text-lg font-medium text-white">
                  {data.links[2].text}
                </p>
              </div>
            </div>
          </Link>
          <Link href="/product/vithep">
            <div
              style={{ marginTop: "120px", cursor: "pointer" }}
              className="cursor-pointer transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
            >
              <img
                src={`${getStrapiMedia(
                  data.links[3].icon.data.attributes.url
                )}`}
              />

              <div style={{ marginTop: "-72px", marginLeft: "170px" }}>
                <p className="text-lg font-medium text-white">
                  {data.links[3].text}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProvidedLinks
