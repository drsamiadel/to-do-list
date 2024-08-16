"use client"

import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    IconButton,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';

import React from "react";
import Autocomplete from '@mui/material/Autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, editTask } from '@/lib/redux/features/tasks/tasksSlice';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PenBox, Plus } from 'lucide-react';
import { RootState } from "@/lib/redux/store"; // Assuming you have a RootState type defined
import { Task } from '../../@types/types';

const schema = z.object({
    title: z.string().min(3),
    description: z.string().min(3),
    category: z.string().min(3),
    completed: z.boolean(),
    color: z.number().min(1).max(7),
});

type FormData = z.infer<typeof schema>;

const TaskForm: React.FC<{
    task?: Task | null;
}> = ({
    task
}) => {
        const dispatch = useDispatch<any>();
        const { categories } = useSelector((state: RootState) => state.tasks);
        const [open, setOpen] = React.useState(false);

        const {
            handleSubmit,
            formState: { errors, touchedFields },
            watch,
            register,
            setValue,
            reset,
        } = useForm<FormData>({
            resolver: zodResolver(schema),
            defaultValues: {
                title: task?.title || '',
                description: task?.description || '',
                category: task?.category || '',
                completed: task?.completed || false,
                color: task?.color || 1,
            },
        });

        const colors = [
            'bg-red-300',
            'bg-yellow-300',
            'bg-green-300',
            'bg-blue-300',
            'bg-indigo-300',
            'bg-purple-300',
            'bg-pink-300',
        ];

        const handleSaveButton = (data: FormData) => {
            { task && dispatch(editTask({ _id: task._id, ...data })); }
            handleClose();
        }

        const handleAddButton = (data: FormData) => {
            dispatch(createTask(data));
            handleClose();
        }

        const handleClickOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
            reset();
        };

        return (
            <>
                <Tooltip title={task ? 'Edit' : 'Add'}>
                    <IconButton onClick={handleClickOpen}>
                        {task ? <PenBox /> : <Plus />}
                    </IconButton>
                </Tooltip>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-describedby="Add a new task or edit an existing one"
                >
                    <DialogTitle>
                        {task ? 'Edit Task' : 'Add Task'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {task ? 'Edit' : 'Add'} the task details below
                        </DialogContentText>
                        <form className='flex flex-col gap-2 min-w-96' onSubmit={handleSubmit(task ? handleSaveButton : handleAddButton)}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="title"
                                label="Title"
                                type="text"
                                fullWidth
                                defaultValue={watch('title')}
                                {...register('title')}
                                error={!!errors.title && touchedFields.title}
                                helperText={errors.title?.message}
                            />
                            <TextField
                                margin="dense"
                                id="description"
                                label="Description"
                                type="text"
                                fullWidth
                                multiline
                                rows={4}
                                defaultValue={watch('description')}
                                {...register('description')}
                                error={!!errors.description && touchedFields.description}
                                helperText={errors.description?.message}
                            />
                            <Autocomplete
                                id="category"
                                freeSolo
                                options={categories}
                                defaultValue={watch('category')}
                                onInputChange={(e, value) => {
                                    setValue('category', value);
                                }}
                                {...register('category')}
                                renderInput={(params) => <TextField
                                    {...params}
                                    label="Category"
                                    error={!!errors.category && touchedFields.category}
                                    helperText={errors.category?.message}
                                />}
                            />
                            <FormControl variant='outlined' size='small' sx={{ minWidth: 120 }}>
                                <InputLabel id='color'>Color</InputLabel>
                                <Select
                                    labelId='color'
                                    label='Color'
                                    defaultValue={watch('color')}
                                    {...register('color')}
                                >
                                    {colors.map((color, index) => (
                                        <MenuItem key={index} value={index + 1}>
                                            <div className={`w-6 h-6 rounded-full ${color}`} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormGroup>
                                <FormControlLabel className='justify-end' sx={{ margin: 0 }} control={<Checkbox color='primary' defaultChecked={watch('completed')} {...register('completed')} />} label="Completed" />
                            </FormGroup>
                            <DialogActions>
                                <Button onClick={handleClose}>Cancel</Button>
                                <Button variant='contained' type='submit'>
                                    {task ? 'Save' : 'Add'}
                                </Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            </>
        )
    }

export default TaskForm;