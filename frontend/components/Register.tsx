import { InputField } from "./ui/InputField";
import { CustomButton } from "./ui/CustomButton";
import { useEffect, useState } from "react";
import { Shield, Loader2, User, Mail, Lock, Building } from "lucide-react";
import { getTenants, register } from "../services/api";
import { useRouter } from "next/navigation";

export default function RegisterForm({ page, setPage }: { page: string, setPage: (page: string) => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState("");
  const [tenantId, setTenantId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tenantList, setTenantList] = useState([]);

  useEffect(() => {
    const fetchTenants = async () => {
      const res = await getTenants();
      if (res.error) setError(res.error);
      else setTenantList(res.data);
    }
    fetchTenants();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords do not match!");
    if (name === "" || email === "" || password === "" || confirmPassword === "") return setError("Please fill in all fields!");
    setLoading(true);
    try {
      

      const res = await register(name, email, password, role, tenantId);
      if (res.error) throw new Error(res.error);
      else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Register failed!");
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
              Create Account
            </h1>
            <p className="text-slate-400 mb-4">
              Create an account
            </p>


            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <InputField required icon={User} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <InputField required icon={Mail} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <InputField required icon={Lock} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <InputField required icon={Lock} placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              {error && <p className="text-red-400">{error}</p>}
              <CustomButton type="submit" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Register"}</CustomButton>
              <div className="mt-2 text-sm flex items-center justify-center gap-2">
                <button onClick={() => setPage('login')} className="cursor-pointer text-slate-400 hover:text-slate-300">Back to Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}