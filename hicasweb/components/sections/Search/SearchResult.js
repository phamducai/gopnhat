import React, { useRef } from "react"
import { SearchOutlined } from "@ant-design/icons"
import { Form, Input, Modal, Skeleton } from "antd"
import { useRouter } from "next/router"
import { placeHolderTyping, useWindowSize } from "utils/hooks"
import CardNews from "../FeatureNews/card-news"
import ListCategories from "../FeatureNews/list-category"
import { fetchAPI } from "utils/api"
import Button from "@/components/elements/button"

function SearchResult({ data }) {
  const { search } = data
  const size = useWindowSize()
  const router = useRouter()
  const inputRef = useRef()

  const [infoPage, setInfoPage] = React.useState({
    page: 1,
    pageSize: search.articlesPerPage,
    pageCount: 0,
    total: 0,
  })
  const [articles, setArticles] = React.useState([])
  const [categories, setCategories] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [activeMenu, setActiveMenu] = React.useState()

  const fetchCategoryData = async (locale) => {
    setIsLoading(true)
    const localeCategories = await fetchAPI("/categories", {
      locale,
      fields: ["title"],
      sort: ["updatedAt:desc"],
    })
    if (localeCategories.data) {
      setCategories(localeCategories.data)
      const query = JSON.parse(decodeURIComponent(JSON.stringify(router.query)))
      if (query.category) {
        setActiveMenu(
          localeCategories.data.find(
            (x) => x.attributes.title === query.category
          ).id
        )
      }
    }
    setIsLoading(false)
  }
  const searchArticle = async (keywords, page, isLoadMore = false) => {
    setIsLoading(true)
    const articlesRes = await fetchAPI("/articles", {
      locale: router.locale,
      fields: ["title", "announce", "slug", "createdAt"],
      filters: {
        $and: [
          {
            title: {
              $containsi: keywords,
            },
          },
          {
            category: {
              id: {
                $eq: activeMenu,
              },
            },
          },
        ],
      },
      populate: ["image", "category"],
      pagination: { pageSize: search.articlesPerPage, page },
      sort: ["createdAt:desc"],
    })
    if (articlesRes.data) {
      isLoadMore
        ? setArticles((prevState) => [...prevState, ...articlesRes.data])
        : setArticles(articlesRes.data)
      setInfoPage(articlesRes.meta.pagination)
    }
    setIsLoading(false)
  }
  const handleSearch = (e) => {
    e.preventDefault()
    const category = categories.find((x) => x.id === activeMenu)
    router.push(
      `/search?keywords=${inputRef.current.input.value}${
        activeMenu && category ? `&category=${category.attributes.title}` : ""
      }`
    )
  }

  const onChange = async (checkedValues) => {
    setActiveMenu(checkedValues)
    setIsLoading(true)
    const category = categories.find((x) => x.id === checkedValues)
    router.push(
      `/search?keywords=${inputRef.current.input.value ?? ""}${
        checkedValues && category
          ? `&category=${category.attributes.title}`
          : ""
      }`
    )
    setIsLoading(false)
    setIsModalVisible(false)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  React.useEffect(() => {
    inputRef && placeHolderTyping(search.listPlaceholder, inputRef)
  }, [inputRef, search.listPlaceholder])

  React.useEffect(() => {
    fetchCategoryData(router.locale)

    searchArticle(router.query.keywords, infoPage.page)
    //eslint-disable-next-line
  }, [router])
  console.log(search.listPlaceholder)
  return (
    <div className="carousel-container mb-44">
      <div className="search-banner relative overflow-hidden px-4 py-14">
        <div className="container flex justify-center items-center">
          <form className="w-1/2" onSubmit={handleSearch}>
            <Input
              prefix={<SearchOutlined />}
              ref={inputRef}
              id="searchInput"
              className={`h-10 px-3 py-4 z-50 text-xl align-middle font-normal text-gray-700 bg-white focus:outline-none `}
            />
          </form>
        </div>
        <svg
          width="1920"
          height="109"
          viewBox="0 0 1920 109"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="sc-icon swoosh"
        >
          <path
            fill="#FFF"
            d="M1749.36 3.89457C1859.3 14.9501 1920 7.62939e-06 1920 7.62939e-06V109L0 109V52.2936C163.532 89.3273 208.775 34.7703 462.536 61.2876C963.857 113.674 1241.83 78.6302 1424.05 42.9417C1554.15 17.4607 1624.54 -8.65801 1749.36 3.89457Z"
          ></path>
        </svg>
      </div>
      <div className="container">
        <div className="w-full grid grid-cols-12">
          {size !== "sm" && (
            <>
              <div className="col-span-3 flex flex-col items-start">
                <h2 className="font-semibold text-[21px] text-[#333] pb-1">
                  {data.search.titleCategoryFilter}
                </h2>
                <Form className="w-full">
                  <ListCategories
                    categories={categories}
                    handleClick={onChange}
                    index={activeMenu}
                    titleFilterOther={data.search.titleAllCategory}
                  />
                </Form>
              </div>
            </>
          )}
          <div className="col-span-12 lg:col-span-9">
            <Skeleton loading={isLoading} active avatar>
              {articles &&
                articles.map((article, index) => (
                  <CardNews key={article.id + "cn" + index} article={article} />
                ))}
            </Skeleton>
          </div>
          {size === "sm" && (
            <div className="fixed right-0 bottom-1">
              <Button
                button={{ text: "Filter" }}
                appearance="white"
                compact={true}
                handleClick={showModal}
              />
            </div>
          )}
          <div className="col-span-12 flex justify-center">
            <div className="w-72 h-auto">
              <div className="flex justify-center">
                {infoPage.page < infoPage.pageCount && (
                  <Button
                    button={{ text: "Load More" }}
                    appearance="white"
                    loading={isLoading}
                    compact={false}
                    handleClick={() => {
                      const query = JSON.parse(
                        decodeURIComponent(JSON.stringify(router.query))
                      )

                      searchArticle(query.keywords, infoPage + 1, true)
                    }}
                  />
                )}
              </div>
              <p className="text-center py-2">{`Showing ${
                articles && articles.length
              } of ${infoPage.total} posts`}</p>
            </div>
          </div>
        </div>
      </div>
      {isModalVisible && (
        <Modal
          title={<h2 className="font-semibold text-[#f36c00]">Filter</h2>}
          visible={isModalVisible}
          onCancel={handleCancel}
          width={"80%"}
          footer={false}
        >
          <div className="h-[40vh] overflow-scroll">
            <ListCategories
              categories={categories}
              handleClick={onChange}
              index={activeMenu}
            />
          </div>
        </Modal>
      )}
    </div>
  )
}

export default SearchResult
