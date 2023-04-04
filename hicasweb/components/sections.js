import { useRouter } from "next/router"

import Hero from "@/components/sections/hero"
import LargeVideo from "@/components/sections/large-video"
import FeatureColumnsGroup from "@/components/sections/feature-columns-group"
import FeatureRowsGroup from "@/components/sections/feature-rows-group"
import BottomActions from "@/components/sections/bottom-actions"
import TestimonialsGroup from "@/components/sections/testimonials-group"

import RichText from "./sections/rich-text"
import Pricing from "./sections/pricing"
import LeadForm from "./sections/lead-form"
import BannerSilder from "./sections/banner-slider"
import FeatureCards from "./sections/FeatureCards"
import ContactForm from "./sections/contact-form"
import FeatureNews from "./sections/FeatureNews"
import FeatureWithBackgroundImage from "./sections/feature-with-background-image"
import ProfileCards from "./sections/ProfileCard"
import TrialsRegister from "./sections/trials-register"
import FeatureProvided from "./sections/FeatureProvided"
import OnDemandSoftware from "./sections/OnDemandSoftware"
import ProvidedLinks from "./sections/ProvidedLinks"
import SectionIntroduction from "./sections/SectionIntroduction"
import HomeNews from "./sections/home-news"
import FlatCardGroup from "./sections/flat-card-group"
import SectionLogoClouds from "./sections/logo-clouds"
import AdvantagesRow from "./sections/advantages-row"
import BannerSilderCustom from "./sections/banner-slider-custom"
import SearchResult from "./sections/Search/SearchResult"
import TechCards from "./sections/tech-cards"
import ScrollButton from "./scrollButton"
import SectionWithBackGround from "./elements/section-with-bg"

// Map Strapi sections to section components
const sectionComponents = {
  ComponentSectionsHero: Hero,
  ComponentSectionsLargeVideo: LargeVideo,
  ComponentSectionsFeatureColumnsGroup: FeatureColumnsGroup,
  ComponentSectionsFeatureRowsGroup: FeatureRowsGroup,
  ComponentSectionsBottomActions: BottomActions,
  ComponentSectionsTestimonialsGroup: TestimonialsGroup,
  ComponentSectionsRichText: RichText,
  ComponentSectionsPricing: Pricing,
  ComponentSectionsLeadForm: LeadForm,
  // cần làm thêm css cho các section sau
  ComponentSectionsBannerSlider: BannerSilder, //có thể demo
  ComponentSectionsFeatureCards: FeatureCards, //
  ComponentSectionsContactForm: ContactForm, //có thể demo
  ComponentSectionsNews: FeatureNews, //có thể demo
  ComponentSectionsFeatureWithBackgroundImage: FeatureWithBackgroundImage, //có thể demo
  ComponentSectionsProfileCard: ProfileCards, //có thể demo
  ComponentSectionsTrialsRegister: TrialsRegister, //có thể demo
  ComponentSectionsFeatureProvided: FeatureProvided, //có thể demo
  ComponentSectionsOnDemandSoftware: OnDemandSoftware, //có thể demo
  ComponentSectionsProvidedLinks: ProvidedLinks, //có thể demo
  //   ComponentSectionsProductAnyOn: ProductAnyOn,
  //   ComponentSectionsProductSmartMto: ProductSmartMTO,
  // ComponentSectionsProductViThep: ProductViThep,
  //   ComponentSectionsProductTingConnect: ProductTingConnect,
  ComponentSectionsProductIntroduction: SectionIntroduction,
  ComponentSectionsStackedLayout: HomeNews,
  ComponentSectionsLogoClouds: SectionLogoClouds,
  ComponentSectionsAdvantagesRow: AdvantagesRow,
  ComponentSectionsFlatCardGroup: FlatCardGroup,
  ComponentSectionsBannerSliderCustom: BannerSilderCustom,
  ComponentSectionsSearchResultSection: SearchResult,
  ComponentSectionsTechCards: TechCards,
}

// Display a section individually
const Section = ({ sectionData }) => {
  // Prepare the component
  const SectionComponent = sectionComponents[sectionData.__typename]

  if (!SectionComponent) {
    return null
  }

  // Display the section
  return <SectionComponent data={sectionData} />
}

const PreviewModeBanner = () => {
  const router = useRouter()
  const exitURL = `/api/exit-preview?redirect=${encodeURIComponent(
    router.asPath
  )}`

  return (
    <div className="py-4 bg-red-600 text-red-100 font-semibold uppercase tracking-wide">
      <div className="container">
        Preview mode is on.{" "}
        <a
          className="underline"
          href={`/api/exit-preview?redirect=${router.asPath}`}
        >
          Turn off
        </a>
      </div>
    </div>
  )
}

// Display the list of sections
const Sections = ({ sections, preview }) => {
  return (
    <div className="flex flex-col">
      {/* Show a banner if preview mode is on */}
      {preview && <PreviewModeBanner />}
      {/* Show the actual sections */}
      {sections.map((section) => (
        <Section
          sectionData={section}
          key={`${section.__typename}${section.id}`}
        />
      ))}
      <ScrollButton />
    </div>
  )
}

export default Sections
