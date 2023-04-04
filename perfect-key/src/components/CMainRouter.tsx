import React, { Suspense } from "react";
import { RouterItem } from "common/define-type";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CLoading from "./CLoading";
import CPrivateRoute from "./CPrivateRouter";

const LoginModule = React.lazy(() => import("pages/login/Login"));
const ForgotPasswordModule = React.lazy(() => import("pages/login/Forgot"));
const WelcomeModule = React.lazy(() => import("pages/welcome"));
const MainContentModule = React.lazy(() => import("pages/main"));
const PageNotFound = React.lazy(() => import("pages/404"))

const RouterArr: RouterItem[] = [
    {
        path: "/",
        component: LoginModule
    },
    {
        path: "/forgotPassword",
        component: ForgotPasswordModule
    },
    {
        path: "/welcome",
        component: WelcomeModule
    },
    {
        path: "/main",
        component: MainContentModule,
        noExact: true
    },
    {
        path: "*",
        component: PageNotFound
    }

]

export default function CMainRouter(): JSX.Element {
    return (
        <Router>
            <Suspense fallback={<CLoading visible={true} fullScreen={true} />}>
                <Switch>
                    <Route path="/login">
                        <LoginModule />
                    </Route>
                    <Route path="/forgotPassword">
                        <ForgotPasswordModule />
                    </Route>
                    <CPrivateRoute path="/">
                        <>
                            <Switch>
                                {RouterArr.map(({ path, component: Component, noExact, ...rest }) => {
                                    return <Route path={path} component={Component} key={path} exact={noExact ? false : true} {...rest} />
                                })}
                            </Switch>
                        </>
                    </CPrivateRoute>
                </Switch>
            </Suspense>
        </Router>
    )
}