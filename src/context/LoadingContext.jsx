
import React, { createContext, useContext, useState, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const ref = useRef(null);

    const startLoading = () => {
        setIsLoading(true);
        ref.current?.continuousStart();
    };

    const stopLoading = () => {
        setIsLoading(false);
        ref.current?.complete();
    };

    return (
        <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
            <LoadingBar color="#f11946" ref={ref} height={3} className="z-[9999]" style={{ backgroundColor: '#F97316' }} />
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
