import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from './AuthContext';

interface BirthDateModalProps {
  onComplete: () => void;
}

export function BirthDateModal({ onComplete }: BirthDateModalProps) {
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) return;

    // Validate birth date is in the past
    const selectedDate = new Date(birthDate);
    const today = new Date();
    if (selectedDate > today) {
      setError('Birth date must be in the past');
      setLoading(false);
      return;
    }

    // Update profile with birth date
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ birth_date: birthDate })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-warm-900/50 backdrop-blur-sm flex items-center justify-center px-4 z-50">
      <div className="card p-8 max-w-md w-full animate-slide-up">
        <div className="text-center mb-6">
          <h2 className="text-h2 mb-3">Welcome to 4000 Weeks</h2>
          <p className="text-warm-600">
            To calculate your weeks counter, we need to know when you were born.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-sienna-50 border border-sienna-200 rounded-button text-sienna-700 text-small">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="birthDate" className="block text-small font-medium text-warm-700 mb-2">
              Your Birth Date
            </label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="input"
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-button p-4">
            <p className="text-tiny text-warm-600">
              <strong className="text-warm-700">Privacy note:</strong> Your birth date is stored
              securely and only used to calculate your weeks lived. It's never shared with anyone.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
