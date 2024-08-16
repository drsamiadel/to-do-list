import { Container } from '@mui/material';
import Logo from '@/components/Logo';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <Container maxWidth="xs" className=" h-full items-center justify-center min-h-screen" style={{ display: 'flex' }}>
            <div className=" bg-cyan-100 border-2 shadow-lg rounded-3xl px-8 py-12 flex flex-col items-center justify-center gap-8 md:gap-16">
                <Logo />
                {children}
            </div>
        </Container>
    );
}

export default Layout;