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
    <div className="min-h-screen bg-slate-50 grid grid-cols-1 lg:grid-cols-2">
      <section className="hidden lg:block relative bg-[#10201b]">
        <img
          src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80"
          alt="Health registration"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-[#10201b]/75" />

        <div className="relative z-10 h-full p-12 flex flex-col justify-between text-white">
          <div>
            <h1 className="text-3xl font-black">
              AI Health Platform
            </h1>

            <p className="mt-2 text-sm text-emerald-50/80">
              Smart clinical wellness system
            </p>
          </div>

          <div>
            <h2 className="max-w-lg text-4xl font-black leading-tight">
              Жеке саламаттык профилиңизди түзүңүз.
            </h2>

            <p className="mt-5 max-w-md text-emerald-50/80">
              BMI анализ, AI сунуштар жана жеке саламаттык
              мониторинг системасына кошулуңуз.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
            Register
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Катталуу
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Маалыматтарыңызды киргизип, аккаунт түзүңүз.
          </p>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Input
              placeholder="Аты"
              register={register("firstName", { required: true })}
            />

            <Input
              placeholder="Фамилиясы"
              register={register("lastName", { required: true })}
            />

            <Input
              type="number"
              placeholder="Жашы"
              register={register("age", { required: true })}
            />

            <Input
              type="number"
              placeholder="Бою, см"
              register={register("height", { required: true })}
            />

            <Input
              type="number"
              placeholder="Салмагы, кг"
              register={register("weight", { required: true })}
            />

            <Input
              type="email"
              placeholder="Email"
              register={register("email", { required: true })}
            />

            <div className="md:col-span-2">
              <Input
                type="password"
                placeholder="Пароль"
                register={register("password", { required: true })}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="md:col-span-2 rounded-lg bg-[#10201b] py-3 font-bold text-white hover:bg-emerald-950 disabled:opacity-60"
            >
              {isSubmitting ? "Катталууда..." : "Катталуу"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Аккаунтуңуз барбы?{" "}
            <Link
              to="/"
              className="font-bold text-emerald-700 hover:text-emerald-900"
            >
              Кирүү
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function Input({
  placeholder,
  type = "text",
  register,
}: {
  placeholder: string;
  type?: string;
  register: any;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      {...register}
      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
    />
  );
}