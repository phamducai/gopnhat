import ArrowIcon from "@/components/icons/arrow"
import React from "react"

const ListCategories = ({
  categories,
  handleClick,
  index,
  titleFilterOther,
}) => {
  return (
    <React.Fragment>
      <div
        className={`border-b border-[#e7e6e6] py-3 w-full flex gap-x-3 cursor-pointer ${
          !index ? "active-category-new" : ""
        }`}
        key={"all"}
        onClick={() => handleClick(undefined)}
      >
        <div className="mt-1 cursor-pointer">
          <ArrowIcon hexColor="#333" />
        </div>
        <label className="text-lg tracking-wide cursor-pointer">
          {titleFilterOther}
        </label>
      </div>
      {categories.map((category) => (
        <div
          className={`border-b border-[#e7e6e6] py-3 w-full flex gap-x-3 cursor-pointer ${
            index === category.id ? "active-category-new" : ""
          }`}
          key={category.id}
          onClick={() => handleClick(category.id)}
        >
          <div className="mt-1 cursor-pointer">
            <ArrowIcon hexColor="#333" />
          </div>
          <label
            value={category.id}
            className="text-lg tracking-wide cursor-pointer"
          >
            {category.attributes.title}
          </label>
        </div>
      ))}
    </React.Fragment>
  )
}
export default ListCategories
