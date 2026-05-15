import { useState } from "react";
import api from "../api/axios";

type WorkoutDay = {
  day: string;
  title: string;
  duration: string;
  exercises: string[];
};

type WorkoutResult = {
  user: string;
  goal: string;
  level: string;
  daysPerWeek: number;
  bmiInfo: string;
  recommendation: string;
  plan: WorkoutDay[];
};

export default function WorkoutPlanPage() {
  const [goal, setGoal] = useState("Арыктоо");
  const [level, setLevel] = useState("Башталгыч");
  const [daysPerWeek, setDaysPerWeek] = useState(3);

  const [result, setResult] = useState<WorkoutResult | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    try {
      setLoading(true);

      const response = await api.post("/health/workout-plan", {
        goal,
        level,
        daysPerWeek: Number(daysPerWeek),
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Планды түзүүдө ката кетти");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
              Workout Planner
            </p>

            <h1 className="text-2xl font-black">
              AI Машыгуу Планы
            </h1>
          </div>

          <a
            href="/dashboard"
            className="rounded-lg bg-[#10201b] text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-950"
          >
            Dashboard
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-5 md:p-8 space-y-6">
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-7">
                <p className="text-sm text-slate-500">
                  AI Workout System
                </p>

                <h2 className="mt-2 text-3xl font-black leading-tight">
                  Максатыңызга ылайык машыгуу планы
                </h2>

                <p className="mt-4 text-slate-600 leading-relaxed">
                  AI сиздин деңгээлиңизге жана максатыңызга жараша
                  жумалык машыгуу программасын түзөт.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MiniStat title="Фокус" value="Workout AI" />
                  <MiniStat title="Категория" value="Fitness" />
                </div>
              </div>

              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80"
                alt="Workout"
                className="h-full min-h-[260px] w-full object-cover"
              />
            </div>
          </div>

          <div className="xl:col-span-4 rounded-xl bg-[#10201b] text-white p-7 shadow-sm">
            <p className="text-sm text-emerald-100/70">
              Workout Summary
            </p>

            <h3 className="mt-3 text-xl font-bold">
              Машыгуу анализи
            </h3>

            <div className="mt-6 space-y-4">
              <InfoLine label="Максат" value={goal} />
              <InfoLine label="Деңгээл" value={level} />
              <InfoLine
                label="Апталык күн"
                value={`${daysPerWeek} күн`}
              />
            </div>

            <p className="mt-6 text-sm text-emerald-50/80 leading-relaxed">
              Туура машыгуу режими салмакты көзөмөлдөөгө,
              чыдамкайлыкты жана жалпы ден соолукту жакшыртууга жардам берет.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5">
            <Card title="Планды түзүү">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="goal"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Максат
                  </label>

                  <select
                    id="goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                  >
                    <option>Арыктоо</option>
                    <option>Булчуң көбөйтүү</option>
                    <option>Чыдамкайлык</option>
                    <option>Жалпы ден соолук</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="level"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Деңгээл
                  </label>

                  <select
                    id="level"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                  >
                    <option>Башталгыч</option>
                    <option>Орточо</option>
                    <option>Жогорку</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="days"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Аптасына күн саны
                  </label>

                  <input
                    id="days"
                    type="number"
                    min={1}
                    max={7}
                    value={daysPerWeek}
                    onChange={(e) =>
                      setDaysPerWeek(Number(e.target.value))
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                  />
                </div>

                <button
                  onClick={generatePlan}
                  disabled={loading}
                  className="w-full rounded-lg bg-[#10201b] py-3 font-bold text-white hover:bg-emerald-950 disabled:opacity-60"
                >
                  {loading ? "Түзүлүүдө..." : "План түзүү"}
                </button>
              </div>
            </Card>
          </div>

          <div className="xl:col-span-7 space-y-6">
            {!result ? (
              <Card title="Workout Result">
                <div className="min-h-[300px] rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-700">
                      Азырынча план жок
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Маалыматтарды киргизип, AI план түзүңүз.
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <>
                <Card title="Жалпы маалымат">
                  <div>
                    <p className="text-sm text-slate-500">
                      Колдонуучу
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      {result.user}
                    </h2>
                  </div>

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MiniStat title="Максат" value={result.goal} />
                    <MiniStat title="Деңгээл" value={result.level} />
                    <MiniStat
                      title="Күн саны"
                      value={`${result.daysPerWeek} күн`}
                    />
                  </div>

                  <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-600">
                      {result.bmiInfo}
                    </p>
                  </div>

                  <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-5">
                    <p className="text-xs font-bold uppercase text-emerald-700">
                      AI Recommendation
                    </p>

                    <div className="mt-3 text-slate-800 leading-relaxed">
                      {result.recommendation}
                    </div>
                  </div>
                </Card>

                {result.plan.map((item) => (
                  <Card key={item.day} title={item.day}>
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-black">
                        {item.title}
                      </h3>

                      <span className="rounded-lg bg-emerald-100 text-emerald-700 px-4 py-2 text-sm font-bold">
                        {item.duration}
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      {item.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700"
                        >
                          {exercise}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </>
            )}
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
      <span className="text-sm text-emerald-50/70">
        {label}
      </span>

      <span className="text-sm font-bold text-white">
        {value}
      </span>
    </div>
  );
}