// hooks/useReservations.js
import { useState, useCallback } from "react";
import { genId, getTodayStr } from "../utils/constants";

export function useReservations() {
  const [reservations, setReservations] = useState(() => {
    try {
      const saved = localStorage.getItem("gf_reservations");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const persist = useCallback((list) => {
    setReservations(list);
    try { localStorage.setItem("gf_reservations", JSON.stringify(list)); } catch {}
  }, []);

  const addReservation = useCallback((data) => {
    const rec = {
      ...data,
      id: genId(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    persist((prev) => {
      const next = [rec, ...prev];
      // avoid stale closure — use functional update
      localStorage.setItem("gf_reservations", JSON.stringify(next));
      return next;
    });
    return rec;
  }, [persist]);

  const updateStatus = useCallback((id, status) => {
    persist((prev) => {
      const next = prev.map((r) => r.id === id ? { ...r, status } : r);
      localStorage.setItem("gf_reservations", JSON.stringify(next));
      return next;
    });
  }, [persist]);

  const deleteReservation = useCallback((id) => {
    persist((prev) => {
      const next = prev.filter((r) => r.id !== id);
      localStorage.setItem("gf_reservations", JSON.stringify(next));
      return next;
    });
  }, [persist]);

  // 특정 날짜·방갈로의 예약된 시간 조회
  const getBookedHours = useCallback((date, bungalowId) => {
    return reservations
      .filter((r) => r.date === date && r.bungalowId === bungalowId && r.status !== "cancelled")
      .flatMap((r) => r.hours);
  }, [reservations]);

  return { reservations, addReservation, updateStatus, deleteReservation, getBookedHours };
}

// hooks/useWindowWidth.js
import { useState, useEffect } from "react";

export function useWindowWidth() {
  const [w, setW] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 768
  );
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return w;
}
