import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AppRouter from './router/AppRouter';
import './styles/main.scss';
import AuthProvider from './components/AuthProvider';
import PanierProvider from './context/PanierProvider';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 1000 * 60 * 5, // 5 minutes
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <PanierProvider>
                    <AppRouter />
                </PanierProvider>
            </AuthProvider>
        </QueryClientProvider>
    </React.StrictMode>
);