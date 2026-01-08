import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password);

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
            Begin your journey of intentional focus
          </p>
        </div>

        {/* Signup card */}
        <div className="card p-8 animate-slide-up animate-delay-200">
          <h2 className="text-h3 mb-6 text-center">Create Your Account</h2>

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
                placeholder="At least 6 characters"
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-small font-medium text-warm-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-small text-warm-600">
              Already have an account?{' '}
              <Link to="/login" className="text-sienna-600 hover:text-sienna-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Privacy note */}
        <div className="mt-6 text-center">
          <p className="text-tiny text-warm-500">
            Your data stays private. We'll ask for your birth date to calculate your weeks counter.
          </p>
        </div>
      </div>
    </div>
  );
}
