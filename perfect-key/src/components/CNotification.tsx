import { notification } from 'antd';
import { NotificationStatus } from 'common/enum/shared.enum';
import i18next from 'i18next';

const openNotification = (type: NotificationStatus, message: string | null, description: string | null, statusError = 0) : void => {
    let newMessage = message;
    switch(statusError){
    case 403: 
        newMessage = i18next.t("ERROR_MESSAGE.403");
        break;
    case 502: 
        newMessage = i18next.t("ERROR_MESSAGE.502"); 
        break;
    default: newMessage = message;
    }
    notification[type]({
        message: `${newMessage}`,
        description: `${description}`,
        style : { borderRadius : 6, top : "8vh", width: 400 }
    });
};

export default openNotification;