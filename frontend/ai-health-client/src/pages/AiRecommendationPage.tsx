import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import api from "../api/axios";

type FormData = {
  goal: string;
  activityLevel: string;
};

type AiResponse = {
  user: string;
  goal: string;
  activityLevel: string;
  recommendation: string;
};

export default function AiRecommendationPage() {
  const [result, setResult] = useState<AiResponse | null>(null);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      const response = await api.post("/health/ai-recommendation", data);
      setResult(response.data);
    } catch {
      setError("AI сунуш алуу учурунда ката кетти");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
              AI Recommendation
            </p>
            <h1 className="text-2xl font-black">AI саламаттык сунушу</h1>
          </div>

          <Link
            to="/dashboard"
            className="rounded-lg bg-[#10201b] text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-950"
          >
            Башкы бет
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-5 md:p-8 space-y-6">
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-7">
                <p className="text-sm text-slate-500">
                  Жекелештирилген анализ
                </p>

                <h2 className="mt-2 text-3xl font-black leading-tight">
                  Максатыңызга ылайык AI кеңеш алыңыз
                </h2>

                <p className="mt-4 text-slate-600 leading-relaxed">
                  Бул модуль максатыңызга жана активдүүлүк деңгээлиңизге
                  жараша саламаттык боюнча маалыматтык сунуштарды түзөт.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MiniStat title="Модуль" value="AI Health" />
                  <MiniStat title="Фокус" value="Wellness" />
                </div>
              </div>

              <img
                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=900&q=80"
                alt="Health recommendation"
                className="h-full min-h-[260px] w-full object-cover"
              />
            </div>
          </div>

          <div className="xl:col-span-4 rounded-xl bg-[#10201b] text-white p-7 shadow-sm">
            <p className="text-sm text-emerald-100/70">
              Recommendation Engine
            </p>

            <h3 className="mt-3 text-xl font-bold">
              Сунуш кантип түзүлөт?
            </h3>

            <div className="mt-6 space-y-4">
              <InfoLine label="1" value="Максат тандалат" />
              <InfoLine label="2" value="Активдүүлүк бааланат" />
              <InfoLine label="3" value="AI сунуш түзүлөт" />
            </div>

            <p className="mt-6 text-sm text-emerald-50/80 leading-relaxed">
              Эскертүү: бул медициналык диагноз эмес. Олуттуу белгилер болсо,
              дарыгерге кайрылыңыз.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5">
            <Card title="Маалымат киргизүү">
              {error && (
                <div className="mb-5 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label
                    htmlFor="goal"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Максат
                  </label>

                  <select
                    id="goal"
                    {...register("goal", { required: true })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                  >
                    <option value="">Тандаңыз</option>
                    <option value="Арыктоо">Арыктоо</option>
                    <option value="Салмак кошуу">Салмак кошуу</option>
                    <option value="Сергек жашоо">Сергек жашоо</option>
                    <option value="Булчуң көбөйтүү">Булчуң көбөйтүү</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="activityLevel"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Активдүүлүк деңгээли
                  </label>

                  <select
                    id="activityLevel"
                    {...register("activityLevel", { required: true })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                  >
                    <option value="">Тандаңыз</option>
                    <option value="Төмөн">Төмөн</option>
                    <option value="Орточо">Орточо</option>
                    <option value="Жогорку">Жогорку</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-[#10201b] text-white py-3 font-bold hover:bg-emerald-950 disabled:opacity-60"
                >
                  {isSubmitting ? "AI анализ кылууда..." : "AI сунуш алуу"}
                </button>
              </form>
            </Card>
          </div>

          <div className="xl:col-span-7">
            <Card title="AI сунуш жыйынтыгы">
              {!result ? (
                <div className="min-h-[360px] rounded-lg bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center p-6">
                  <div className="text-center max-w-md">
                    <p className="text-lg font-bold text-slate-700">
                      Азырынча сунуш жок
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Максат жана активдүүлүк деңгээлин тандап, AI сунуш алыңыз.
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MiniStat title="Максат" value={result.goal} />
                    <MiniStat
                      title="Активдүүлүк"
                      value={result.activityLevel}
                    />
                  </div>

                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-5">
                    <p className="text-xs font-bold text-emerald-700 uppercase">
                      AI сунуш
                    </p>

                    <div className="mt-3 whitespace-pre-line text-slate-800 leading-relaxed">
                      {result.recommendation}
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

function MiniStat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-2 text-lg font-black">{value}</p>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
      <span className="text-sm text-emerald-50/70">{label}</span>
      <span className="text-sm font-bold text-white text-right">{value}</span>
    </div>
  );
}