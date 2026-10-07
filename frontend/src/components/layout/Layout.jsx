import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-slate-50 p-4 pt-20 md:p-8 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;