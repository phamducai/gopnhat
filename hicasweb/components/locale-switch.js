import { Dropdown, Menu } from "antd"
import { useRouter } from "next/router"
import PropTypes from "prop-types"
import React, { useRef, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { FlagEn, FlagVi } from "./icons/flag"

const LocaleSwitch = ({ pageContext, isMoblie = false }) => {
  const isMounted = useRef(false)
  const select = useRef()
  const router = useRouter()
  const [locale, setLocale] = useState(router.locale)
  const [showMenu, setShowMenu] = useState(false)

  const handleLocaleChange = async (locale) => {
    localStorage.setItem("NEXT_LOCALE", locale)
    setLocale(locale)
    router.push("/", "/", { locale })
  }
  const menu = (
    <Menu>
      <Menu.Item key={"drop1"}>
        <div className="flex gap-x-5" onClick={() => handleLocaleChange("vi")}>
          <FlagVi /> {locale === "vi" ? "Tiếng Việt" : "Vietnamese"}
        </div>
      </Menu.Item>
      <Menu.Item key={"drop2"} className="border-t-[1px]">
        <div className="flex gap-x-5" onClick={() => handleLocaleChange("en")}>
          <FlagEn /> {locale === "en" ? "English" : "Tiếng Anh"}
        </div>
      </Menu.Item>
    </Menu>
  )
  return (
    <div ref={select}>
      <div className="flex flex-row gap-x-2 mt-[0.1rem]">
        {/* {pageContext.localizedPaths &&
          pageContext.localizedPaths.map(({ href, locale }, index) => {
            return (
          })} */}
        {!isMoblie ? (
          <Dropdown overlay={menu} placement="bottomCenter" trigger={["click"]}>
            <span
              className={`${
                isMoblie && "w-full text-[15px] text-[#3d5067] font-semibold"
              } cursor-pointer flex gap-x-2 items-center`}
            >
              <React.Fragment>
                {locale === "vi" && "VI"}
                {locale === "en" && "EN"}
                <BsChevronDown style={{ fontSize: "0.8rem" }} />
              </React.Fragment>
            </span>
          </Dropdown>
        ) : (
          <div
            className="bg-white w-full"
            onClick={() => setShowMenu(!showMenu)}
          >
            {locale === "vi" && (
              <button
                className={`${
                  showMenu ? "active-collapse-menu" : "deactive-collapse-menu"
                } w-full flex justify-between items-center !text-[15px] whitespace-nowrap`}
              >
                {"Tiếng Việt"}
                <BsChevronDown
                  className="rotate-svg"
                  style={{ fontSize: "1rem" }}
                />
              </button>
            )}
            {locale === "en" && (
              <button
                className={`${
                  showMenu ? "active-collapse-menu" : "deactive-collapse-menu"
                } w-full flex justify-between items-center !text-[15px] whitespace-nowrap`}
              >
                {"English"}
                <BsChevronDown
                  className="rotate-svg"
                  style={{ fontSize: "1rem" }}
                />
              </button>
            )}
            <ul
              className={`mt-3 overflow-hidden transition-all duration-200 ${
                showMenu ? " active-drop-menu-mobile" : "max-h-0 "
              }`}
            >
              <li className="menu-sub-item py-2">
                <label
                  className={`whitespace-nowrap text-[15px] flex gap-x-3 relative`}
                >
                  <div
                    className="flex gap-x-5"
                    onClick={() => handleLocaleChange("vi")}
                  >
                    <FlagVi /> {locale === "vi" ? "Tiếng Việt" : "Vietnamese"}
                  </div>
                </label>
              </li>
              <li className="menu-sub-item py-2">
                <label
                  className={`whitespace-nowrap text-[15px] flex gap-x-3 relative`}
                >
                  <div
                    className="flex gap-x-5"
                    onClick={() => handleLocaleChange("en")}
                  >
                    <FlagEn /> {locale === "en" ? "English" : "Tiếng Anh"}
                  </div>
                </label>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

LocaleSwitch.propTypes = {
  initialLocale: PropTypes.string,
}

export default LocaleSwitch
