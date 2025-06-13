import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector(store => store.application);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setAllApplicants(res.data.applicants));
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to fetch applicants.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllApplicants();
  }, [params.id, dispatch]);

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto'>
        {loading ? (
          <p className="my-4">Loading applicants...</p>
        ) : error ? (
          <p className="my-4 text-red-500">{error}</p>
        ) : (
          <>
            <h1 className='font-bold text-xl my-5'>Applicants ({applicants?.length || 0})</h1>
            <ApplicantsTable />
          </>
        )}
      </div>
    </div>
  );
};

export default Applicants;
