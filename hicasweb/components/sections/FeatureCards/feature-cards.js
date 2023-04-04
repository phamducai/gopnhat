import NextImage from "@/components/elements/image"
import { COLOR_PALETTE } from "common/const/color-palette"

const Cards = ({ cards }) => {
  return (
    <div className="container grid grid-cols-2 gap-4 mb-5 ">
      {cards &&
        cards.map((item, index) => (
          <div
            key={`feature-${index}`}
            className="lg:col-span-1 col-span-2 items-center shadow-sm rounded-[11px] gap-y-4 bg-[#F9F8F8]"
          >
            <div className="flex flex-col">
              {item.image.data && <NextImage media={item.image} />}
              <div className="py-8 md:px-20 px-2">
                <label
                  className="text-[30px] flex justify-center mb-3 font-normal"
                  style={{ color: COLOR_PALETTE.orange }}
                >
                  {item.title}
                </label>
                <div
                  className="h-full w-full ck-content flex-0"
                  dangerouslySetInnerHTML={{
                    __html: item.description,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Cards
