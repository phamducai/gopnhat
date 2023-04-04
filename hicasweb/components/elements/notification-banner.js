import ReactHtmlParser from "react-html-parser"
import classNames from "classnames"
import CloseIcon from "../icons/close"

const NotificationBanner = ({ data: { text, type }, closeSelf }) => {
  return (
    <div
      className={classNames(
        // Common classes
        "text-white py-2 inset-x-0 top-0 h-16 flex items-center",
        {
          // Apply theme based on notification type
          "bg-[#004879]": type === "info",
          "bg-orange-600": type === "warning",
          "bg-red-600": type === "alert",
        }
      )}
    >
      <div className="container">
        <div className="rich-text-banner flex flex-row justify-between items-center">
          <div className="w-5/6 custom-rick0-editor" style={{ margin: "auto" }}>
            {ReactHtmlParser(text)}
          </div>
          <button
            onClick={closeSelf}
            className="px-1 py-1 flex justify-end w-1/6 pr-4"
          >
            <CloseIcon color={"#FFFFFF"} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationBanner
