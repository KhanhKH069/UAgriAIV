/**
 * API Service
 * TV4: Software Lead
 */
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000/api/v1";

const api = axios.create({ baseURL: BASE_URL, timeout: 10_000 });

export const fetchHeatmap = async (flightId?: string) => {
  const params = flightId ? { flight_id: flightId } : {};
  const res    = await api.get("/detections/heatmap", { params });
  return (res.data.features ?? []).map((f: any) => ({
    lat:      f.geometry.coordinates[1],
    lng:      f.geometry.coordinates[0],
    weight:   f.properties.weight ?? 0.5,
    disease:  f.properties.disease_name,
    severity: f.properties.severity,
  }));
};

export const fetchRecentAlerts = async (limit = 20) => {
  const res = await api.get("/alerts/", { params: { limit } });
  return res.data.alerts ?? [];
};

export const fetchTreatment = async (diseaseId: string) => {
  try {
    const res = await api.get(`/treatments/${diseaseId}`);
    await AsyncStorage.setItem(`treatment_${diseaseId}`, JSON.stringify(res.data));
    return res.data;
  } catch {
    const cached = await AsyncStorage.getItem(`treatment_${diseaseId}`);
    return cached ? JSON.parse(cached) : null;
  }
};

export const fetchFlights = async () => {
  const res = await api.get("/flights/");
  return res.data.flights ?? [];
};
