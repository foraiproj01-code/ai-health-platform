import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api/axios";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  height: number;
  weight: number;
  role: string;
};

type BmiForm = {
  height: number;
  weight: number;
};

type HealthRecord = {
  id: number;
  height: number;
  weight: number;
  bmi: number;
  category: string;
  recommendation: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HealthRecord[]>([]);
  const [result, setResult] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(true);

  const { register, handleSubmit, reset } = useForm<BmiForm>();
  const latest = history[0];

  const loadData = async () => {
    try {
      const userRes = await api.get("/users/me");
      const historyRes = await api.get("/health/history");

      setUser(userRes.data);
      setHistory(historyRes.data);

      reset({
        height: userRes.data.height,
        weight: userRes.data.weight,
      });
    } catch {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (data: BmiForm) => {
    const res = await api.post("/health/calculate", {
      height: Number(data.height),
      weight: Number(data.weight),
    });

    setResult(res.data);
    await loadData();
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  const chartData = [...history].reverse().map((item) => ({
    date: new Date(item.createdAt).toLocaleDateString(),
    bmi: item.bmi,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-lg px-8 py-5 shadow-sm">
          <p className="text-slate-600 font-medium">Жүктөлүүдө...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {menuOpen && (
        <aside className="fixed left-0 top-0 z-30 h-screen w-72 bg-[#10201b] text-white border-r border-emerald-950/50">
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold">AI Health</h1>
                  <p className="text-xs text-emerald-100/70">
                    Clinical Platform
                  </p>
                </div>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                >
                  ✕
                </button>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              <MenuLink href="/dashboard" text="Dashboard" active />
              <MenuLink href="/nutrition-plan" text="Тамактануу планы" />
              <MenuLink href="/water-tracker" text="Суу трекер" />
              <MenuLink href="/workout-plan" text="Машыгуу планы" />
              <MenuLink href="/ai-recommendation" text="AI сунуш алуу" />
              <MenuLink href="/ai-chat" text="AI чат" />
            </nav>

            <div className="p-4 border-t border-white/10">
              <button
                onClick={logout}
                className="w-full rounded-lg bg-red-600 text-white px-4 py-3 font-bold hover:bg-red-700 transition"
              >
                Чыгуу
              </button>
            </div>
          </div>
        </aside>
      )}

      <main className={menuOpen ? "lg:ml-72" : ""}>
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
          <div className="px-5 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!menuOpen && (
                <button
                  onClick={() => setMenuOpen(true)}
                  className="rounded-lg bg-[#10201b] text-white px-4 py-2 text-sm font-semibold"
                >
                  Меню
                </button>
              )}

              <div>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  Health Management
                </p>
                <h2 className="text-2xl font-black">Саламаттык панели</h2>
              </div>
            </div>

            <div className="hidden md:block rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              {user?.email}
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8 space-y-6">
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-7">
                  <p className="text-sm text-slate-500">Кош келиңиз</p>

                  <h1 className="mt-2 text-3xl font-black">
                    {user?.firstName} {user?.lastName}
                  </h1>

                  <p className="mt-4 text-slate-600 leading-relaxed">
                    BMI анализ, ден соолук тарыхы, AI сунуштар, тамактануу
                    жана машыгуу пландары бир системада башкарылат.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <MiniStat title="Акыркы BMI" value={latest?.bmi ?? "-"} />
                    <MiniStat
                      title="Категория"
                      value={latest?.category ?? "-"}
                    />
                  </div>
                </div>

                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80"
                  alt="Medical analytics"
                  className="h-full min-h-[260px] w-full object-cover"
                />
              </div>
            </div>

            <div className="xl:col-span-4 bg-[#10201b] text-white rounded-xl p-7 shadow-sm">
              <p className="text-sm text-emerald-100/70">Health Summary</p>

              <h3 className="mt-3 text-xl font-bold">
                Күндүк ден соолук абалы
              </h3>

              <div className="mt-6 space-y-4">
                <SummaryRow
                  label="BMI статусу"
                  value={latest?.category ?? "Маалымат жок"}
                />
                <SummaryRow
                  label="Акыркы BMI"
                  value={latest?.bmi?.toString() ?? "-"}
                />
                <SummaryRow
                  label="Жазуулар саны"
                  value={history.length.toString()}
                />
              </div>

              <p className="mt-6 text-sm text-emerald-50/80 leading-relaxed">
                {latest
                  ? latest.recommendation
                  : "BMI эсептеп, ден соолук көрсөткүчтөрүңүздү көзөмөлдөй баштаңыз."}
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <Metric title="Жашы" value={user?.age ?? "-"} unit="жаш" />
            <Metric title="Бою" value={user?.height ?? "-"} unit="см" />
            <Metric title="Салмагы" value={user?.weight ?? "-"} unit="кг" />
            <Metric title="BMI жазуулар" value={history.length} unit="жалпы" />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-4 space-y-6">
              <Card title="Колдонуучу профили">
                <Info label="Email" value={user?.email ?? "-"} />
                <Info label="Роль" value={user?.role ?? "-"} />
                <Info label="Статус" value="Активдүү" />
              </Card>

              <Card title="Ыкчам бөлүмдөр">
                <Quick href="/nutrition-plan" text="Тамактануу планы" />
                <Quick href="/workout-plan" text="Машыгуу планы" />
                <Quick href="/water-tracker" text="Суу трекер" />
                <Quick href="/ai-recommendation" text="AI сунуш алуу" />
              </Card>
            </div>

            <div className="xl:col-span-8 space-y-6">
              <Card title="BMI эсептөө">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <input
                    type="number"
                    placeholder="Бою, см"
                    {...register("height", { required: true })}
                    className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                  />

                  <input
                    type="number"
                    placeholder="Салмагы, кг"
                    {...register("weight", { required: true })}
                    className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                  />

                  <button className="rounded-lg bg-[#10201b] text-white font-bold hover:bg-emerald-950">
                    Эсептөө
                  </button>
                </form>
              </Card>

              {result && (
                <Card title="Жыйынтык">
                  <div className="flex items-end gap-3">
                    <h2 className="text-5xl font-black text-emerald-700">
                      {result.bmi}
                    </h2>

                    <p className="pb-2 font-semibold text-slate-600">
                      {result.category}
                    </p>
                  </div>

                  <p className="mt-4 rounded-lg bg-emerald-50 text-emerald-900 p-4">
                    {result.recommendation}
                  </p>
                </Card>
              )}

              <Card title="BMI динамикасы">
                <div className="h-80">
                  {history.length === 0 ? (
                    <div className="h-full rounded-lg bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center">
                      <p className="text-slate-500">
                        График үчүн маалымат жок.
                      </p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="bmi"
                          stroke="#047857"
                          strokeWidth={3}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </Card>

              <Card title="BMI тарыхы">
                <div className="space-y-3">
                  {history.length === 0 && (
                    <p className="text-slate-500">Азырынча тарых жок.</p>
                  )}

                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex justify-between gap-4"
                    >
                      <div>
                        <p className="font-bold">
                          BMI: {item.bmi} — {item.category}
                        </p>

                        <p className="text-sm text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right text-sm text-slate-500">
                        <p>{item.height} см</p>
                        <p>{item.weight} кг</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function MenuLink({
  href,
  text,
  active,
}: {
  href: string;
  text: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`block rounded-lg px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-white text-[#10201b]"
          : "text-emerald-50/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      {text}
    </a>
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

function Metric({
  title,
  value,
  unit,
}: {
  title: string;
  value: string | number;
  unit: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>

      <div className="mt-3 flex items-end gap-2">
        <h3 className="text-3xl font-black">{value}</h3>
        <span className="pb-1 text-sm text-slate-400">{unit}</span>
      </div>
    </div>
  );
}

function MiniStat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-2 text-xl font-black">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-right">{value}</span>
    </div>
  );
}

function Quick({ href, text }: { href: string; text: string }) {
  return (
    <a
      href={href}
      className="mb-3 flex justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-semibold hover:bg-slate-100"
    >
      {text}
      <span>→</span>
    </a>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0">
      <span className="text-sm text-emerald-50/70">{label}</span>
      <span className="text-sm font-bold text-white text-right">{value}</span>
    </div>
  );
}