"use client";

import { CheckCircle, FilterX, Megaphone, Tag } from 'lucide-react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ToggleButton from '@mui/material/ToggleButton';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store"; // Assuming you have a RootState type defined
import { fetchCategories } from "@/lib/redux/features/tasks/tasksSlice";


const Filters: React.FC = () => {
    const dispatch = useDispatch<any>();
    const { categories } = useSelector((state: RootState) => state.tasks);

    const searchParams = useSearchParams();
    const searchParamsObj = Object.fromEntries(searchParams.entries());

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className='flex justify-end gap-2 flex-none h-fit'>
            <div className='flex items-center justify-end gap-2 flex-1 w-40'>
                {Object.keys(searchParamsObj).length > 0 && (
                    <Tooltip title='Clear filters'>
                        <IconButton
                            color='secondary'
                            onClick={() => {
                                const newSearchParams = new URLSearchParams();
                                router.push(`${pathname}?${newSearchParams.toString()}`);
                            }}
                        >
                            <FilterX />
                        </IconButton>

                    </Tooltip>
                )}
                <ToggleButton
                    size='small'
                    value='completed'
                    selected={searchParamsObj.completed === 'true'}
                    onChange={() => {
                        const newSearchParams = new URLSearchParams(searchParamsObj);
                        searchParamsObj.completed === 'true' ? newSearchParams.delete('completed') : newSearchParams.set('completed', 'true');
                        router.push(`${pathname}?${newSearchParams.toString()}`);
                    }}
                >
                    <CheckCircle className='text-green-600' />
                </ToggleButton>
                <Autocomplete
                    id='Category'
                    options={categories}
                    getOptionLabel={(option) => option}
                    filterSelectedOptions
                    size='small'
                    sx={{ minWidth: 160, width: { xs: '100%', sm: 'auto' } }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant='outlined'
                            label='Category'
                        />
                    )}
                    onChange={(e, value) => {
                        const newSearchParams = new URLSearchParams(searchParamsObj);
                        value ? newSearchParams.set('category', value) : newSearchParams.delete('category');
                        router.push(`${pathname}?${newSearchParams.toString()}`);
                    }}
                    value={searchParamsObj.category || undefined}
                    isOptionEqualToValue={(option, value) => option === value}
                />
            </div>
        </div>
    )
};

export default Filters;