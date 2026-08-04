import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      const response = await authApi.register(form);
      const { token, email, fullName, role } = response.data;
      login({ email, fullName, role }, token);
      navigate('/products');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center
                    justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200
                      w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create account
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Join ShopSmart today
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Venkat Prasad"
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg
                       text-sm font-medium hover:bg-blue-700
                       transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}