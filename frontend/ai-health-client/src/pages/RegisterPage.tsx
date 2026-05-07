import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

type RegisterForm = {
  firstName: string;
  lastName: string;
  age: number;
  height: number;
  weight: number;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError("");

      await api.post("/auth/register", {
        ...data,
        age: Number(data.age),
        height: Number(data.height),
        weight: Number(data.weight),
      });

      navigate("/");
    } catch {
      setError("Каттоо учурунда ката кетти");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white">
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-600 to-sky-600 text-white">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
              AI
            </div>

            <h1 className="mt-10 text-4xl font-bold leading-tight">
              Саламаттык профилиңизди түзүңүз
            </h1>

            <p className="mt-5 text-emerald-50 text-lg leading-relaxed">
              Каттоодон өтүп, BMI анализ, AI сунуштар жана жеке саламаттык
              көзөмөлүн баштаңыз.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl bg-white/15 p-4">
              <p className="font-semibold">Жеке профиль</p>
              <p className="text-emerald-50 mt-1">Бою, салмагы, жашы</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4">
              <p className="font-semibold">AI анализ</p>
              <p className="text-emerald-50 mt-1">Так сунуштар</p>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12 flex items-center">
          <div className="w-full max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900">
              Катталуу
            </h2>

            <p className="mt-2 text-slate-500">
              Маалыматтарыңызды киргизип, аккаунт түзүңүз.
            </p>

            {error && (
              <div className="mt-5 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                placeholder="Аты"
                {...register("firstName", { required: true })}
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                placeholder="Фамилиясы"
                {...register("lastName", { required: true })}
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                type="number"
                placeholder="Жашы"
                {...register("age", { required: true })}
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                type="number"
                placeholder="Бою, см"
                {...register("height", { required: true })}
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                type="number"
                placeholder="Салмагы, кг"
                {...register("weight", { required: true })}
              />

              <input
                className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
              />

              <input
                className="md:col-span-2 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                type="password"
                placeholder="Пароль"
                {...register("password", { required: true })}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="md:col-span-2 rounded-xl bg-emerald-600 py-3 text-white font-semibold hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 disabled:opacity-60"
              >
                {isSubmitting ? "Катталууда..." : "Катталуу"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Аккаунтуңуз барбы?{" "}
              <Link
                to="/"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Кирүү
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}