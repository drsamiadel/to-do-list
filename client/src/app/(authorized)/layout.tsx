import AuthProvider from "@/providers/AuthProvider";

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}

export default Layout;