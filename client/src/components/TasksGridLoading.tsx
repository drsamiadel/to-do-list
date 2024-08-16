import Grid from '@mui/material/Unstable_Grid2';
import Skeleton from '@mui/material/Skeleton';

const TasksGridLoading: React.FC = () => {
    return (
        <Grid container spacing={2}>
            {Array.from({ length: 3 }).map((_, index) => (
                <Grid key={index} xs={12} sm={6} md={4} lg={3} className={`min-h-20 aspect-auto md:aspect-square`}>
                    <Skeleton variant="rounded" height="100%" />
                </Grid>
            ))}
        </Grid>
    )
};

export default TasksGridLoading;