import { Outlet } from 'react-router-dom';

function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F4]">
      <Outlet />
    </div>
  );
}

export default ClientLayout;
