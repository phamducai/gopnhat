import React from "react";
import { Provider } from "react-redux";
import "./App.scss";
import "./theme/theme.less";
import store from "redux/store";
import CMainRouter from "components/CMainRouter";
import CBootstrap from "components/CBootstrap";
import { CThemeProvider } from "theme";
import "i18n/i18next-config";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "redux/store";
import withClearCache from "pages/main/ClearCache";

const ClearCacheComponent = withClearCache(App);

function AppClearCache(): JSX.Element {
    return <ClearCacheComponent />;
}

function App(): JSX.Element {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <CBootstrap>
                    <CThemeProvider>
                        <CMainRouter />
                    </CThemeProvider>
                </CBootstrap>
            </PersistGate>
        </Provider>
    );
}

export default AppClearCache;
