import { Drawer } from "antd"
import { COLOR_PALETTE } from "common/const/color-palette"
import Link from "next/link"
import { useRouter } from "next/router"
import PropTypes from "prop-types"
import React, { useState } from "react"
import { BsArrowRight, BsChevronDown } from "react-icons/bs"
import { useFocus } from "utils/hooks"
import { linkPropTypes, mediaPropTypes } from "utils/types"
import CloseIcon from "../icons/close"
import SearchIcon from "../icons/search"
import LocaleSwitch from "../locale-switch"
import CustomButtonLink from "./custom-button-link"
import CustomLink from "./custom-link"
import NextImage from "./image"
import NotificationBanner from "./notification-banner"

const MobileNavMenu = ({ navbar, notificationBanner, pageContext }) => {
  const [showInputSearch, setShowInputSearch] = useState(false)
  const [bannerIsShown, setBannerIsShown] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const router = useRouter()
  const [searchRef, setInputFocus] = useFocus()

  const handleSearch = (e) => {
    e.preventDefault()
    const params = searchRef.current.value
    router.push(`/search?keywords=${params}`)
  }

  const handleButtonSearch = () => {
    setShowInputSearch(true)
    setInputFocus(true)
  }

  React.useEffect(() => {
    const sliptRouter = Object.keys(router.query)
    if (router.query.focus) {
      if (sliptRouter[0] === "focus") {
        document.getElementById(router.query.focus).scrollIntoView({
          top: 100,
          behavior: "smooth",
        })
      }
    }
  }, [router.asPath, router.query])
  const setScrollBar = (id, index) => {
    const sliptRouter = Object.keys(router.query)
    if (sliptRouter[0] === "focus" || router.asPath === "/") {
      document.getElementById(id).scrollIntoView({
        top: 100,
        behavior: "smooth",
      })
    } else {
      router.push({
        pathname: "/",
        query: { focus: id },
      })
    }
    setActiveIndex(index)
    setShowMenu(false)
  }
  return (
    <div className="sticky top-0 z-[100]">
      {bannerIsShown && notificationBanner.text && (
        <div className="w-full">
          <NotificationBanner
            data={notificationBanner}
            closeSelf={() => setBannerIsShown(false)}
          />
        </div>
      )}
      <div className="w-full h-auto bg-white shadow-lg">
        <nav
          className={`h-16 container flex justify-between items-center bg-white`}
        >
          <div
            className={`space-y-[0.4rem] cursor-pointer pencet ${
              showMenu && "Diam"
            }`}
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="w-7 h-0.5 bg-[#333]"></div>
            <div className="w-7 h-0.5 bg-[#333]"></div>
            <div className="w-7 h-0.5 bg-[#333]"></div>
          </div>
          <div className={`${showInputSearch ? "hidden" : "block"}`}>
            <Link href={"/"}>
              <div className={`flex justify-center cursor-pointer`}>
                <NextImage width={90} height={35} media={navbar.logo} />
              </div>
            </Link>
          </div>
          <button
            id="searchBtn"
            className={`w-7 cursor-pointer ${
              showInputSearch ? "hidden" : "block"
            }`}
            onClick={handleButtonSearch}
          >
            <SearchIcon hexColor={"#333"} />
          </button>
          <div
            className={`${
              showInputSearch ? "col-span-12 h-16 flex items-center" : "hidden"
            }`}
          >
            <form
              className="flex items-center w-full gap-x-3"
              onSubmit={handleSearch}
            >
              <div className="flex border-[1px] items-center p-2 rounded-lg">
                <input
                  ref={searchRef}
                  id="searchInput"
                  type="text"
                  className={`form-control w-full px-3 text-md align-middle font-normal text-gray-700 bg-white bg-clip-padding focus:outline-none `}
                  placeholder={navbar.searchPlaceholder}
                />
                <div className="w-7">
                  <SearchIcon hexColor={"#333"} />
                </div>
              </div>

              <div
                className={`Diam pencet space-y-2 cursor-pointer`}
                onClick={() => {
                  setShowInputSearch(false)
                  setInputFocus(false)
                }}
              >
                <CloseIcon color="#f36c00" />
              </div>
            </form>
          </div>
        </nav>
      </div>
      <Drawer
        title="Menu"
        className="custom-drawer-menu"
        placement={"left"}
        closable={true}
        onClose={() => setShowMenu(false)}
        visible={showMenu}
        key={"left"}
        style={{ top: "3.9rem" }}
        width="100%"
      >
        <ul className="container w-full menu-main-item px-5 navbar-mobile">
          {navbar.leftLinks.map((navLink) => (
            <li key={navLink.url} onClick={() => setShowMenu(false)}>
              <CustomLink link={navLink} locale={router.locale}>
                <button
                  className={`inline-block py-4 rounded-t-lg border-b-[0.2em] border-transparent !text-[15px] whitespace-nowrap uppercase`}
                >
                  {navLink.text}
                </button>
              </CustomLink>
            </li>
          ))}
          {navbar.dropdownLinks.map((item) => {
            const activeClass =
              activeIndex === item.id ? "active-drop-menu-mobile" : "max-h-0"
            const activeCollapseClass =
              activeIndex === item.id
                ? "active-collapse-menu"
                : "deactive-collapse-menu"
            return (
              <li
                key={item.id}
                className={`menu-items w-full ${activeCollapseClass}`}
              >
                <button
                  className={`w-full flex justify-between items-center py-4 !text-[15px] whitespace-nowrap peer`}
                  onClick={() => {
                    if (item.subMenuLinks.length === 0) {
                      setScrollBar(item.NameFocusSection, item.id)
                    } else {
                      if (activeIndex === item.id) {
                        setActiveIndex(-1)
                      } else {
                        setActiveIndex(item.id)
                      }
                    }
                  }}
                >
                  {item.text}
                  {item.subMenuLinks.length > 0 && (
                    <BsChevronDown
                      className="rotate-svg"
                      style={{ fontSize: "1rem" }}
                    />
                  )}
                </button>
                <ul
                  className={`px-5 overflow-hidden transition-all duration-200 ${activeClass}`}
                >
                  {item.subMenuLinks.map((items) => (
                    <li
                      key={items.id}
                      className={`menu-sub-item py-2`}
                      onClick={() => setShowMenu(false)}
                    >
                      <Link href={items.url}>
                        <div className="flex gap-x-6 items-center">
                          <div className="w-5/6">
                            <label
                              className={`whitespace-nowrap text-[15px] flex gap-x-3 relative ${
                                items.isArrow ? "font-semibold " : ""
                              }`}
                            >
                              {items.title}
                              {items.isArrow && (
                                <BsArrowRight
                                  style={{
                                    fontSize: "1.5rem",
                                    color: COLOR_PALETTE.orange,
                                  }}
                                />
                              )}
                            </label>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
          {navbar.links.map((navLink) => (
            <li key={navLink.url} onClick={() => setShowMenu(false)}>
              <CustomLink link={navLink} locale={router.locale}>
                <button
                  className={`w-full flex items-center py-3 !text-[15px] whitespace-nowrap`}
                >
                  {navLink.text}
                </button>
              </CustomLink>
            </li>
          ))}
          <div className="mt-5 border-t-[1px] pt-10">
            <LocaleSwitch pageContext={pageContext} isMoblie={true} />
          </div>
          <div className="flex justify-center mt-10">
            {navbar.button.map((item) => (
              <div key={item.id} className="w-full">
                {item.type === "secondary" ? (
                  <CustomButtonLink
                    link={item}
                    className="customer-color-button h-9 flex items-center whitespace-nowrap"
                  />
                ) : (
                  <CustomButtonLink
                    link={item}
                    className="!bg-[#f36c00] text-[1.2rem] color-button-link h-12 flex items-center custom-butom-header uppercase whitespace-nowrap customlink"
                  />
                )}
              </div>
            ))}
          </div>
        </ul>
      </Drawer>
    </div>
  )
}

MobileNavMenu.propTypes = {
  navbar: PropTypes.shape({
    logo: mediaPropTypes,
    links: PropTypes.arrayOf(linkPropTypes),
  }),
}

export default MobileNavMenu
