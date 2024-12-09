
import { Link, useLocation } from 'react-router-dom';
import { Library } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className=" p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Library className="h-6 w-6" />
          <span className="text-xl font-extrabold">Library System</span>
        </Link>
        <div className="space-x-4">
          {isAdmin ? (
            <Link to="/" className="hover:underline font-medium">Switch to User View</Link>
          ) : (
            <Link to="/admin" className="hover:underline font-medium">Admin Dashboard</Link>
          )}
        </div>
      </div>
    </nav>
  );
}