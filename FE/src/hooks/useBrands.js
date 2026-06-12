import { useState, useEffect, useCallback } from "react";
import brandService from "../services/brandService";
import toast from "react-hot-toast";

export function usePublicBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    brandService
      .getActive()
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  return { brands, loading };
}

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
