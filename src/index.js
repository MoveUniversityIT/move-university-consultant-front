import React from 'react';
import ReactDOM from 'react-dom/client';
import '@style/reset.css';
import '@style/app.css';
import App from './App';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {persistStore} from "redux-persist";
import RootStore from "@/appcore/rootStore";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {WebSocketProvider} from "@/appcore/context/WebSocketContext";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
            gcTime: 1000 * 60 * 5,
        }
    },
});

const persistor = persistStore(RootStore);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={RootStore}>
        <PersistGate persistor={persistor}>
            <QueryClientProvider client={queryClient}>
                <App/>
            </QueryClientProvider>
        </PersistGate>
    </Provider>
);