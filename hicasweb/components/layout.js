import Navbar from "./elements/navbar"
import Footer from "./elements/footer"
import { useWindowSize } from "utils/hooks"
import MobileNavMenu from "./elements/mobile-nav-menu"
import LoadingComponent from "./loading"
import React from "react"
export const MenuContextACB = React.createContext()

const Layout = ({ children, global, pageContext }) => {
  const { navbar, footer, notificationBanner } = global.attributes
  const mappingData = () => {
    const arrayTemp = []
    navbar.leftLinks.forEach((item) => {
      arrayTemp.push({
        slug: item.url,
        alias: item.text,
      })
    })
    navbar.dropdownLinks.forEach((parentMenu) => {
      parentMenu.subMenuLinks.forEach((item) => {
        arrayTemp.push({
          slug: item.url,
          alias: item.title,
        })
      })
    })
    navbar.links.forEach((item) => {
      arrayTemp.push({
        slug: item.url,
        alias: item.text,
      })
    })
    return arrayTemp
  }
  const listMenu = mappingData()
  const size = useWindowSize()
  return (
    <MenuContextACB.Provider value={{ listMenu }}>
      <LoadingComponent visible={size ? false : true}>
        <div className="flex flex-col justify-between min-h-screen">
          {/* Aligned to the top */}
          <div className="flex-1">
            {size === "sm" || size === "md" ? (
              <MobileNavMenu
                navbar={navbar}
                notificationBanner={
                  notificationBanner ?? { data: { text: "", type: "info" } }
                }
              />
            ) : (
              <Navbar
                navbar={navbar}
                pageContext={pageContext}
                notificationBanner={
                  notificationBanner ?? { data: { text: "", type: "info" } }
                }
              />
            )}
            {children}
          </div>
          {/* Aligned to the bottom */}
          <Footer footer={footer} />
        </div>
      </LoadingComponent>
    </MenuContextACB.Provider>
  )
}

export default Layout
