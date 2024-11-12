import React from 'react';
import ReactDOM from 'react-dom/client';
import '@style/reset.css';
import '@style/app.css';
import App from './App';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter} from "react-router-dom";
import {persistStore} from "redux-persist";
import RootStore from "@/appcore/rootStore";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";

const queryClient = new QueryClient(
    {
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60,
                gcTime: 1000 * 60 * 5,
            }
        },
    }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
const persistor = persistStore(RootStore);

root.render(
    <Provider store={RootStore}>
        <PersistGate persistor={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </QueryClientProvider>
        </PersistGate>
    </Provider>
);