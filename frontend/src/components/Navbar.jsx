import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          ShopSmart 🛒
        </Link>

        {/* Nav Links */}
        {isAuthenticated && (
          <div className="flex items-center gap-6">
            <Link
              to="/products"
              className="text-gray-600 hover:text-blue-600
                         transition-colors text-sm font-medium"
            >
              Products
            </Link>
            <Link
              to="/cart"
              className="text-gray-600 hover:text-blue-600
                         transition-colors text-sm font-medium"
            >
              Cart 🛒
            </Link>
            <Link
              to="/orders"
              className="text-gray-600 hover:text-blue-600
                         transition-colors text-sm font-medium"
            >
              My Orders
            </Link>
          </div>
        )}

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-500">
                Hi, {user?.fullName?.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600
                           hover:bg-red-50 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-gray-600
                           hover:bg-gray-100 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm bg-blue-600 text-white
                           rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}