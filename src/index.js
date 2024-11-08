import React from 'react';
import ReactDOM from 'react-dom/client';
import '@style/reset.css'
import App from './App';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter} from "react-router-dom";

// React Query의 QueryClient 생성
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
root.render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </QueryClientProvider>
);