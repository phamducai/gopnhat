import Link from "next/link"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { MenuContextACB } from "../layout"

const BreadCrumb = () => {
  const locale = localStorage.getItem("NEXT_LOCALE")
  const { listMenu } = React.useContext(MenuContextACB)
  const router = useRouter()
  const [breadCrumbNav, setBreadCrumbNav] = useState([])
  React.useEffect(() => {
    const handleBreadCrumbMenu = () => {
      const listCrumb = [
        {
          href: "/",
          text: locale === "vi" ? "Trang chủ" : "Home",
        },
      ]
      listMenu.forEach((item) => {
        if (router.asPath === item.slug) {
          listCrumb.push({
            href: null,
            text: item.alias,
          })
        }
      })
      setBreadCrumbNav(listCrumb)
    }
    handleBreadCrumbMenu()
  }, [listMenu, locale, router.asPath])
  return (
    <div className="text-white flex justify-center gap-x-1">
      {breadCrumbNav.map((item, index) => (
        <div key={index}>
          {item.href ? (
            <Link href={item.href}>
              <a className="text-white text-[16px] hover:text-white hover:underline">
                {item.text}
              </a>
            </Link>
          ) : (
            <div className="text-[16px]">/ {item.text}</div>
          )}
        </div>
      ))}
    </div>
  )
}
export default BreadCrumb
