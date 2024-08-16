"use client"
import api from '@/lib/api';
import { login } from '@/lib/redux/features/authSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, InputAdornment, Button, Typography, Alert } from '@mui/material';
import { Key, Loader2Icon, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as z from 'zod';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

const LoginForm: React.FC = () => {
    const {
        handleSubmit,
        formState: { errors, touchedFields },
        register,
        watch,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const dispatch = useDispatch();
    const router = useRouter();

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError(null);
        api.post('/auth/login', data)
            .then(response => response.data)
            .then(data => {
                const decoded = jwt.decode(data.token) as jwt.JwtPayload;
                Cookies.set('token', data.token, {
                    expires: new Date(decoded.exp! * 1000),
                });

                dispatch(login({ user: data.user, token: data.token }));
                router.push('/');
            })
            .then((data) => setLoading(false))
            .catch(error => {
                console.error(error);
                setError(error.response.data.message);
            })
            .finally(() => setLoading(false));
    };

    return (
        <form className="flex flex-col gap-6 items-center" onSubmit={handleSubmit(onSubmit)}>
            {error && (
                <Alert severity="error" className='w-full'>
                    {error}
                </Alert>
            )}
            <TextField
                label="Email"
                variant="outlined"
                placeholder='Enter your email'
                fullWidth
                disabled={loading}
                defaultValue={watch('email')}
                {...register('email')}
                error={!!errors.email && touchedFields.email}
                helperText={errors.email?.message}
                type='email'
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Mail />
                        </InputAdornment>
                    ),
                }}
            />
            <TextField
                label="Password"
                {...register('password')}
                error={!!errors.password && touchedFields.password}
                helperText={errors.password?.message}
                variant="outlined"
                type="password"
                placeholder='Enter your password'
                fullWidth
                disabled={loading}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Key />
                        </InputAdornment>
                    ),
                }}
            />
            <Button
                variant="contained"
                color="primary"
                type='submit'
                fullWidth
                disabled={loading}
                className='flex items-center gap-2'
            >
                {loading && <Loader2Icon className='animate-spin' size={24} />}
                Login
            </Button>
            <Link href="/register" className='underline'>
                Create an account
            </Link>
        </form>
    )
};

export default LoginForm;