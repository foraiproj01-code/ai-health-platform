import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      setMessage(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || "Ката кетти");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 grid grid-cols-1 lg:grid-cols-2">
      <section className="hidden lg:block relative bg-[#10201b]">
        <img
          src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80"
          alt="Password security"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-[#10201b]/75" />

        <div className="relative z-10 h-full p-12 flex flex-col justify-between text-white">
          <div>
            <h1 className="text-3xl font-black">AI Health Platform</h1>
            <p className="mt-2 text-sm text-emerald-50/80">
              Secure password reset
            </p>
          </div>

          <div>
            <h2 className="max-w-lg text-4xl font-black leading-tight">
              Аккаунтуңуз үчүн жаңы коопсуз пароль коюңуз.
            </h2>

            <p className="mt-5 max-w-md text-emerald-50/80">
              Пароль кеминде 6 белгиден турушу керек.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
            Reset Password
          </p>

          <h1 className="mt-2 text-3xl font-black">Жаңы пароль коюу</h1>

          <p className="mt-3 text-sm text-slate-500">
            Аккаунтуңуз үчүн жаңы пароль киргизиңиз.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              type="password"
              placeholder="Жаңы пароль"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-[#10201b] py-3 font-bold text-white hover:bg-emerald-950"
            >
              Паролду өзгөртүү
            </button>
          </form>

          {message && (
            <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">{message}</p>

              <a href="/" className="mt-3 inline-block font-bold underline">
                Кирүү барагына өтүү
              </a>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}