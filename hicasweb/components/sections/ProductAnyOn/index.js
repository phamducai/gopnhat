import SectionTitle from "@/components/elements/section-title"
import React from "react"

const ProductAnyOn = ({ data }) => {
  return (
    <div className="flex justify-center items-center">
      <SectionTitle text={data.featureColumnsTitle} />
    </div>
  )
}

export default ProductAnyOn
