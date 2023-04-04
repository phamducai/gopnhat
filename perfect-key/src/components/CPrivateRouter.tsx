import React from "react";
import { Redirect, Route } from "react-router-dom";
import Utils from "common/utils";
import { now } from "lodash";
import Auth from "services/auth/auth.service";
import CUnAuthorzied from "./CUnAuthorzied";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PropsPrivateRouter = Props & { children: JSX.Element, path: string, role?: string[] };

function CPrivateRoute({ children, path, role, ...rest }: PropsPrivateRouter): JSX.Element {
    const token = Utils.getValueLocalStorage("token")
    const expires = Utils.getValueLocalStorage("expires")
    
    return (
        <Route
            {...rest}
            path={path}
            render={(props) =>
            {if(expires > now() || token){
                if(role){
                    if(Auth.hasRole(role)) {
                        return children 
                    }else{
                        return <CUnAuthorzied />
                    }
                }else{
                    return children
                }
            }else{
                return (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                )} 
            }}
        />
    );
}

export default CPrivateRoute;