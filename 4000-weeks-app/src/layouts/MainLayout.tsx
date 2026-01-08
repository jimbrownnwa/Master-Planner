import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { WeeksCounter } from '../features/weeks/WeeksCounter';
import { BirthDateModal } from '../features/auth/BirthDateModal';
import { useWeeksCounter } from '../features/weeks/useWeeksCounter';

export function MainLayout() {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const { data: weeksData } = useWeeksCounter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showBirthDateModal, setShowBirthDateModal] = useState(false);

  // Check if user needs to set birth date
  useEffect(() => {
    if (weeksData && weeksData.birthDate === null) {
      setShowBirthDateModal(true);
    }
  }, [weeksData]);

  const navItems = [
    { path: '/', label: 'Weekly' },
    { path: '/goals', label: 'Goals' },
    { path: '/focus', label: 'Focus' },
    { path: '/reflect', label: 'Reflect' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-warm-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <h1 className="text-h3 font-serif text-warm-800 group-hover:text-sienna-600 transition-colors">
                4000 Weeks
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-button text-small font-medium transition-all ${
                      isActive
                        ? 'bg-sienna-50 text-sienna-700'
                        : 'text-warm-600 hover:text-warm-800 hover:bg-warm-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-6">
              {/* Weeks Counter */}
              <div className="relative">
                <WeeksCounter />
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-button hover:bg-warm-50 transition-colors"
                >
                  <User className="w-4 h-4 text-warm-600" />
                  <span className="text-small text-warm-600">
                    {user?.email?.split('@')[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-12 bg-white border border-warm-200 rounded-button shadow-soft-lg py-1 z-20 min-w-[160px]">
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-small hover:bg-warm-50 flex items-center gap-2 text-warm-700"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Birth date modal */}
      {showBirthDateModal && (
        <BirthDateModal onComplete={() => setShowBirthDateModal(false)} />
      )}
    </div>
  );
}
