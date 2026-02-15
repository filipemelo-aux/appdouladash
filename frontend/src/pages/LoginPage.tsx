
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { getProfile } from '../services/api';

const LoginPage: React.FC = () => {
  const navigate = ReactRouterDOM.useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    try {
      const profile = await getProfile();

      if (!profile.active) {
        await supabase.auth.signOut();
        setError('Conta desativada');
        setLoading(false);
        return;
      }

      if (profile.must_change_password) {
        navigate('/change-password', { replace: true });
      } else if (profile.role === 'client') {
        navigate('/client', { replace: true });
      } else if (profile.role === 'admin' || profile.role === 'assistant') {
        navigate('/dashboard', { replace: true });
      } else {
        await supabase.auth.signOut();
        setError('Role de usuário desconhecida. Contate o suporte.');
        setLoading(false);
      }
    } catch (apiError: any) {
      await supabase.auth.signOut();
      setError(apiError.message || 'Falha ao buscar perfil do usuário.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-10 space-y-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-brand-900">
            Entrar no Papo de Doula
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-brand-300 placeholder-gray-500 text-brand-900 rounded-t-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm"
                placeholder="Endereço de e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-brand-300 placeholder-gray-500 text-brand-900 rounded-b-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors duration-200 disabled:bg-brand-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
          
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
