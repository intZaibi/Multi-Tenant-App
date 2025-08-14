import { Shield, Mail, Lock, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { InputField } from '@/components/ui/InputField';
import { CustomButton } from '@/components/ui/CustomButton';
import { login } from '@/services/api';
import { useRouter } from 'next/navigation';

const LoginForm = ({ page, setPage }: { page: string, setPage: (page: string) => void }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      if (res.error) throw new Error(res.error);
      else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (  
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%239C92AC&quot; fill-opacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;1&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      <div className="relative w-full max-w-md">
        <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-400 mb-4">
              Login to your account
            </p>


            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <InputField required icon={Mail} placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <InputField required icon={Lock} placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              {error && <p className="text-red-400">{error}</p>}
              <CustomButton type="submit" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}</CustomButton>
            
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Demo Credentials:
                </p>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-500 space-y-1">
                  <p>Super Admin: superadmin@example.com / superadmin123</p>
                  <p>Admin: admin@sample.com / admin123</p>
                  <p>Manager: manager@sample.com / manager123</p>
                  <p>User: user@sample.com / user123</p>
                </div>
              </div>
            </form>

            <div className="mt-2 text-lg flex items-center justify-center gap-2">
              <button onClick={() => setPage('register')} className="cursor-pointer text-slate-400 hover:text-slate-300">Create Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};








export default LoginForm;