import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/config/theme';
import StoreProvider from '../providers/StoreProvider';

const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <StoreProvider>
                    {children}
                </StoreProvider>
            </ThemeProvider>
        </AppRouterCacheProvider>
    )
}

export default Providers;