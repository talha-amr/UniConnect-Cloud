import React from 'react';

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-orange-100 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="mt-4 text-orange-600 font-medium animate-pulse">Loading Data...</p>
        </div>
    );
};

export default Loader;
