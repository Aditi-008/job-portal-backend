// src/hooks/useGetAllCompanies.jsx
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAllCompanies } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const useGetAllCompanies = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("📦 Token from localStorage:", token);

        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });

        if (res.data.success) {
          dispatch(setAllCompanies(res.data.companies));
          console.log("✅ Companies fetched:", res.data.companies.length);
        }
      } catch (error) {
        console.error("❌ Error fetching companies", error);
        toast.error(error?.response?.data?.message || "Failed to fetch companies");
      }
    };

    fetchCompanies();
  }, []);
};

export default useGetAllCompanies;
