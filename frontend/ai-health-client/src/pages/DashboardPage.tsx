import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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
  const [result, setResult] = useState<HealthRecord | null>(null);
  const [history, setHistory] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset } = useForm<BmiForm>();

  const fetchUser = async () => {
    const response = await api.get("/users/me");
    setUser(response.data);

    reset({
      height: response.data.height,
      weight: response.data.weight,
    });
  };

  const fetchHistory = async () => {
    const response = await api.get("/health/history");
    setHistory(response.data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchUser();
        await fetchHistory();
      } catch {
        localStorage.removeItem("accessToken");
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const onSubmit = async (data: BmiForm) => {
    const response = await api.post("/health/calculate", {
      height: Number(data.height),
      weight: Number(data.weight),
    });

    setResult(response.data);
    await fetchHistory();
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  const latestRecord = history[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600">Жүктөлүүдө...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              AI Health Platform
            </h1>
            <p className="text-sm text-slate-500">
              Саламаттыкты AI аркылуу көзөмөлдөө
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl bg-slate-900 text-white px-5 py-2 text-sm font-semibold hover:bg-slate-700 transition"
          >
            Чыгуу
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-sky-600 p-8 text-white shadow-xl">
          <p className="text-emerald-50">Кош келиңиз</p>
          <h2 className="mt-2 text-3xl font-bold">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="mt-3 max-w-2xl text-emerald-50">
            Бул жерде сиз BMI көрсөткүчүңүздү эсептеп, AI негизиндеги
            саламаттык сунуштарын жана прогрессиңизди көрө аласыз.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Жашы</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {user?.age}
            </h3>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Бою</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {user?.height} см
            </h3>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Салмагы</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {user?.weight} кг
            </h3>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <p className="text-sm text-slate-500">Акыркы BMI</p>
            <h3 className="mt-2 text-3xl font-bold text-emerald-600">
              {latestRecord ? latestRecord.bmi : "-"}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <p className="text-sm text-slate-500">Колдонуучу</p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {user?.firstName} {user?.lastName}
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <p className="flex justify-between gap-4">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium text-right">{user?.email}</span>
                </p>

                <p className="flex justify-between">
                  <span className="text-slate-500">Роль</span>
                  <span className="font-medium">{user?.role}</span>
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-sky-600 rounded-3xl shadow-lg p-6 text-white">
              <p className="text-emerald-50">AI жардамчы</p>
              <h3 className="mt-2 text-xl font-bold">
                Жекелештирилген сунуштар
              </h3>
              <p className="mt-3 text-sm text-emerald-50">
                BMI көрсөткүчүңүзгө жараша система сизге саламаттык боюнча
                сунуштарды берет.
              </p>
            </div>

            {latestRecord && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                <p className="text-sm text-slate-500">Акыркы категория</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  {latestRecord.category}
                </h3>
                <p className="mt-3 text-sm text-slate-600">
                  {latestRecord.recommendation}
                </p>
              </div>
            )}
          </section>

          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                BMI эсептөө
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Боюңузду жана салмагыңызды киргизиңиз.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <input
                  type="number"
                  placeholder="Бою, см"
                  {...register("height", { required: true })}
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />

                <input
                  type="number"
                  placeholder="Салмагы, кг"
                  {...register("weight", { required: true })}
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />

                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
                >
                  Эсептөө
                </button>
              </form>
            </div>

            {result && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                <p className="text-sm text-slate-500">Жыйынтык</p>

                <div className="mt-3 flex items-end gap-3">
                  <h2 className="text-5xl font-bold text-emerald-600">
                    {result.bmi}
                  </h2>
                  <p className="pb-2 text-slate-600">{result.category}</p>
                </div>

                <p className="mt-4 rounded-2xl bg-emerald-50 text-emerald-800 p-4">
                  {result.recommendation}
                </p>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                BMI графиги
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                BMI көрсөткүчүнүн өзгөрүүсү
              </p>

              <div className="mt-6 h-72">
                {history.length === 0 ? (
                  <p className="text-slate-500">
                    График үчүн маалымат жок.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[...history].reverse().map((item) => ({
                        date: new Date(item.createdAt).toLocaleDateString(),
                        bmi: item.bmi,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="bmi"
                        stroke="#059669"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                BMI тарыхы
              </h2>

              <div className="mt-5 space-y-3">
                {history.length === 0 && (
                  <p className="text-slate-500">Азырынча тарых жок.</p>
                )}

                {history.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
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
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}