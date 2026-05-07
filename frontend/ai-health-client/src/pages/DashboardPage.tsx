import { useEffect, useState } from "react";
import api from "../api/axios";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/users/me");

        setUser(response.data);
      } catch {
        alert("Колдонуучуну жүктөө мүмкүн болгон жок");
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Жүктөлүүдө...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Аты: {user.firstName}</p>
      <p>Фамилиясы: {user.lastName}</p>
      <p>Email: {user.email}</p>
      <p>Роль: {user.role}</p>
    </div>
  );
}