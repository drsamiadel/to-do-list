"use client"

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import api from '@/lib/api';
import { Linkedin } from 'lucide-react';
import Image from 'next/image';
import { LinkedIn } from '../../@types/types';


const LinkedinButton: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const [account, setAccount] = React.useState<LinkedIn | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<any | null>(null);

    React.useEffect(() => {
        const fetchAccount = async () => {
            const response = await api.get('/profile/linkedin')
                .then((response) => {
                    setAccount(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error);
                });
        };

        fetchAccount();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <IconButton onClick={handleClickOpen}>
                <Linkedin />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    LinkedIn Account
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {loading ? 'Loading...' : error ? 'An error occurred' : account ? (
                            <React.Fragment>
                                <div>
                                    <strong>Name:</strong> {account.name}
                                </div>
                                <div>
                                    <strong>Location:</strong> {account.location}
                                </div>
                                <div>
                                    <strong>Profile URL:</strong> <a href={account.url} target='_blank'>{account.url}</a>
                                </div>
                                <Image src={account.image} alt={account.name} width={100} height={100} />
                            </React.Fragment>
                        ) : 'No LinkedIn account connected'}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}

export default LinkedinButton;