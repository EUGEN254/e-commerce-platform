import { useState, useEffect, useCallback } from "react";
import axios from "../utils/axiosInstance";

const useSalesSummary = (period = "month") => {
  const [salesSummary, setSalesSummary] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyData: [],
    topSellingProducts: [],
    loading: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSalesSummary = useCallback(
    async (timePeriod = period) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `/api/admin/summary?period=${timePeriod}`,
        );

        if (response.data.success) {
          setSalesSummary({
            ...response.data.data,
            loading: false,
          });
        } else {
          throw new Error(
            response.data.message || "Failed to fetch sales summary",
          );
        }
      } catch (err) {
        console.error("Error fetching sales summary:", err);
        setError(err.message || "Failed to fetch sales data");

        // Use mock data as fallback
        setSalesSummary({
          totalSales: 25000,
          totalOrders: 1200,
          totalRevenue: 800,
          monthlyData: [
            { month: "Jan", orders: 100, revenue: 8000 },
            { month: "Feb", orders: 200, revenue: 16000 },
            { month: "Mar", orders: 150, revenue: 12000 },
            { month: "Apr", orders: 250, revenue: 20000 },
            { month: "May", orders: 300, revenue: 24000 },
          ],
          topSellingProducts: [
            {
              name: "Security Camera",
              sales: 234,
              revenue: 12300,
              growth: "+12%",
            },
            { name: "Smart Lock", sales: 189, revenue: 9450, growth: "+8%" },
            {
              name: "Motion Sensor",
              sales: 156,
              revenue: 7800,
              growth: "+15%",
            },
          ],
          loading: false,
        });
      } finally {
        setLoading(false);
      }
    },
    [period],
  );

  useEffect(() => {
    fetchSalesSummary();
  }, [fetchSalesSummary]);

  return {
    salesSummary,
    loading,
    error,
    refetch: fetchSalesSummary,
    updatePeriod: fetchSalesSummary,
  };
};

export default useSalesSummary;
