import SectionTitle from "@/components/elements/section-title"
import SectionWithBackGround from "@/components/elements/section-with-bg"
import Cards from "./feature-cards"

const FeaturesWithImages = ({ data }) => {
  const { headline, cards } = data
  return (
    <SectionWithBackGround sectionIndex={2}>
      <div className="flex justify-center items-center">
        <SectionTitle text={headline} />
      </div>
      <Cards cards={cards} />
    </SectionWithBackGround>
  )
}

export default FeaturesWithImages
