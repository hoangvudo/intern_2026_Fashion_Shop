import { useState, useEffect, useCallback } from "react";
import brandService from "../services/brandService";
import toast from "react-hot-toast";

export function useAdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const data = await brandService.getAll();
      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("useAdminBrands error:", err);
      toast.error("Không tải được danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return { brands, loading, refresh: fetchBrands };
}
