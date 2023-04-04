/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Modal } from "antd"
import Button from "components/elements/button"
import { useRouter } from "next/router"
import React from "react"
import { fetchAPI } from "utils/api"
import { useWindowSize } from "utils/hooks"
import CardNews from "./card-news"
import ListCategories from "./list-category"

const FeatureNews = ({ data }) => {
  const router = useRouter()
  const { articlesPerPage, title } = data
  const size = useWindowSize()
  const [infoPage, setInfoPage] = React.useState({
    page: 1,
    pageSize: articlesPerPage,
    pageCount: 0,
    total: 0,
  })
  const [articles, setArticles] = React.useState([])
  const [categories, setCategories] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [activeMenu, setActiveMenu] = React.useState()

  const fetchArticleByCategoryData = async (
    pageSize,
    page,
    locale,
    isLoadMore = false
  ) => {
    setIsLoading(true)
    const localeArticles = await fetchAPI("/articles", {
      locale,
      fields: ["title", "announce", "slug", "createdAt"],
      filters: {
        category: {
          id: {
            $eq: activeMenu,
          },
        },
      },
      populate: ["image", "category"],
      pagination: { pageSize, page },
      sort: ["createdAt:desc"],
    })
    if (localeArticles.data) {
      isLoadMore
        ? setArticles((prevState) => [...prevState, ...localeArticles.data])
        : setArticles(localeArticles.data)
      setInfoPage(localeArticles.meta.pagination)
    }
    setIsLoading(false)
  }

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

  const onChange = async (checkedValue) => {
    setActiveMenu(checkedValue)
    setIsLoading(true)
    const category = categories.find((x) => x.id === checkedValue)
    router.push(
      `/news?page=1${
        checkedValue && category ? `&category=${category.attributes.title}` : ""
      }`
    )

    setIsModalVisible(false)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  React.useEffect(() => {
    fetchCategoryData(router.locale)

    fetchArticleByCategoryData(infoPage.pageSize, infoPage.page, router.locale)
  }, [router])

  return (
    <div className="container pb-16 md:pb-28 xl:pb-40">
      <div className="grid grid-cols-10 pt-5 gap-x-5">
        <div className="lg:col-span-7 col-span-10">
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
                titleFilterOther={data.titleFilterOther}
              />
            </div>
          </Modal>
          <div>
            <div className="w-full border-b flex flex-row justify-between">
              <h2 className="font-semibold text-[21px] text-[#333] pb-1">
                {title}
              </h2>
              {size === "sm" && (
                <Button
                  button={{ text: "Filter" }}
                  appearance="white"
                  compact={true}
                  handleClick={showModal}
                />
              )}
            </div>
            {articles &&
              articles.map((article, index) => (
                <CardNews key={article.id + "cn" + index} article={article} />
              ))}
            <div className="w-full flex justify-center">
              <div className="w-72 h-auto">
                <div className="flex justify-center">
                  {infoPage.page < infoPage.pageCount && (
                    <Button
                      button={{
                        text: router.locale === "vi" ? "Xem thêm" : "Load More",
                      }}
                      appearance="white"
                      loading={isLoading}
                      compact={false}
                      handleClick={() => {
                        fetchArticleByCategoryData(
                          infoPage.pageSize,
                          infoPage.page + 1,
                          router.locale,
                          true
                        )
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
        {size !== "sm" && (
          <div className="col-span-3 flex flex-col items-start">
            <h2 className="font-semibold text-[21px] text-[#333] pb-1">
              {data.titleCategory}
            </h2>

            <Form className="w-full">
              <ListCategories
                categories={categories}
                handleClick={onChange}
                index={activeMenu}
                titleFilterOther={data.titleFilterOther}
              />
            </Form>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeatureNews
