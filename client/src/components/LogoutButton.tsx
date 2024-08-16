"use client";

import { IconButton, Tooltip } from '@mui/material';
import { LogOut } from "lucide-react";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';


const LogoutButton: React.FC = () => {
    const router = useRouter();

    const logout = () => {
        Cookies.remove("token");
        router.push("/login");
    };

    return (
        <Tooltip title="Logout">
            <IconButton color="warning" onClick={logout}>
                <LogOut />
            </IconButton>
        </Tooltip>
    )
};

export default LogoutButton;