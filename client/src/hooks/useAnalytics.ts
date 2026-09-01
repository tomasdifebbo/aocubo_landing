import { useState, useEffect } from "react";

export interface TrafficDataPoint {
  date: string;
  formattedDate: string;
  views: number;
  uniqueVisitors: number;
}

export interface RegistrationDataPoint {
  date: string;
  formattedDate: string;
  registrations: number;
  cumulative: number;
}

export interface FavoriteStatItem {
  id: string;
  title: string;
  neighborhood: string;
  count: number;
}

const TRAFFIC_KEY = "aocubo_analytics_traffic";
const USERS_KEY = "aocubo_analytics_users";

export function useAnalytics() {
  const [trafficData, setTrafficData] = useState<TrafficDataPoint[]>([]);
  const [registrationData, setRegistrationData] = useState<RegistrationDataPoint[]>([]);
  const [favoriteStats, setFavoriteStats] = useState<FavoriteStatItem[]>([]);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [totalFavoritesCount, setTotalFavoritesCount] = useState<number>(0);

  useEffect(() => {
    // 1. Generate/Load Traffic Data (Last 14 days)
    const now = new Date();
    const generatedTraffic: TrafficDataPoint[] = [];
    let accumulatedViews = 0;

    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const isoDate = d.toISOString().split("T")[0];
      const formattedDate = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

      // Deterministic pseudo-random numbers based on day for consistent metrics
      const dayNum = d.getDate() + (d.getMonth() + 1) * 31;
      const baseViews = 120 + ((dayNum * 17) % 180);
      const uniqueVisitors = Math.round(baseViews * 0.72);

      accumulatedViews += baseViews;

      generatedTraffic.push({
        date: isoDate,
        formattedDate,
        views: baseViews,
        uniqueVisitors,
      });
    }

    setTrafficData(generatedTraffic);
    setTotalViews(accumulatedViews);

    // 2. Generate/Load User Registration Data
    const generatedRegs: RegistrationDataPoint[] = [];
    let runningTotal = 142; // Base registered users count

    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const isoDate = d.toISOString().split("T")[0];
      const formattedDate = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

      const dayNum = d.getDate() + (d.getMonth() + 1) * 13;
      const dailyNew = Math.floor((dayNum % 7) + (i === 0 ? 3 : 1));
      runningTotal += dailyNew;

      generatedRegs.push({
        date: isoDate,
        formattedDate,
        registrations: dailyNew,
        cumulative: runningTotal,
      });
    }

    setRegistrationData(generatedRegs);
    setTotalUsersCount(runningTotal);

    // 3. Load Favorite Stats (combining localStorage with featured properties)
    const savedFavsRaw = localStorage.getItem("aocubo_favs");
    const userFavs: string[] = savedFavsRaw ? JSON.parse(savedFavsRaw) : [];

    const mockTopFavorites: FavoriteStatItem[] = [
      { id: "3818", title: "Metrocasa Butantã", neighborhood: "Butantã", count: 48 + (userFavs.includes("3818") ? 1 : 0) },
      { id: "3318", title: "Free Concept", neighborhood: "Saúde", count: 39 + (userFavs.includes("3318") ? 1 : 0) },
      { id: "3625", title: "Influencer Vila Mariana", neighborhood: "Vila Mariana", count: 34 + (userFavs.includes("3625") ? 1 : 0) },
      { id: "3919", title: "Residencial Moema Premium", neighborhood: "Moema", count: 27 + (userFavs.includes("3919") ? 1 : 0) },
      { id: "3102", title: "High Garden Pinheiros", neighborhood: "Pinheiros", count: 21 + (userFavs.includes("3102") ? 1 : 0) },
      { id: "2840", title: "Vista Jardins Studios", neighborhood: "Jardins", count: 18 + (userFavs.includes("2840") ? 1 : 0) },
    ];

    const sumFavs = mockTopFavorites.reduce((acc, curr) => acc + curr.count, 0);
    setFavoriteStats(mockTopFavorites);
    setTotalFavoritesCount(sumFavs);
  }, []);

  return {
    trafficData,
    registrationData,
    favoriteStats,
    totalViews,
    totalUsersCount,
    totalFavoritesCount,
  };
}
