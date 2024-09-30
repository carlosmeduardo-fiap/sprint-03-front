import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ClearDataButton from '../../components/clear-data-button';
import DataChart from '../../components/data-chart';

import './styles.css'

function Metrics() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/auth/sign-in')
    }
  }, [navigate]);

  return (
    <>
      <h1>Dados do Sensor</h1>
      <DataChart />
      <ClearDataButton />
    </>
  );
}

export default Metrics