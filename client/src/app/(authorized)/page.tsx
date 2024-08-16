import { Container } from '@mui/material';
import AccountAvatar from "@/components/AccountAvatar";
import Logo from "@/components/Logo";
import TasksGridLoading from "@/components/TasksGridLoading";
import SearchInput from "@/components/SearchInput";
import LogoutButton from "@/components/LogoutButton";
import TaskForm from '@/components/TaskForm';
import dynamic from 'next/dynamic';
import LinkedinButton from '@/components/LinkedinButton';

const TasksGridComponent = dynamic(() => import('@/components/TasksGrid'), {
  loading: () => <TasksGridLoading />,
});

export default function Home() {
  return (
    <Container maxWidth="lg" className=" h-full pt-4 md:pt-24 lg:pt-32">
      <div className="h-full  backdrop-blur-sm bg-blue-100/30  border-2 rounded-t-3xl p-6 flex flex-col gap-8">
        <div className="flex justify-between items-center flex-none h-fit">
          <Logo />
          <div className="flex gap-4 items-center">
            <div className='hidden md:flex gap-4'>
              <TaskForm />
              <SearchInput />
            </div>
            <AccountAvatar />
            <LinkedinButton />
            <LogoutButton />
          </div>
        </div>
        <div className="flex md:hidden gap-4">
          <TaskForm />
          <SearchInput />
        </div>
        <TasksGridComponent />
      </div>
    </Container>
  );
}
