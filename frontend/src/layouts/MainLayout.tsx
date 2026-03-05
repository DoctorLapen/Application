
import { Outlet } from 'react-router';
import Header from '../components/Header';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;