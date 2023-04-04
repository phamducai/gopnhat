import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import Link from "next/link"
import { useRouter } from "next/router"

import { mediaPropTypes, linkPropTypes, buttonLinkPropTypes } from "utils/types"

import NextImage from "./image"
import CustomLink from "./custom-link"
import "antd/dist/antd.css"
import CustomButtonLink from "./custom-button-link"
import NotificationBanner from "./notification-banner"
import CloseIcon from "../icons/close"
import LocaleSwitch from "../locale-switch"
import { useFocus } from "utils/hooks"
import SearchIcon from "../icons/search"

import { BsChevronDown } from "react-icons/bs"

const Navbar = ({ navbar, pageContext, notificationBanner }) => {
  const router = useRouter()
  const heightNavbar = "70px"
  const [showInputSearch, setShowInputSearch] = useState(false)
  const [bannerIsShown, setBannerIsShown] = useState(true)
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

  useEffect(() => {
    showInputSearch && document.querySelector("#searchInput").focus()
  }, [showInputSearch])

  useEffect(() => {
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
  const setScrollBar = (id) => {
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
  }
  return (
    <div className="sticky top-0 z-[100] h-auto">
      {/* The actual navbar */}
      {/* <nav className="w-full sticky top-0 z-99 p-2"> */}
      {bannerIsShown && notificationBanner.text && (
        <div className="w-full">
          <NotificationBanner
            data={notificationBanner}
            closeSelf={() => setBannerIsShown(false)}
          />
        </div>
      )}
      <nav
        className={`bg-white`}
        style={{
          height: heightNavbar,
          boxShadow: "0 0 10px 0 rgb(51 51 51 / 40%)",
        }}
      >
        <div className="container grid grid-cols-12 items-center">
          <div className={`col-span-1`}>
            <Link href={"/"}>
              <div className={`flex justify-start cursor-pointer`}>
                <NextImage width={100} height={46} media={navbar.logo} />
              </div>
            </Link>
          </div>
          <div
            className={`${
              showInputSearch
                ? "col-span-11 flex gap-x-3 justify-end items-center h-full"
                : "hidden"
            }`}
            style={{ height: heightNavbar }}
          >
            <form
              className="flex w-3/5 items-center justify-between border-[1px] border-[#C4C4C4] rounded-lg"
              onSubmit={handleSearch}
              style={{ boxSizing: "border-box", height: 50 }}
            >
              <input
                ref={searchRef}
                id="searchInput"
                type="text"
                className={`custom-italic-input form-control w-full px-3 py-1.5 text-lg align-middle font-normal text-gray-700 bg-white bg-clip-padding focus:outline-none `}
                placeholder={navbar.searchPlaceholder}
              />
              <button className="w-7 cursor-pointer mr-3" type="submit">
                <SearchIcon hexColor={"#333"} />
              </button>
            </form>
            <div
              className={`${
                showInputSearch ? "flex" : "hidden"
              } justify-end items-center`}
            >
              <div
                className={`Diam pencet space-y-2 cursor-pointer`}
                onClick={() => {
                  setShowInputSearch(false)
                  setInputFocus(false)
                }}
              >
                <CloseIcon color="#f36c00" />
              </div>
            </div>
          </div>
          {/* Content aligned to the left */}
          <div
            className={`${
              showInputSearch ? "hidden col-span-10" : "col-span-11"
            } flex justify-end items-center gap-x-5`}
          >
            <ul className="menu-main-item flex lg:gap-x-10 gap-x-3 relative mb-0">
              {navbar.leftLinks.map((item) => (
                <li key={item.id} className="menu-item">
                  <button
                    className="border-b-[0.2em] border-transparent hover:text-[#f36c00] hover:border-[#f36c00] uppercase whitespace-nowrap"
                    style={{
                      height: heightNavbar,
                      lineHeight: heightNavbar,
                    }}
                  >
                    {item.text}
                  </button>
                </li>
              ))}
              {navbar.dropdownLinks.map((item) => (
                <li key={item.id} className="menu-item">
                  <button
                    className="border-b-[0.2em] border-transparent hover:text-[#f36c00] hover:border-[#f36c00] uppercase whitespace-nowrap flex items-center gap-x-1"
                    style={{
                      height: heightNavbar,
                      lineHeight: heightNavbar,
                    }}
                    onClick={() => {
                      if (
                        item.subMenuLinks.length === 0 ||
                        item.NameFocusSection
                      ) {
                        setScrollBar(item.NameFocusSection)
                      }
                    }}
                  >
                    {item.text}
                    {item.subMenuLinks.length > 0 && (
                      <BsChevronDown style={{ fontSize: "0.8rem" }} />
                    )}
                  </button>
                  {item.subMenuLinks.length > 0 && (
                    <ul
                      className="px-7 py-6 h-auto drop-down drop-shadow-xl z-10  bg-white absolute"
                      aria-labelledby="dropdownDefault"
                      style={{
                        width: "15rem",
                        boxShadow: "inset 1px 6px 9px -6px #ADADAD",
                      }}
                    >
                      {item.subMenuLinks.map((items, index) => (
                        <li
                          key={items.id}
                          className={`menu-sub-item py-3 ${
                            item.subMenuLinks.length !== index + 1
                              ? "border-b-[1px]"
                              : ""
                          }`}
                        >
                          <Link href={items.url}>
                            <div className="flex gap-x-6 items-start">
                              {/* {items.subtitle !== "null" && !items.isArrow ? (
                                <NextImage
                                  width="48"
                                  height="48"
                                  media={items.icon}
                                  items.isParent ? "border-b-[1px] mb-4" : ""
                                />
                              ) : (
                                ""
                              )} */}
                              <div className="max-w-max">
                                <label
                                  className={`whitespace-nowrap text-lg relative ${
                                    items.isParent || items.isArrow
                                      ? "text-[#FB8020] font-semibold hover-arrow"
                                      : "hover-underline"
                                  }
                                    ${
                                      items.isArrow
                                        ? "font-semibold active-arrow hover-arrow"
                                        : ""
                                    }`}
                                >
                                  {items.title}
                                </label>
                                {/* <p className="mt-1 text-sm font-medium text-[#6b6b6b]">
                                  {items.subtitle === "null"
                                    ? ""
                                    : items.subtitle}
                                </p> */}
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              {navbar.links.map((navLink) => (
                <li key={navLink.url}>
                  <CustomLink link={navLink} locale={router.locale}>
                    <button
                      className="inline-block rounded-t-lg border-b-[0.2em] border-transparent hover:text-[#f36c00] hover:border-[#f36c00] uppercase"
                      style={{
                        height: heightNavbar,
                        lineHeight: heightNavbar,
                      }}
                    >
                      {navLink.text}
                    </button>
                  </CustomLink>
                </li>
              ))}
            </ul>
            <div>
              <div className="flex items-center gap-x-3 w-full ml-3">
                <button
                  id="searchBtn"
                  className="w-7 cursor-pointer"
                  onClick={handleButtonSearch}
                >
                  <SearchIcon hexColor={"#545454"} />
                </button>
                <label>|</label>
                <LocaleSwitch pageContext={pageContext} />

                {navbar.button.map((item) => (
                  <div key={item.id} className="w-28">
                    {item.type === "secondary" ? (
                      <CustomButtonLink
                        link={item}
                        className="customer-color-button h-9 flex items-center whitespace-nowrap"
                      />
                    ) : (
                      <CustomButtonLink
                        link={item}
                        className="bg-[#f36c00] text-[1rem] color-button-link h-9 flex items-center custom-butom-header uppercase"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

Navbar.propTypes = {
  navbar: PropTypes.shape({
    logo: PropTypes.shape({
      image: mediaPropTypes,
      url: PropTypes.string,
    }),
    links: PropTypes.arrayOf(linkPropTypes),
  }),
  initialLocale: PropTypes.string,
}
export default Navbar
