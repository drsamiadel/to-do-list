"use client";
import Grid from '@mui/material/Unstable_Grid2';
import {
    IconButton,
    Typography,
    Tooltip,
} from '@mui/material';
import { CheckCircle, Pin, Trash2 } from "lucide-react";
import React from "react";
import { useDispatch } from 'react-redux';
import { toggleCompleted, deleteTask } from '@/lib/redux/features/tasks/tasksSlice';
import TaskForm from './TaskForm';


const TaskCard = ({ task }: { task: any }) => {
    const dispatch = useDispatch<any>();

    const colors = [
        'bg-red-300',
        'bg-yellow-300',
        'bg-green-300',
        'bg-blue-300',
        'bg-indigo-300',
        'bg-purple-300',
        'bg-pink-300',
    ];

    const toggleCheck = () => {
        dispatch(toggleCompleted(task));
    }

    const handleDeleteButton = () => {
        dispatch(deleteTask(task._id));
    }

    return (
        <Grid component={'div'} xs={12} sm={6} md={4} lg={3} key={task.id} className={`group aspect-auto md:aspect-video lg:aspect-square relative ${task.completed && 'opacity-50 grayscale'}`} >
            <Pin size={30} fill="#000" className="absolute top-0 left-0 -rotate-45 z-20" />
            <div className={`h-full p-4 pb-12 rounded-lg ${colors[(task.color - 1) || 0]} relative overflow-hidden shadow-md group-hover:shadow-lg group-hover:scale-[1.01] transition-all`}>
                <div className="w-8 h-8 rounded-tl-lg rounded-br-lg bg-gray-900/20 absolute bottom-0 right-0 group-hover:w-10 group-hover:h-10 transition-all" />
                <Typography variant="h6" className={`truncate ${task.completed && 'line-through'}`}>{task.title}</Typography>
                <Typography variant="body2" marginTop={"10px"} className={`h-4/5 overflow-x-hidden ${task.description.length > 250 && 'overflow-y-scroll'}`} paddingBottom={"2.5rem"}>{task.description}</Typography>
                <div className="flex items-center w-full absolute bottom-0 left-0 md:-left-52 p-2 group-hover:opacity-100 group-hover:left-0 opacity-100 md:opacity-0 transition-all">
                    <Tooltip title='Done'>
                        <IconButton onClick={toggleCheck}>
                            <CheckCircle className={task.completed && 'text-green-700'} />
                        </IconButton>
                    </Tooltip>
                    <TaskForm task={task} />
                    <Tooltip title="Delete">
                        <IconButton onClick={handleDeleteButton}>
                            <Trash2 className="text-red-700" />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </Grid>
    );
};

export default TaskCard;