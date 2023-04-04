/*eslint-disable*/
import PrintAPI from "api/print/print.api";
import { PrintFolio } from "common/cashier/model-folio";
import { FolioHistoryRequest } from "common/const/model-folio";
import { NotificationStatus } from "common/enum/shared.enum";
import { RsvnConfirmation } from "common/model-booking";
import openNotification from "components/CNotification";
import { fil } from "date-fns/locale";
import i18next from "i18next";

export default class PrintService {

    static async printFolioInvoice(dataApi: PrintFolio): Promise<string | null> {
        try {
            const fileURL = await PrintAPI.printFolio(dataApi).toPromise();

            openNotification(NotificationStatus.Success, " ", "Get PDF Successfully");
            return fileURL;
        } catch (error: any) {
            console.log(error);
            openNotification(NotificationStatus.Warning, "", i18next.t("ERROR_MESSAGE.PRINT.cantGetData"), error.status);
            return null;
        }
    }
    static async printRsvnConfirmation(dataApi: RsvnConfirmation): Promise<string | null> {
        try {
            const fileURL = await PrintAPI.printRsvnConfirmation(dataApi).toPromise();

            openNotification(NotificationStatus.Success, " ", "Get PDF Successfully");
            return fileURL;
        } catch (error: any) {
            console.log(error);
            openNotification(NotificationStatus.Warning, "", i18next.t("ERROR_MESSAGE.PRINT.cantGetData"), error.status);
            return null;
        }
    }
    static async printRegCard(dataApi: RsvnConfirmation): Promise<string | null> {
        try {
            const fileURL = await PrintAPI.printRegCard(dataApi).toPromise();

            openNotification(NotificationStatus.Success, " ", "Get PDF Successfully");
            return fileURL;
        } catch (error: any) {
            console.log(error);
            openNotification(NotificationStatus.Warning, "", i18next.t("ERROR_MESSAGE.PRINT.cantGetData"), error.status);
            return null;
        }
    }
    static async printFolioHistoryRequest(dataApi: FolioHistoryRequest): Promise<string | null> {
        try {
            const fileURL = await PrintAPI.printFolioHistory(dataApi).toPromise();

            openNotification(NotificationStatus.Success, " ", "Get PDF Successfully");
            return fileURL
        } catch (error: any) {
            console.log(error);
            openNotification(NotificationStatus.Warning, "", i18next.t("ERROR_MESSAGE.PRINT.cantGetData"), error.status);
            return null;
        }
    }
}