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

  const [buttonOffset, setButtonOffset] = useState({
    x: 0,
    y: 0,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<LoginForm>();

  const email = watch("email");
  const password = watch("password");

  const canLogin = Boolean(
    email?.trim() && password?.trim()
  );

  const moveButton = () => {
    if (canLogin) return;

    const x = Math.floor(Math.random() * 260) - 130;
    const y = Math.floor(Math.random() * 120) - 60;

    setButtonOffset({ x, y });
  };

  const onSubmit = async (data: LoginForm) => {
    if (!canLogin) return;

    try {
      setError("");

      const response = await api.post("/auth/login", data);

      localStorage.setItem(
        "accessToken",
        response.data.accessToken
      );

      navigate("/dashboard");
    } catch {
      setError("Email же пароль туура эмес");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 grid grid-cols-1 lg:grid-cols-2">
      <section className="hidden lg:block relative bg-[#10201b]">
        <img
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
          alt="Medical"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-[#10201b]/75" />

        <div className="relative z-10 h-full p-12 flex flex-col justify-between text-white">
          <div>
            <h1 className="text-3xl font-black">
              AI Health Platform
            </h1>

            <p className="mt-2 text-sm text-emerald-50/80">
              Clinical health system
            </p>
          </div>

          <div>
            <h2 className="max-w-lg text-4xl font-black leading-tight">
              AI аркылуу саламаттык көрсөткүчтөрүңүздү көзөмөлдөңүз.
            </h2>

            <p className="mt-5 max-w-md text-emerald-50/80">
              BMI анализ, AI сунуштар, тамактануу жана
              машыгуу пландары.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-sm overflow-hidden">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
            Login
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Кош келиңиз
          </h2>

          <p className="mt-3 text-sm text-slate-500">
            Аккаунтуңузга кирип, саламаттык анализин
            баштаңыз.
          </p>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: true })}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
            />

            <input
              type="password"
              placeholder="Пароль"
              {...register("password", { required: true })}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
            />

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Паролду унуттуңузбу?
              </Link>
            </div>

            <div className="relative h-32 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <button
                type="button"
                onMouseEnter={moveButton}
                onMouseMove={moveButton}
                onClick={() => {
                  if (canLogin) {
                    handleSubmit(onSubmit)();
                  } else {
                    moveButton();
                  }
                }}
                style={{
                  left: "50%",
                  top: "50%",
                  transform: canLogin
                    ? "translate(-50%, -50%)"
                    : `translate(calc(-50% + ${buttonOffset.x}px), calc(-50% + ${buttonOffset.y}px))`,
                }}
                className="absolute rounded-lg bg-[#10201b] px-8 py-2.5 text-sm font-bold text-white transition-all duration-75 select-none"
              >
                {isSubmitting ? "Кирүүдө..." : "Кирүү"}
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Аккаунтуңуз жокпу?{" "}
            <Link
              to="/register"
              className="font-bold text-emerald-700"
            >
              Катталуу
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}