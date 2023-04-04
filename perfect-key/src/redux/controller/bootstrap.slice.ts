import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootEpic, SystemConfig } from "common/define-type";
import { filter, map, switchMap } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import IdentityApi from "api/identity/identity.api";
import pkmApi from "api/pkm/pkm.api";
import ProfileApi from "api/profile/prf.api";
import InventoryApi from "api/inv/inv.api";
import ListHotelApi from "api/hotel/hotel.api";
import functionPkmApi from "api/pkm/function.api";
import HotelConfigApi from "api/hcfg/hcfg.api";
import CashierAPI from "api/cashier/cashier.api";
import PrintAPI from "api/print/print.api";
import PrintReportApi from "api/report/printReport.api";
import HskpAPI from "api/hskp/hskp.api";
import HlsApi from "api/hls/hls.api";

interface BootstrapState {
    systemConfig: SystemConfig;
    isSuccess: boolean
}
const PATH_SYSTEM_CONFIG = `${process.env.PUBLIC_URL}/assets/system-config.json`;
const IS_CONFIG_LOCAL = false;
const DEFAULT_CONFIG: SystemConfig = {
    protocol: 'http',
    hostIdentity: 'https://sit.license.hicas.vn',
    hostPkm: "http://localhost:2104",
    hostTingConnect: "http://api.tingconnect.com",
    hostHCFG: "http://localhost:2101",
    // hostHCFG: "https://sit.api.hicas.vn",
    // hostINV: "http://localhost:2102",
    hostINV: "https://sit.api.hicas.vn",
    // hostPRF: "http://localhost:2103",
    hostPRF: "https://sit.api.hicas.vn",
    hostRSVN: "http://localhost:2104",
    // hostCashier: "http://localhost:2105",
    hostCashier: "https://sit.api.hicas.vn",
    // hostPrint: "http://localhost:2107",
    hostPrint: "https://sit.api.hicas.vn",
    // hostHSKP: "http://localhost:2107"
    hostHSKP: "https://sit.api.hicas.vn",
    hostHls: "https://sit.api.hicas.vn",
    hostImage: "https://autodoc.tingconnect.vn"
};
const initialStateBootstrap: BootstrapState = {
    systemConfig: DEFAULT_CONFIG,
    isSuccess: false,
};

function updateHostService(host: SystemConfig) {
    IdentityApi.host = host.hostIdentity;
    pkmApi.host = host.hostPkm;
    functionPkmApi.host = host.hostPkm;
    ProfileApi.profileHost = host.hostPRF;
    InventoryApi.inventoryHost = host.hostINV;
    HotelConfigApi.hcfgHost = host.hostHCFG;
    ListHotelApi.host = host.hostIdentity;
    CashierAPI.host = host.hostCashier;
    PrintAPI.host = host.hostPrint;
    PrintReportApi.host = host.hostPrint;
    HskpAPI.hostHskp = host.hostHSKP;
    HlsApi.host = host.hostHls;
}
const bootstrapSlice = createSlice({
    name: 'bootstrap',
    initialState: initialStateBootstrap,
    reducers: {
        setSysytemConfig: (state, action: PayloadAction<SystemConfig>) => {
            updateHostService(action.payload);
            state.systemConfig = action.payload;
            state.isSuccess = true;
        },
        fetchConfig: (state) => {
            state.isSuccess = false;
        }
    }
})

const bootstrap$: RootEpic = (action$) => action$.pipe(
    filter(fetchConfig.match),
    switchMap(() => {
        return ajax.getJSON(PATH_SYSTEM_CONFIG, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }).pipe(map(res => {
            const config = IS_CONFIG_LOCAL ? DEFAULT_CONFIG : res as SystemConfig;
            return bootstrapSlice.actions.setSysytemConfig(config)
        }))
    })
);


export const BoostrapEpics = [
    bootstrap$
];

export const { fetchConfig } = bootstrapSlice.actions;
export const bootstrapReducer = bootstrapSlice.reducer;