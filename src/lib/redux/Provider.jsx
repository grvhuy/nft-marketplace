"use client"
import {persistor, store} from "./store"
import {Provider} from "react-redux"
import {PersistGate} from "redux-persist/integration/react";

export default function StoreProvider({children,}) {
    return (
        <Provider store={store}>
            <PersistGate loading={<div/>} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}