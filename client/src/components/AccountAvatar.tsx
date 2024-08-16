import getServerUser from '@/lib/auth/getServerUser';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const getCapitalized = (str: string) => {
    return str[0].toUpperCase();
};

const AccountAvatar: React.FC = async () => {
    const user = await getServerUser();

    if (!user) {
        return null;
    }

    const name = getCapitalized(user.name);
    return (
        <Tooltip title={user.name}>
            <IconButton
                size="small"
                sx={{ ml: 2 }}
            >
                <Avatar sx={{ width: 32, height: 32 }}>
                    {name}
                </Avatar>
            </IconButton>
        </Tooltip>
    );
}

export default AccountAvatar;