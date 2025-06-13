import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          // ✅ Fixed: "applications" instead of "application"
          dispatch(setAllAppliedJobs(res.data.applications || []));
        } else {
          dispatch(setAllAppliedJobs([]));
          setError("No applications found.");
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
        setError(error?.response?.data?.message || "Failed to fetch applied jobs.");
        dispatch(setAllAppliedJobs([]));
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [dispatch]);

  return { loading, error };
};

export default useGetAppliedJobs;
