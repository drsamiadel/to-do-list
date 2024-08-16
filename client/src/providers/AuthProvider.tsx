"use client";

import { useAuth } from "@/hooks/useAuth";

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    useAuth();

    return children;
};

export default AuthProvider;