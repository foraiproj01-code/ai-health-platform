import { useState } from "react";
import api from "../api/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setResetToken("");

    try {
      const response = await api.post("/auth/forgot-password", { email });

      setMessage(response.data.message);
      setResetToken(response.data.resetToken);
    } catch (err: any) {
      setError(err.response?.data?.message || "Ката кетти");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="hidden lg:block relative overflow-hidden bg-[#10201b]">
          <img
            src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80"
            alt="Medical security"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />

          <div className="absolute inset-0 bg-[#10201b]/70" />

          <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
            <div>
              <h1 className="text-3xl font-black">AI Health Platform</h1>
              <p className="mt-2 text-sm text-emerald-50/80">
                Account Recovery
              </p>
            </div>

            <div>
              <p className="text-sm text-emerald-100/80">
                Коопсуз кирүү мүмкүнчүлүгүн калыбына келтирүү
              </p>

              <h2 className="mt-4 max-w-lg text-4xl font-black leading-tight">
                Аккаунтуңузга кайра кирүү үчүн email дарегиңизди тастыктаңыз.
              </h2>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10">
          <div className="w-full max-w-md">
            <a
              href="/"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
            >
              ← Кирүү барагына кайтуу
            </a>

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                Password Recovery
              </p>

              <h1 className="mt-2 text-3xl font-black">
                Паролду калыбына келтирүү
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Катталган email дарегиңизди киргизиңиз. Система паролду
                өзгөртүү үчүн шилтеме же токен даярдайт.
              </p>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="recovery-email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email дарек
                  </label>

                  <input
                    id="recovery-email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#10201b] py-3 font-bold text-white hover:bg-emerald-950"
                >
                  Калыбына келтирүү
                </button>
              </form>

              {message && (
                <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <p className="font-semibold">{message}</p>

                  {resetToken && (
                    <a
                      href={`/reset-password/${resetToken}`}
                      className="mt-3 inline-block font-bold underline"
                    >
                      Паролду өзгөртүү барагына өтүү
                    </a>
                  )}
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Эскертүү: бул функция development режиминде reset tokenди
              экранда көрсөтүшү мүмкүн. Production режиминде токен email
              аркылуу жөнөтүлөт.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}