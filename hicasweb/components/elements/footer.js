/* eslint-disable prettier/prettier */
import { Button, Form, Input } from "antd"
import openNotification, {
  NotificationStatus,
} from "common/notification/CNotification"
import Link from "next/link"
import PropTypes from "prop-types"
import { useState } from "react"
import { fetchAPI } from "utils/api"
import { linkPropTypes, mediaPropTypes } from "utils/types"
import NextImage from "./image"

const Footer = ({ footer }) => {
  const [loading, setLoading] = useState(false)

  const onSubmitform = async (value) => {
    setLoading(true)
    try {
      //   setErrors({ api: null })
      const data = {
        data: {
          email: value.email,
          status: "contacted",
          location: "VN",
        },
      }
      const res = await fetchAPI(
        "/lead-form-submissions",
        {},
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      )
      res.data
        ? openNotification(
            NotificationStatus.Success,
            "Thành công",
            "Gửi email thành công"
          )
        : openNotification(
            NotificationStatus.Error,
            "Thất bại",
            "Gửi email không thành công"
          )
    } catch (err) {
      //   setErrors({ api: err.message })
      console.log(err)
      setLoading(false)
      openNotification(
        NotificationStatus.Error,
        "Thất bại",
        "Gửi email không thành công"
      )
    }
    setLoading(false)
  }
  return (
    <footer className="bg-[#EBEBEB] pt-8" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="">
        <div className="container grid grid-cols-12">
          <div className="col-span-12 pr-0 md:col-span-4 lg:col-span-6 xl:col-span-3">
            <div className="block text-center md:text-left mb-8">
              <div>
                <NextImage media={footer.logo} width={120} height={50} />
              </div>
              <div className="font-semibold text-lg max-w-none md:max-w-[200px]">
                {footer.slogan ?? ""}
              </div>
              <div className="flex space-x-6 mt-4 justify-center md:justify-start">
                {footer.socials.map((item) => (
                  <a
                    key={item.text}
                    href={item.url}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">{item.text ?? ""}</span>
                    <NextImage media={item.icon} width={30} height={30} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          {footer.columns.map((item) => (
            <div
              key={item.id}
              className="col-span-6 md:pl-0 md:col-span-4 lg:col-span-3 xl:col-span-3"
            >
              <h2
                className="text-2xl font-bold text-black-500 tracking-wider"
                style={{ fontFamily: "SVN-Gilroy-Bold" }}
              >
                {item.title ?? ""}
              </h2>
              <ul role="list" className="mt-3 space-y-2">
                {item.links.map((link) => (
                  <li key={link.id}>
                    <Link href={link.url}>
                      <a className="text-lg font-semibold text-gray-600 hover:text-yellow-600 hover:underline dot-list-item">
                        {link.text ?? ""}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-12 xl:col-span-3 mt-2 xl:mt-0">
            <h3
              className="text-2xl font-bold text-black-500 tracking-wider "
              style={{ fontFamily: "SVN-Gilroy-Bold" }}
            >
              {footer.subcriptionBox.title ?? ""}
            </h3>
            <span className="mt-2 text-lg font-medium text-gray-500">
              {footer.subcriptionBox.description ?? ""}
            </span>
            <Form
              name="normal_login"
              className="!mt-8 w-full inline-block"
              onFinish={onSubmitform}
              layout="vertical"
              size="middle"
            >
              <Form.Item
                name="email"
                className="font-semibold w-3/4 h-[50px] !inline-flex "
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input
                  type="email"
                  placeholder={footer.subcriptionBox.emailPlaceholder ?? ""}
                  style={{
                    padding: "16px 8px",
                    borderTopLeftRadius: "0.5rem",
                    borderBottomLeftRadius: "0.5rem",
                  }}
                />
              </Form.Item>
              <div className="inline-flex -ml-4 -m-1">
                <Button
                  htmlType="submit"
                  loading={loading}
                  style={{
                    height: "56px",
                    backgroundColor: "#f36c00",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NextImage
                    media={footer.subcriptionBox.Logo}
                    width={30}
                    height={30}
                  />
                </Button>
              </div>
            </Form>
          </div>
        </div>
        <div className="mt-4 border-t bg-[#f36c00] py-4 flex items-center justify-center">
          <p className="text-base text-white md:mt-0 md:order-2">
            {footer.smallText ?? ""}
          </p>
        </div>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  footer: PropTypes.shape({
    logo: mediaPropTypes.isRequired,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        title: PropTypes.string.isRequired,
        links: PropTypes.arrayOf(linkPropTypes),
      })
    ),
    subcriptionBox: PropTypes.shape({
      description: PropTypes.string,
      title: PropTypes.string.isRequired,
      emailPlaceholder: PropTypes.string,
      submitbutton: PropTypes.string,
    }),
    smallText: PropTypes.string.isRequired,
  }),
}

export default Footer
