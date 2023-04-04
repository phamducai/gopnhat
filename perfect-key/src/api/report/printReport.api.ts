/* eslint-disable @typescript-eslint/no-explicit-any */
import SYSTEM_CONSTANTS from 'common/constants';
import { IDataAPIAccountDetail, IDataAPICompanyAgent, IDataApiDateFromReport, IDataAPIEndOfDay, IDataAPIGroupInHouse,
    IDataAPIGuestFolio, IDataAPIHousekeeping, IDataAPIInputDataReport, IDataAPINationality } from 'common/report/define-api-report';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import HttpClient from '../http-client';
export default class PrintReportApi {
    public static host: string;
    hostPrint = '';
    static printGuestBalance(data: IDataApiDateFromReport): Observable<string | null> {
        const api = `${PrintReportApi.host}/${SYSTEM_CONSTANTS.API.REPORT.GUEST_BALANCE}`;
        return HttpClient.post(api, data, { responseType: 'arraybuffer'}).pipe(
            map((res: any) => {
                //Create a Blob from the PDF Stream
                const file = new Blob(
                    [res],
                    { type: 'application/pdf' });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                return fileURL;
            })
        );
    }
    static printArrivalDeparture(data: IDataAPIInputDataReport): Observable<string | null> {
        const api = `${PrintReportApi.host}/${SYSTEM_CONSTANTS.API.REPORT.ARRIVAL_DEPARTURE}`;
        return HttpClient.post(api, data, { responseType: 'arraybuffer'}).pipe(
            map((res: any) => {
                //Create a Blob from the PDF Stream
                const file = new Blob(
                    [res],
                    { type: 'application/pdf' });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                return fileURL;
            })
        );
    }
    static printGuestInHouse(data: IDataAPIGroupInHouse): Observable<string | null> {
        const api = `${PrintReportApi.host}/${SYSTEM_CONSTANTS.API.REPORT.GUEST_INHOUSE}`;
        return HttpClient.post(api, data, { responseType: 'arraybuffer'}).pipe(
            map((res: any) => {
                //Create a Blob from the PDF Stream
                const file = new Blob(
                    [res],
                    { type: 'application/pdf' });
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                return fileURL;
            })
        );
    }
    static printCompanyAgent(data: IDataAPICompanyAgent): Observable<string | null> {
        const api = `${PrintReportApi.host}/${SYSTEM_CONSTANTS.API.REPORT.COMPANY_AGENT}`;
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
        );
    }
    static printAccountDetail(data: IDataAPIAccountDetail): Observable<string | null> {
        const api = `${PrintReportApi.host}/${SYSTEM_CONSTANTS.API.REPORT.ACCOUNT_DETAIL}`;
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
        );
    }
    static printGuestFolio(data: IDataAPIGuestFolio): Observable<string | null> {
        const api = `${PrintReportApi.host}/${SYSTEM_CONSTANTS.API.REPORT.GUEST_FOLIO}`;
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
        );
    }
    static printEndOfDay(data: IDataAPIEndOfDay): Observable<string | null> {
        const api = `${PrintReportApi.host}/${SYSTEM_CONSTANTS.API.REPORT.END_OF_DAY}`;
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
        );
    }
    static printNationality(data: IDataAPINationality): Observable<string | null> {
        const api = `${PrintReportApi.host}/${SYSTEM_CONSTANTS.API.REPORT.NATIONALITY}`;
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
        );
    }
    static printHousekeeping(data: IDataAPIHousekeeping): Observable<string | null> {
        const api = `${PrintReportApi.host}/${SYSTEM_CONSTANTS.API.REPORT.HOUSEKEEPING}`;
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
        );
    }
}