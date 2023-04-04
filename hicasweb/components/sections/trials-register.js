import { useState } from "react"
import { fetchAPI } from "utils/api"
import * as yup from "yup"
import { Formik, Form, Field } from "formik"
import Button from "../elements/button"
import Input from "../elements/input"
import { getStrapiMedia } from "utils/media"

const TrialsRegister = ({ data }) => {
  const [loading, setLoading] = useState(false)

  const ContactSchema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    company: yup.string().required(),
    number: yup.string().required(),
  })

  const {
    title,
    trialTitle,
    namePlaceholder,
    emailPlaceholder,
    companyPlaceholder,
    numberPlaceholder,
    photo,
  } = data

  return (
    <div
      className="w-full m-auto"
      style={{
        maxWidth: "2000px",
        backgroundRepeat: "no-repeat",
        backgroundSize: "auto",
        backgroundPosition: "center",
        backgroundImage: `url(${getStrapiMedia(photo.data.attributes.url)})`,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{ maxWidth: "960px" }}
        className="text-center lg:text-left sm:pr-20 flex flex-col pt-16 pb-0"
      >
        <p
          className="text-2xl leading-8 md:text-3xl leading-9 lg:text-4xl leading-10"
          style={{
            fontFamily: "Roboto",
            fontStyle: "normal",
            fontWeight: "500",
            textTransform: "uppercase",
            color: "#FFFFFF",
          }}
        >
          {title}
          <br />
          {trialTitle}
        </p>

        <Formik
          initialValues={{ name: "", email: "" }}
          validationSchema={ContactSchema}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            setLoading(true)
            try {
              setErrors({ api: null })
              await fetchAPI(
                "/contact-form-submissions",
                {},
                {
                  method: "POST",
                  body: JSON.stringify({
                    name: values.name,
                    email: values.email,
                    company: values.company,
                    number: values.number,
                    location: data.location,
                  }),
                }
              )
            } catch (err) {
              setErrors({ api: err.message })
            }

            setLoading(false)
            setSubmitting(false)
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <div>
              {/* <p
                className=" text-xl md:text-2xl lg:text-2xl"
                style={{
                  fontFamily: "Roboto",
                  fontStyle: "normal",
                  fontWeight: "500",
                  lineHeight: "28px",
                  textTransform: "uppercase",

                  color: "#FFFFFF",
                }}
              >
                Trải nghiệm miễn phí 30 ngày:
              </p> */}
              <Form>
                <div className="flex flex-col ">
                  <div>
                    <Field
                      className="w-96 rounded-lg mb-2 pl-5 text-white sm:w-2/3"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        height: "47px",
                      }}
                      name="Name"
                      placeholder={namePlaceholder}
                      component={Input}
                    />
                  </div>
                  <div>
                    <Field
                      className="w-96 rounded-lg mb-2 pl-5 text-white sm:w-2/3 "
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        height: "47px",
                      }}
                      name="Email"
                      placeholder={emailPlaceholder}
                      component={Input}
                    />
                  </div>
                  <div>
                    <Field
                      className="w-96 rounded-lg mb-2 pl-5 text-white sm:w-2/3 "
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        height: "47px",
                      }}
                      name="Company"
                      placeholder={companyPlaceholder}
                    />
                  </div>

                  {/* <Button
                  type='submit'
                  button={data.submitButton}
                  disabled={isSubmitting}
                  loading={loading}
                /> */}

                  <div>
                    <p
                      style={{
                        fontFamily: "Roboto",
                        fontStyle: "italic",
                        fontWeight: "normal",
                        fontSize: "18px",
                        lineHeight: "21px",
                        color: "#FFFFFF",
                        marginBottom: "5px",
                      }}
                    >
                      Số lượng nhân viên:
                      <br />
                    </p>
                    <Field
                      as="select"
                      name="color"
                      className="w-96 rounded-lg mb-2 p-2 text-white sm:w-2/3"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        height: "47px",
                        textAlign: "center",
                      }}
                      placeholder={numberPlaceholder}
                    >
                      <option value="red">1-10</option>
                      <option value="green">2</option>
                      <option value="blue">3</option>
                    </Field>
                  </div>
                </div>
              </Form>
              <p className="text-red-500 h-12 text-sm mt-1 ml-2 text-left">
                {(errors.email && touched.email && errors.email) || errors.api}
              </p>
            </div>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default TrialsRegister
