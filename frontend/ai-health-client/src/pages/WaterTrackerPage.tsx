import { useEffect, useState } from "react";

type WaterToday = {
  totalMl: number;
  goalMl: number;
  percent: number;
};

type WaterLog = {
  id: number;
  amountMl: number;
  createdAt: string;
};

export default function WaterTrackerPage() {
  const [today, setToday] = useState<WaterToday | null>(null);
  const [history, setHistory] = useState<WaterLog[]>([]);
  const [amountMl, setAmountMl] = useState(250);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  const fetchData = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [todayRes, historyRes] = await Promise.all([
      fetch("http://localhost:5000/api/water/today", { headers }),
      fetch("http://localhost:5000/api/water/history", { headers }),
    ]);

    setToday(await todayRes.json());
    setHistory(await historyRes.json());
  };

  const addWater = async () => {
    try {
      setLoading(true);

      await fetch("http://localhost:5000/api/water/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amountMl }),
      });

      await fetchData();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
              Water Tracker
            </p>

            <h1 className="text-2xl font-black">
              Суу көзөмөлдөө системасы
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
                  Daily Hydration
                </p>

                <h2 className="mt-2 text-3xl font-black leading-tight">
                  Күнүмдүк суу балансын көзөмөлдөңүз
                </h2>

                <p className="mt-4 text-slate-600 leading-relaxed">
                  Суу ичүү организмиңиздин энергиясына, зат алмашуусуна
                  жана жалпы ден соолукка түз таасир берет.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MiniStat
                    title="Ичилген суу"
                    value={`${today?.totalMl ?? 0} мл`}
                  />

                  <MiniStat
                    title="Максат"
                    value={`${today?.goalMl ?? 2000} мл`}
                  />
                </div>
              </div>

              <img
                src="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80"
                alt="Water"
                className="h-full min-h-[260px] w-full object-cover"
              />
            </div>
          </div>

          <div className="xl:col-span-4 rounded-xl bg-[#10201b] text-white p-7 shadow-sm">
            <p className="text-sm text-emerald-100/70">
              Hydration Summary
            </p>

            <h3 className="mt-3 text-xl font-bold">
              Бүгүнкү прогресс
            </h3>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>{today?.percent ?? 0}%</span>
                <span>аткарылды</span>
              </div>

              <div className="h-4 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${today?.percent ?? 0}%` }}
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <InfoLine
                label="Жалпы суу"
                value={`${today?.totalMl ?? 0} мл`}
              />

              <InfoLine
                label="Күндүк максат"
                value={`${today?.goalMl ?? 2000} мл`}
              />

              <InfoLine
                label="Прогресс"
                value={`${today?.percent ?? 0}%`}
              />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5">
            <Card title="Суу кошуу">
              <input
                type="number"
                value={amountMl}
                onChange={(e) => setAmountMl(Number(e.target.value))}
                placeholder="Суу көлөмү"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
              />

              <div className="grid grid-cols-3 gap-3 mt-4">
                {[200, 250, 500].map((value) => (
                  <button
                    key={value}
                    onClick={() => setAmountMl(value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 py-3 font-semibold hover:bg-slate-100"
                  >
                    {value} мл
                  </button>
                ))}
              </div>

              <button
                onClick={addWater}
                disabled={loading}
                className="w-full mt-5 rounded-lg bg-[#10201b] py-3 font-bold text-white hover:bg-emerald-950 disabled:opacity-60"
              >
                {loading ? "Кошулууда..." : "Суу кошуу"}
              </button>
            </Card>
          </div>

          <div className="xl:col-span-7">
            <Card title="Акыркы жазуулар">
              {history.length === 0 ? (
                <div className="min-h-[250px] rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                  <p className="text-slate-500">
                    Азырынча жазуу жок.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-4"
                    >
                      <div>
                        <p className="font-bold">
                          {item.amountMl} мл
                        </p>

                        <p className="text-sm text-slate-500">
                          Суу кошулду
                        </p>
                      </div>

                      <span className="text-sm text-slate-500">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
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
  value: string;
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