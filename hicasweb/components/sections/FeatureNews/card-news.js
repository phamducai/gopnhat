import Link from "next/link"
import { DoubleRightOutlined } from "@ant-design/icons"
import { getStrapiMedia } from "utils/media"
import { format, formatDistanceToNow } from "date-fns"
import { useWindowSize } from "utils/hooks"

const CardNews = ({ article }) => {
  const size = useWindowSize()
  return (
    <div className="w-full lg:flex md:flex justify-between gap-x-5 my-10">
      <div className="cursor-pointer">
        <div
          style={{
            height: size === "sm" ? "250px" : "150px",
            width: size === "sm" ? "350px" : "250px",
          }}
        >
          <Link href={`news/${article.attributes.slug}`}>
            <a>
              <img
                src={`${getStrapiMedia(
                  article.attributes.image?.data
                    ? article.attributes.image?.data.attributes.url
                    : ""
                )}`}
                className="rounded-lg h-full w-full"
              />
            </a>
          </Link>
        </div>
      </div>
      <div className={`sm:w-full ${size === "sm" ? "mt-5" : ""}`}>
        <Link href={`news/${article.attributes.slug}`}>
          <a>
            <h2 className="w-full text-[21px] text-[#f36c00] font-semibold hover:underline cursor-pointer">
              {article.attributes.title ?? ""}
            </h2>
          </a>
        </Link>
        <div className="flex items-center gap-x-2">
          <p className="text-[#333] text-[14px]">
            {format(
              new Date(article.attributes.createdAt ?? ""),
              "MMMM dd, yyyy"
            )}
            <span className="ml-2">&#8226;</span>
          </p>
          <p className="text-[#333] text-[14px]">
            {formatDistanceToNow(new Date(article.attributes.createdAt ?? ""), {
              addSuffix: true,
            })}
          </p>
        </div>
        <p className="text-[#333] text-[14px]">
          {article.attributes.announce ?? ""}
        </p>
      </div>
    </div>
  )
}

export default CardNews
