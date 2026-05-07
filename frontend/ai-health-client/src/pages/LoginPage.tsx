import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setError("");

      const response = await api.post("/auth/login", data);

      localStorage.setItem("accessToken", response.data.accessToken);

      navigate("/dashboard");
    } catch {
      setError("Email же пароль туура эмес");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white">
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-600 to-sky-600 text-white">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
              AI
            </div>

            <h1 className="mt-10 text-4xl font-bold leading-tight">
              AI Health Platform
            </h1>

            <p className="mt-5 text-emerald-50 text-lg leading-relaxed">
              Жасалма интеллект аркылуу BMI анализ, саламаттык сунуштары,
              тамактануу жана машыгуу пландары.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl bg-white/15 p-4">
              <p className="font-semibold">BMI анализ</p>
              <p className="text-emerald-50 mt-1">Автоматтык эсептөө</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4">
              <p className="font-semibold">AI сунуш</p>
              <p className="text-emerald-50 mt-1">Жекелештирилген кеңеш</p>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="lg:hidden mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                AI
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900">
              Кош келиңиз
            </h2>

            <p className="mt-2 text-slate-500">
              Аккаунтуңузга кирип, саламаттык анализин баштаңыз.
            </p>

            {error && (
              <div className="mt-5 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  {...register("email", { required: true })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Пароль
                </label>
                <input
                  type="password"
                  placeholder="Паролуңузду жазыңыз"
                  {...register("password", { required: true })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 disabled:opacity-60"
              >
                {isSubmitting ? "Кирүүдө..." : "Кирүү"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Аккаунтуңуз жокпу?{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Катталуу
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}