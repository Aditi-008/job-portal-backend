import { useEffect } from 'react';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (companyId) {
      fetchSingleCompany();
    }
  }, [companyId, dispatch]);
};

export default useGetCompanyById;
