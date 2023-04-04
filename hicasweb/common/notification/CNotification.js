import { notification } from "antd"

export const NotificationStatus = {
  Success: "success",
  Info: "info",
  Warninn: "warning",
  Error: "error",
}
const openNotification = (type, message, description, statusError) => {
  let newMessage = message
  switch (statusError) {
    case 403:
      newMessage = "ERROR_MESSAGE.403"
      break
    case 502:
      newMessage = "ERROR_MESSAGE.502"
      break
    default:
      newMessage = message
  }
  notification[type]({
    message: `${newMessage}`,
    description: `${description}`,
    style: { borderRadius: 6, top: "8vh", width: 400 },
  })
}

export default openNotification
