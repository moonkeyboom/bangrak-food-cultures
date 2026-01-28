import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (password: string) => void;
  error?: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, error }) => {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EFE8DF] to-[#D8BA98] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-[#7F0303] rounded-full">
            <Lock size={32} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {t('admin.login')}
        </h1>
        <p className="text-center text-gray-600 mb-2">
          Enter admin password to continue
        </p>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm text-center mb-6">
          💡 Password: <strong>kittypainai</strong>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.password')}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7F0303] focus:border-transparent transition-all"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#7F0303] text-white rounded-xl font-semibold hover:bg-[#6a0202] transition-colors shadow-lg hover:shadow-xl"
          >
            {t('admin.loginButton')}
          </button>
        </form>
      </div>
    </div>
  );
};
