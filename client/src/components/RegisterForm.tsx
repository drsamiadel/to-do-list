"use client"
import api from '@/lib/api';
import { login } from '@/lib/redux/features/authSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, InputAdornment, Button, Typography, Alert } from '@mui/material';
import { Key, Linkedin, Loader2Icon, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as z from 'zod';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

const schema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    linkedin: z.string().url(),
});

type FormData = z.infer<typeof schema>;

const RegisterForm: React.FC = () => {
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
            name: '',
            linkedin: '',
        },
    });

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const dispatch = useDispatch();
    const router = useRouter();

    const onSubmit = async (data: FormData) => {
        console.log(data);
        setLoading(true);
        setError(null);
        api.post('/auth/signup', data)
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
                label="Name"
                variant="outlined"
                placeholder='Enter your name'
                fullWidth
                disabled={loading}
                defaultValue={watch('name')}
                {...register('name')}
                error={!!errors.name && touchedFields.name}
                helperText={errors.name?.message}
                type='name'
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <User />
                        </InputAdornment>
                    ),
                }}
            />
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
            <TextField
                label="LinkedIn Profile"
                variant="outlined"
                placeholder='Enter your LinkedIn URL'
                fullWidth
                disabled={loading}
                defaultValue={watch('linkedin')}
                {...register('linkedin')}
                error={!!errors.linkedin && touchedFields.linkedin}
                helperText={errors.linkedin?.message}
                type='linkedin'
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Linkedin />
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
                Register
            </Button>
            <Link href="/login" className='underline'>
                Login instead?
            </Link>
        </form>
    )
};

export default RegisterForm;