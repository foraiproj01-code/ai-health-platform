import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import api from "../api/axios";

type NutritionForm = {
  goal: string;
  dailyCalories: number;
  mealsPerDay: number;
};

type NutritionResponse = {
  user: string;
  goal: string;
  dailyCalories: number;
  mealsPerDay: number;
  nutritionPlan: string;
};

export default function NutritionPlanPage() {
  const [result, setResult] = useState<NutritionResponse | null>(null);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NutritionForm>();

  const onSubmit = async (data: NutritionForm) => {
    try {
      setError("");

      const response = await api.post("/health/nutrition-plan", {
        goal: data.goal,
        dailyCalories: Number(data.dailyCalories),
        mealsPerDay: Number(data.mealsPerDay),
      });

      setResult(response.data);
    } catch {
      setError("Тамактануу планын түзүүдө ката кетти");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
              Nutrition Planner
            </p>

            <h1 className="text-2xl font-black">
              AI Тамактануу Планы
            </h1>
          </div>

          <Link
            to="/dashboard"
            className="rounded-lg bg-[#10201b] text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-950"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-5 md:p-8 space-y-6">
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-7">
                <p className="text-sm text-slate-500">
                  AI Nutrition System
                </p>

                <h2 className="mt-2 text-3xl font-black leading-tight">
                  Максатыңызга ылайык тамактануу планы
                </h2>

                <p className="mt-4 text-slate-600 leading-relaxed">
                  AI сиздин максатыңызга жараша күнүмдүк рацион боюнча
                  маалыматтык сунуштарды түзөт.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MiniStat title="Фокус" value="Nutrition" />
                  <MiniStat title="AI модуль" value="Planner" />
                </div>
              </div>

              <img
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=900&q=80"
                alt="Nutrition"
                className="h-full min-h-[260px] w-full object-cover"
              />
            </div>
          </div>

          <div className="xl:col-span-4 rounded-xl bg-[#10201b] text-white p-7 shadow-sm">
            <p className="text-sm text-emerald-100/70">
              Nutrition Summary
            </p>

            <h3 className="mt-3 text-xl font-bold">
              Тамактануу анализи
            </h3>

            <div className="mt-6 space-y-4">
              <InfoLine label="Категория" value="Nutrition AI" />
              <InfoLine label="Максат" value="Wellness" />
              <InfoLine label="Статус" value="Активдүү" />
            </div>

            <p className="mt-6 text-sm text-emerald-50/80 leading-relaxed">
              Система күнүмдүк калория жана тамактануу режимине жараша
              рацион сунуштайт.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5">
            <Card title="Маалымат киргизүү">
              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <select
                  {...register("goal", { required: true })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                >
                  <option value="">Максат</option>
                  <option value="Арыктоо">Арыктоо</option>
                  <option value="Салмак кошуу">Салмак кошуу</option>
                  <option value="Булчуң көбөйтүү">Булчуң көбөйтүү</option>
                  <option value="Сергек жашоо">Сергек жашоо</option>
                </select>

                <input
                  type="number"
                  placeholder="Күнүмдүк калория"
                  {...register("dailyCalories", { required: true })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                />

                <select
                  {...register("mealsPerDay", { required: true })}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                >
                  <option value="">Тамак саны</option>
                  <option value="3">3 маал</option>
                  <option value="4">4 маал</option>
                  <option value="5">5 маал</option>
                </select>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-[#10201b] py-3 font-bold text-white hover:bg-emerald-950 disabled:opacity-60"
                >
                  {isSubmitting
                    ? "AI анализ кылууда..."
                    : "План түзүү"}
                </button>
              </form>
            </Card>
          </div>

          <div className="xl:col-span-7">
            <Card title="AI Nutrition Result">
              {!result ? (
                <div className="min-h-[350px] rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-700">
                      Азырынча жыйынтык жок
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Маалымат киргизип, AI план түзүңүз.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm text-slate-500">Колдонуучу</p>

                    <h2 className="mt-1 text-2xl font-black">
                      {result.user}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MiniStat title="Максат" value={result.goal} />
                    <MiniStat
                      title="Калория"
                      value={result.dailyCalories}
                    />
                    <MiniStat
                      title="Тамак саны"
                      value={result.mealsPerDay}
                    />
                  </div>

                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-5">
                    <p className="text-xs font-bold uppercase text-emerald-700">
                      AI Nutrition Plan
                    </p>

                    <div className="mt-3 whitespace-pre-line text-slate-800 leading-relaxed">
                      {result.nutritionPlan}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-black mb-5">{title}</h3>
      {children}
    </div>
  );
}

function MiniStat({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-2 text-lg font-black">{value}</p>
    </div>
  );
}

function InfoLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
      <span className="text-sm text-emerald-50/70">{label}</span>
      <span className="text-sm font-bold text-white text-right">
        {value}
      </span>
    </div>
  );
}