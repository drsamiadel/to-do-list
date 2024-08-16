"use client";

import Grid from '@mui/material/Unstable_Grid2';
import TaskCard from "@/components/TaskCard";
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { CheckCircle, FilterX, Megaphone, Tag } from 'lucide-react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useEffect } from 'react';
import TasksGridLoading from './TasksGridLoading';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store"; // Assuming you have a RootState type defined
import { fetchCategories, fetchTasks } from "@/lib/redux/features/tasks/tasksSlice";
import Filters from './Filters';

const TasksGrid: React.FC = () => {
    const dispatch = useDispatch<any>();
    const { tasks, pagination, error, loading, categories } = useSelector((state: RootState) => state.tasks);

    const searchParams = useSearchParams();
    const searchParamsObj = Object.fromEntries(searchParams.entries());

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const searchParamsObj = Object.fromEntries(searchParams.entries());
        dispatch(fetchTasks(searchParamsObj));
    }, [dispatch, searchParams]);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className='flex flex-col gap-4 flex-1 h-4/6 justify-between'>
            <Filters />
            <div className='overflow-y-auto p-4 flex-1'>
                {loading ? <TasksGridLoading /> : tasks.length === 0 ? (
                    <div className='flex flex-col items-center justify-center gap-4 h-full'>
                        <Megaphone size='6rem' />
                        <Typography variant='h6'>No tasks found</Typography>
                    </div>
                ) : (
                    <Grid container spacing={2}>
                        {tasks.map((task) => (
                            <TaskCard task={task} key={task._id} />
                        ))}
                    </Grid>
                )}
            </div>
            <div className='flex-none h-fit flex flex-wrap gap-2 items-center justify-between'>
                <Typography variant='caption' className='flex-1 w-full hidden md:block'>
                    Showing {tasks.length} of {pagination.totalTasks} tasks
                </Typography>
                <Pagination
                    count={pagination.totalPages}
                    page={searchParamsObj.page ? parseInt(searchParamsObj.page) : 1}
                    color='primary'
                    className='flex-none'
                    onChange={(e, page) => {
                        router.push(`${pathname}?${new URLSearchParams({ ...searchParamsObj, page: page.toString() }).toString()}`);
                    }}
                />
                <div className='flex-1 flex justify-end'>
                    <FormControl variant='outlined' size='small' sx={{ minWidth: 120 }}>
                        <InputLabel id='limit'>Tasks per page</InputLabel>
                        <Select
                            labelId='limit'
                            value={pagination.resPerPage}
                            onChange={(e) => {
                                const newSearchParams = new URLSearchParams(searchParamsObj);
                                newSearchParams.set('limit', e.target.value.toString());
                                router.push(`${pathname}?${newSearchParams.toString()}`);
                            }}
                            label='Tasks per page'
                        >
                            {[5, 10, 20].map((limit) => (
                                <MenuItem key={limit} value={limit}>{limit}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
        </div>
    );
};

export default TasksGrid;