'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Se já está autenticado, redireciona para home
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      console.log('✓ Usuário autenticado:', session.user.email);
      router.push('/');
    }
  }, [status, session, router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Iniciando login com Google...');
    try {
      const result = await signIn('google', { 
        redirect: true,
        callbackUrl: '/'
      });
      
      if (result?.error) {
        console.error('Erro no login:', result.error);
        setError('Acesso negado. Verifique se você está usando um email autorizado.');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Exceção:', err);
      setError('Erro ao fazer login. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B4D3E] to-[#0f2f26] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#1B4D3E] text-white p-8 text-center">
          <h1 className="text-4xl font-black tracking-tighter">DASH ARCOM</h1>
          <p className="text-blue-200 text-sm mt-2">Dashboard Tecnologia</p>
          <p className="text-xs text-blue-100 mt-4 border-t border-white/20 pt-4">Acesso Restrito - Autenticação com Google</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-2">Bem-vindo!</p>
            <p className="text-sm text-gray-500">
              Entre com sua conta Google para acessar o dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full bg-[#1B4D3E] hover:bg-[#0f2f26] text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Autenticando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </>
            )}
          </button>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-gray-600">
            <p className="font-semibold text-[#1B4D3E] mb-2">Emails Autorizados:</p>
            <ul className="space-y-1">
              <li>• alysson@arcom.com.br</li>
              <li>• cleber@arcom.com.br</li>
            </ul>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6 border-t pt-4">
            Uso Interno - Não Compartilhar
          </p>
        </div>
      </div>
    </div>
  );
}
