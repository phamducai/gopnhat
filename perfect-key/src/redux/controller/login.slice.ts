/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-debugger */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IdentityApi from "api/identity/identity.api";
import { Login, RootEpic, User, UserResponse } from "common/define-type";
import { NewResponseLogin, ResponseDeparment } from "common/define-identity";
import Utils from "common/utils";
import { catchError, filter, switchMap,mergeMap, map } from "rxjs/operators";
import jwt from 'jwt-decode' // import dependency
import { WritableDraft } from "immer/dist/internal";
import { now } from "lodash";
import { addSeconds } from "date-fns";

type MessageLogin = {
    content: string;
    errorCode?: number
}
type MessageForgot = {
    ErrorCode?: number,
    Message: string
}
interface LoginState {
    loading: boolean;
    isSuccess: boolean;
    user: User | undefined;
    message: MessageLogin | undefined;
    messageForgot: MessageForgot | undefined;
    departmentId : number;
    refresh_token: string;
}

const initState: LoginState = {
    loading: false,
    isSuccess: false,
    user: undefined,
    departmentId : 1,
    message: undefined,
    messageForgot: undefined,
    refresh_token: ""
}

const loginSlice = createSlice({
    name: 'login',
    initialState: initState,
    reducers: {
        loginRequest(state, action: PayloadAction<Login>) {
            state.loading = true
        },
        loginSuccess(state, action: PayloadAction<{ user: User, token: string, refresh_token: string, expires_token: number}>) {
            Utils.setLocalStorage('token', action.payload.token);
            Utils.setLocalStorage("username", action.payload.user.userName);
            Utils.setLocalStorage("idProfile", action.payload.user.id);
            Utils.setLocalStorage("role", action.payload.user.roles);
            Utils.setLocalStorage("refresh_token", action.payload.refresh_token)
            Utils.setLocalStorage("email", action.payload.user.email)
            Utils.setLocalStorage("user", action.payload.user)
            Utils.setLocalStorage("expires", action.payload.expires_token)
            state.user = action.payload.user
            state.loading = false
            state.isSuccess = true;
        },
        getInfoUser(state, action: PayloadAction<User>) {
            state.user = action.payload
        },
        forgotRequest(state, action: PayloadAction<string>) {
            state.loading = true
        },
        sendMailSuccess(state, action: PayloadAction<{message: WritableDraft<MessageLogin> | undefined}>) {
            state.message = action.payload.message
            state.loading = false
            state.isSuccess = true;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload
        },
        getDepartmentRequest(state, action : PayloadAction<string>){
            state.loading = true;
        },
        getDepartmentSuccess(state,action : PayloadAction<ResponseDeparment>){
            state.isSuccess = true;
            state.departmentId = action.payload.departmentId;
        },
        message(state, action: PayloadAction<MessageLogin>) {
            state.message = action.payload;
            state.loading = false
        },
        messageForgot(state, action: PayloadAction<MessageForgot>) {
            state.messageForgot = action.payload;
            state.loading = false
        },
        clearMessageResquest(state) {
            state.loading = true
        },
        clearMessage(state) {
            state.messageForgot = undefined;
            state.message = undefined;
            state.loading = false
        }
    }
})

const login$: RootEpic = (action$) => action$.pipe(
    filter(loginRequest.match),
    switchMap((re) => {
        // IdentityApi.login(re.payload)
        return IdentityApi.getToken().pipe(
            mergeMap((x) => {
                const body = Utils.parseUrl({
                    "username": re.payload.loginName,
                    "password": IdentityApi.encryptData(re.payload.password, x as string),
                    "client_id": "PKM",
                    "grant_type": "password",
                    "scope": "offline_access API"
                });
                return IdentityApi.login(body).pipe(
                    mergeMap((res: any) => {
                        if (res && typeof !res.error) {
                            const newRes = res as NewResponseLogin;
                            const token = newRes.access_token
                            const userRes: UserResponse = jwt(token)
                            let expires_time = 0
                            const infoUser = JSON.parse(userRes.profile.toString())
                            const user: User = {
                                userName: infoUser.UserName,
                                email: infoUser.Email,
                                id: infoUser.Id,
                                roles: userRes.orgRoles,
                                client_id: userRes.client_id,
                                expires_in: res.expires_in
                            };
                            if(re.payload.remember){
                                expires_time = addSeconds(now(), res.expires_in).getTime()
                            }
                            return [loginSlice.actions.loginSuccess({ user, token: newRes.access_token, refresh_token: newRes.refresh_token, expires_token: expires_time }),
                                // loginSlice.actions.getDepartmentRequest(newRes.access_token)
                            ];
                            // return [loginSlice.actions.message({
                            //     content: newRes.msg
                            // })];
                        }else{
                            return [loginSlice.actions.message({
                                content: res.error
                            })];
                        }
                    }),
                    catchError(err => [loginSlice.actions.message({ content: 'Lỗi đăng nhập' })])
                );
            })
        )
    })
)
const forgot$ : RootEpic = (action$) => action$.pipe(
    filter(forgotRequest.match),
    switchMap((re) => {
        return IdentityApi.forgotPassword(re.payload).pipe(
            map((res:any) => {
                return loginSlice.actions.messageForgot({Message: "success"});
            }),catchError(err => [loginSlice.actions.messageForgot(err.response)])
        )
    })
)
const clearMessage$ : RootEpic = (action$) => action$.pipe(
    filter(clearMessageResquest.match),
    map(() => {return loginSlice.actions.clearMessage()})
)


export const LoginEpics = [
    login$,
    forgot$,
    clearMessage$
]
export const {
    // getDepartmentRequest,
    loginRequest,
    forgotRequest,
    clearMessageResquest,
    getInfoUser
} = loginSlice.actions
export const loginReducer = loginSlice.reducer