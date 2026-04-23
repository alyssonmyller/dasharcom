'use client';

import Link from 'next/link';
import { AlertTriangleIcon } from 'lucide-react';

export default function AuthError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-8 text-center">
          <AlertTriangleIcon className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Acesso Negado</h1>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <p className="text-gray-600 mb-4">
            Sua conta de email não está autorizada para acessar este dashboard.
          </p>
          
          <Link
            href="/auth/signin"
            className="inline-block bg-[#1B4D3E] hover:bg-[#0f2f26] text-white font-bold py-2 px-6 rounded-lg transition-all"
          >
            Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  );
}
