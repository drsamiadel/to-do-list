"use client";
import useDebounce from '@/hooks/useDebounce';
import { TextField, InputAdornment } from '@mui/material';
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const SearchInput: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const keyword = searchParams.get('keyword');
    const [search, setSearch] = useState(keyword || '');
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        const searchParamsObj = Object.fromEntries(searchParams.entries());
        const newSearchParams = new URLSearchParams();
        for (const key in searchParamsObj) {
            if (key !== 'keyword') {
                newSearchParams.set(key, searchParamsObj[key]);
            }
        }
        if (debouncedSearch) {
            newSearchParams.set('keyword', debouncedSearch);
        }
        router.push(`${pathname}?${newSearchParams.toString()}`);
    }, [debouncedSearch, router, pathname, searchParams]);

    return (
        <TextField
            placeholder="Search"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                ),
            }}
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full md:w-auto'
        />
    )
}

export default SearchInput;