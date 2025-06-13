import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAllJobs = async () => {
      const token = localStorage.getItem("token");
      console.log("📦 Token from localStorage:", token);

      if (!token) {
        console.error("❌ No token found in localStorage. Please login.");
        return;
      }

      try {
        const url = `${JOB_API_END_POINT}/get?keyword=${encodeURIComponent(searchedQuery)}`;
        console.log("🌐 Fetching jobs from:", url);

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (res.data.success) {
          console.log("✅ Jobs fetched:", res.data.jobs.length);
          dispatch(setAllJobs(res.data.jobs));
        } else {
          console.warn("⚠️ Job fetch unsuccessful:", res.data.message);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("🔁 Request cancelled");
          return;
        }

        const errMsg = error.response?.data?.message || error.message;
        console.error("❌ Failed to fetch jobs:", errMsg);
      }
    };

    fetchAllJobs();

    return () => controller.abort();
  }, [dispatch, searchedQuery]);
};

export default useGetAllJobs;
