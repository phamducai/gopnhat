import React, { useEffect } from "react";
import { usePreventEvent } from "hooks";
import { useDispatch } from "react-redux";
import { fetchConfig } from "redux/controller";

const CBootstrap = ({ children }: Props): JSX.Element => {
    const dispatch = useDispatch();
    usePreventEvent();
    
    useEffect(() => {
        dispatch(fetchConfig());
    }, [dispatch]);

    return (
        <div>{children}</div>
    )
}

export default CBootstrap;