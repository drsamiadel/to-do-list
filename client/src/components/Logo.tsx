import { Typography } from '@mui/material';

const Logo: React.FC = () => {
    return (
        <Typography variant="h1"
            style={{
                background: 'url(/assets/underline.png) no-repeat',
                backgroundPosition: 'bottom left',
            }}
            className="pl-2 pb-2"
        >
            MyTask<span className="text-yellow-500 font-extrabold">.</span>
        </Typography>
    )
}

export default Logo;