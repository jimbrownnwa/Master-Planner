import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and tagline */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-display font-serif text-warm-800 mb-2">
            4000 Weeks
          </h1>
          <p className="text-warm-600 text-lg">
            Choose wisely what to spend your finite time on
          </p>
        </div>

        {/* Login card */}
        <div className="card p-8 animate-slide-up animate-delay-200">
          <h2 className="text-h3 mb-6 text-center">Welcome Back</h2>

          {error && (
            <div className="mb-6 p-4 bg-sienna-50 border border-sienna-200 rounded-button text-sienna-700 text-small">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-small font-medium text-warm-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-small font-medium text-warm-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-small text-warm-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-sienna-600 hover:text-sienna-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Subtle quote */}
        <div className="mt-8 text-center animate-fade-in animate-delay-400">
          <p className="text-small italic text-warm-500">
            "The average human lifespan is absurdly, insultingly brief."
          </p>
          <p className="text-tiny text-warm-400 mt-1">— Oliver Burkeman</p>
        </div>
      </div>
    </div>
  );
}
