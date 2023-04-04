/*eslint-disable*/
import HttpClient from '../http-client';
import { PrintFolio } from "common/cashier/model-folio";
import SYSTEM_CONSTANTS from "common/constants";
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { RsvnConfirmation } from 'common/model-booking';
import Utils from 'common/utils';
import { FolioHistoryRequest } from 'common/const/model-folio';
import { EMPTY, throwError } from 'rxjs';

export default class PrintAPI {
    static host = "";
    static printFolio(data: PrintFolio): Observable<string | null> {
        const api = `${PrintAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.PRINT_FOLIO}`;

        return HttpClient.post(api, data, { responseType: 'arraybuffer' }).pipe(
            map((res: any) => {
                //Create a Blob from the PDF Stream
                const file = new Blob(
                    [res],
                    { type: 'application/pdf' });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                return fileURL;
            })
        )
    }
    static printRsvnConfirmation(data: RsvnConfirmation): Observable<string | null> {
        const api = `${PrintAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.PRINT_RSVN_CONFIRM}`;
        return HttpClient.post(api, data, { responseType: 'arraybuffer' }).pipe(
            map((res: any) => {
                //Create a Blob from the PDF Stream
                const file = new Blob(
                    [res],
                    { type: 'application/pdf' });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                return fileURL;
            })
        )
    }
    static printRegCard(data: RsvnConfirmation): Observable<string | null> {
        const api = `${PrintAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.PRINT_REG_CARD}`;
        return HttpClient.post(api, data, { responseType: 'arraybuffer' }).pipe(
            map((res: any) => {
                //Create a Blob from the PDF Stream
                const file = new Blob(
                    [res],
                    { type: 'application/pdf' });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                return fileURL;
            })
        )
    }
    static printFolioHistory(data: FolioHistoryRequest): Observable<string | null> {
        const api = `${PrintAPI.host}/${SYSTEM_CONSTANTS.API.CASHIER.PRINT_FOLIO_HISTORY}`;
        return HttpClient.post(api, data, { responseType: 'arraybuffer' }).pipe(
            map((res: any) => {
                //Create a Blob from the PDF Stream
                const file = new Blob(
                    [res],
                    { type: 'application/pdf' });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                return fileURL;
            }), catchError((error: any) => {
                return throwError("Error");
            })
        )
    }
}