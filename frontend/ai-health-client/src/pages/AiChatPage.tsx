import { useState } from "react";
import api from "../api/axios";

type ChatResponse = {
  user: string;
  message: string;
  answer: string;
};

export default function AiChatPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChatResponse | null>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const response = await api.post("/health/ai-chat", {
        message,
      });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("AI жооп түзүүдө ката кетти");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
              AI Health Assistant
            </p>

            <h1 className="text-2xl font-black">
              AI ден соолук жардамчысы
            </h1>
          </div>

          <a
            href="/dashboard"
            className="rounded-lg bg-[#10201b] text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-950"
          >
            Башкы бет
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-5 md:p-8 space-y-6">
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-7">
                <p className="text-sm text-slate-500">
                  Жеке AI кеңешчи
                </p>

                <h2 className="mt-2 text-3xl font-black leading-tight">
                  Ден соолук боюнча суроо бериңиз
                </h2>

                <p className="mt-4 text-slate-600 leading-relaxed">
                  BMI, туура тамактануу, машыгуу, суу ичүү жана күнүмдүк
                  саламаттык адаттары боюнча AI жардамчыдан кеңеш алыңыз.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <MiniStat title="Фокус" value="Health AI" />
                  <MiniStat title="Тема" value="BMI & Wellness" />
                </div>
              </div>

              <img
                src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80"
                alt="AI health consultation"
                className="h-full min-h-[260px] w-full object-cover"
              />
            </div>
          </div>

          <div className="xl:col-span-4 rounded-xl bg-[#10201b] text-white p-7 shadow-sm">
            <p className="text-sm text-emerald-100/70">
              Clinical Guidance
            </p>

            <h3 className="mt-3 text-xl font-bold">
              Коопсуз колдонуу эскертүүсү
            </h3>

            <p className="mt-5 text-sm text-emerald-50/80 leading-relaxed">
              AI жардамчы медициналык диагноз койбойт. Ал маалыматтык
              сунуштарды гана берет. Олуттуу белгилер болсо, дарыгерге
              кайрылыңыз.
            </p>

            <div className="mt-6 space-y-3">
              <InfoLine label="Категория" value="AI жардамчы" />
              <InfoLine label="Максат" value="Жеке кеңеш" />
              <InfoLine label="Статус" value="Активдүү" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-5">
            <Card title="Суроо жөнөтүү">
              <label
                htmlFor="ai-message"
                className="block text-sm font-semibold text-slate-700 mb-3"
              >
                Сурооңуз
              </label>

              <textarea
                id="ai-message"
                name="ai-message"
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Мисалы: BMI 28 болсо кантип туура арыктасам болот?"
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="mt-4 w-full rounded-lg bg-[#10201b] text-white px-5 py-3 font-bold hover:bg-emerald-950 disabled:opacity-60"
              >
                {loading ? "AI жооп түзүүдө..." : "AI жооп алуу"}
              </button>

              <div className="mt-5 rounded-lg bg-slate-50 border border-slate-200 p-4">
                <p className="text-sm font-bold text-slate-700">
                  Мисал суроолор:
                </p>

                <div className="mt-3 space-y-2">
                  <Example text="Кантип туура арыктасам болот?" setMessage={setMessage} />
                  <Example text="BMI көрсөткүчүмдү кантип жакшыртам?" setMessage={setMessage} />
                  <Example text="Күнүнө канча суу ичишим керек?" setMessage={setMessage} />
                </div>
              </div>
            </Card>
          </div>

          <div className="xl:col-span-7">
            <Card title="AI жообу">
              {!result ? (
                <div className="min-h-[360px] rounded-lg bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center p-6">
                  <div className="text-center max-w-md">
                    <p className="text-lg font-bold text-slate-700">
                      Азырынча жооп жок
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Суроо жазып, AI жардамчыдан жооп алыңыз.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      Сиздин сурооңуз
                    </p>

                    <p className="mt-2 text-slate-800">
                      {result.message}
                    </p>
                  </div>

                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-5">
                    <p className="text-xs font-bold text-emerald-700 uppercase">
                      AI сунуш
                    </p>

                    <div className="mt-3 whitespace-pre-line text-slate-800 leading-relaxed">
                      {result.answer}
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

function MiniStat({ title, value }: { title: string; value: string }) {
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

function Example({
  text,
  setMessage,
}: {
  text: string;
  setMessage: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => setMessage(text)}
      className="block w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
    >
      {text}
    </button>
  );
}