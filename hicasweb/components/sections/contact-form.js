import { Col, Form, Input, Row } from "antd"
import openNotification, {
  NotificationStatus,
} from "common/notification/CNotification"
import React, { useState } from "react"
import { IoIosArrowForward } from "react-icons/io"
import { fetchAPI } from "utils/api"
import ButtonIcon from "../elements/buttonIcon"
import NextImage from "../elements/image"
import SectionTitle from "../elements/section-title"

const ContactForm = ({ data }) => {
  const [loading, setLoading] = useState(false)

  const {
    namePlaceholder,
    emailPlaceholder,
    phonePlaceholder,
    contentPlaceholder,
  } = data
  const onFinish = async (values) => {
    console.log("Received values of form: ", values)
    setLoading(true)

    try {
      //   setErrors({ api: null })
      const data = {
        data: {
          email: values.email,
          status: "contacted",
          location: "VN",
          name: values.name,
          content: values.content,
          phone: values.phone,
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
      openNotification(
        NotificationStatus.Error,
        "Thất bại",
        "Gửi email không thành công"
      )
      setLoading(false)
    }
    setLoading(false)
  }
  return (
    <>
      <div className="flex justify-center items-center">
        {data.title && <SectionTitle text={data.title} />}
      </div>
      <div className="container pt-4 lg:pt-16 pb-16 flex xl:items-start xl:justify-evenly flex-col lg:flex-row ">
        <div className="w-full  lg:w-1/2 px-8">
          {data.subtitle && (
            <div
              className="text-2xl font-normal mb-6"
              dangerouslySetInnerHTML={{
                __html: data.subtitle,
              }}
            ></div>
          )}
          {data.subscribeTitle.map((sub, index) => (
            <React.Fragment key={index}>
              {sub.title && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: sub.title,
                  }}
                />
              )}
              <div key={index} className="flex items-center gap-x-5 ck-content">
                {sub.icon && (
                  <NextImage media={sub.icon} width={20} height={26} />
                )}
                {sub.announce && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sub.announce,
                    }}
                  />
                )}
              </div>
              <hr className="my-2" />
            </React.Fragment>
          ))}
          <div className="mt-6">
            {data.titleForm && (
              <div
                className="text-2xl font-normal mb-4"
                dangerouslySetInnerHTML={{
                  __html: data.titleForm,
                }}
              />
            )}
            <Form
              name="normal_login"
              className="login-form"
              onFinish={onFinish}
              layout="vertical"
              size="middle"
            >
              <Form.Item
                //   label="Họ tên:"
                name="name"
                className="font-semibold !mb-4"
              >
                <Input
                  //   prefix={<UserOutline />}
                  placeholder={namePlaceholder ?? ""}
                  style={{ height: 55 }}
                  className="!rounded-[11px] !bg-[#f2f2f2]"
                />
              </Form.Item>
              <Row gutter={[14, 0]}>
                <Col md={12} xs={24}>
                  <Form.Item
                    // label="Email:"
                    name="email"
                    className="font-semibold !mb-4"
                    rules={[
                      { required: true, message: "Please input your email!" },
                    ]}
                  >
                    <Input
                      //   prefix={<MailIcon />}
                      type="email"
                      placeholder={emailPlaceholder ?? ""}
                      style={{ height: 55 }}
                      className="!rounded-[11px] !bg-[#f2f2f2]"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item
                    // label="Số điện thoại:"
                    name="phone"
                    className="font-semibold  !mb-4"
                    //   rules={[
                    //     { required: true, message: "Please input your Password!" },
                    //   ]}
                  >
                    <Input
                      //   prefix={<PhoneIcon />}
                      style={{ height: 55 }}
                      type="number"
                      className="!rounded-[11px] !bg-[#f2f2f2] "
                      placeholder={phonePlaceholder ?? ""}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name={"content"}
                // label="Nội dung:"
                className="font-semibold !mb-4"
              >
                <Input.TextArea
                  placeholder={contentPlaceholder ?? ""}
                  style={{ height: 115 }}
                  className="!rounded-[11px] !bg-[#f2f2f2]"
                />
              </Form.Item>
              <div className="flex justify-end h-10 my-4">
                <ButtonIcon
                  icon={<IoIosArrowForward />}
                  text={data.submitButton.text ?? ""}
                  className="border py-2 px-5 text-white h-[50px] bg-[#f36c00] hover:border-transparent transition-all duration-300 hover:text-white rounded-3xl text-sm"
                  loading={loading}
                  style={{
                    width: "100%",
                    height: "50px",
                    border: "1px",
                    margin: "8px 0",
                    color: "white",
                    borderRadius: "6px",
                    backgroundColor: "#f36c00",
                  }}
                />
              </div>
            </Form>
          </div>
        </div>
        <div className="bg-white w-full h-full flex-1 lg:w-1/2 rounded-md p-3 mt-8 xl:m-0">
          <div className="">
            <iframe
              src={`${data.map.mapLink ?? ""}`}
              width={`${data.map.width}`}
              allowFullScreen=""
              loading="lazy"
              className="h-[300px] md:h-[500px] lg:h-[715px]"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactForm
