import React, { createContext, useContext } from "react";

const PageContext = createContext(null);

export const usePageNavigation = () => {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error("usePageNavigation must be used within a PageProvider");
    }
    return context;
};

export const PageProvider = ({ children, onPageChange }) => {
    return (
        <PageContext.Provider value={{ onPageChange }}>
            {children}
        </PageContext.Provider>
    );
};

export default PageContext;
