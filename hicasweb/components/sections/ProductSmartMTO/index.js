import SectionTitle from "@/components/elements/section-title"

const ProductSmartMTO = ({ data }) => {
  return (
    <div className="flex justify-center items-center">
      <SectionTitle text={data.featureColumnsTitle} />
    </div>
  )
}

export default ProductSmartMTO
