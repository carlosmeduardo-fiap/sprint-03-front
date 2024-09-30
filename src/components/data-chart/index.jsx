import { useCallback, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

import './styles.css';

function SensorDataChart() {
  const [sensorData, setSensorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [tempChartInstance, setTempChartInstance] = useState(null);
  const [humidityChartInstance, setHumidityChartInstance] = useState(null);

  const [graphType, setGraphType] = useState('line');
  const [date, setDate] = useState('last-day');

  const sendSensorData = async () => {
    const dadosSensor = {
      sensor_id: 1,
      temperature: Math.random() * 50,
      humidity: Math.random() * 100
    };

    try {
      const response = await fetch('http://localhost:3000/metrics', {
        method: 'POST',
        body: JSON.stringify(dadosSensor),
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar dados do sensor: ' + response.statusText);
      }

      console.log('Dados do sensor enviados com sucesso.');
    } catch (error) {
      console.error('Erro ao enviar dados do sensor:', error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const endpoint = new URL('http://localhost:3000/metrics');

      if (date) {
        endpoint.searchParams.append('date', date);
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar dados: ' + response.statusText);
      }

      const data = await response.json();
      
      setSensorData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const updateChartData = async () => {
      try {
        await sendSensorData();
        await fetchData();
      } catch (error) {
        console.error('Erro ao buscar ou atualizar dados:', error);
      }
    };

    const interval = setInterval(updateChartData, 10000);

    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (tempChartInstance) {
      tempChartInstance.destroy();
    }
    
    if (humidityChartInstance) {
      humidityChartInstance.destroy();
    }

    const tempCtx = document.getElementById('temp-chart');
    const humidityCtx = document.getElementById('humidity-chart');

    const newTempChartInstance = new Chart(tempCtx, {
      type: graphType,
      data: {
        labels: sensorData.map(entry => {
          const timestamp = new Date(entry.timestamp);
          timestamp.setHours(timestamp.getHours() - 3);
          return timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        }),
        datasets: [
          {
            label: 'Temperatura',
            data: sensorData.map(entry => entry.temperature),
            borderColor: 'rgb(227 15 89)',
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    const newHumidityChartInstance = new Chart(humidityCtx, {
      type: graphType,
      data: {
        labels: sensorData.map(entry => {
          const timestamp = new Date(entry.timestamp);
          timestamp.setHours(timestamp.getHours() - 3);
          return timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        }),
        datasets: [
          {
            label: 'Umidade',
            data: sensorData.map(entry => entry.humidity),
            borderColor: 'rgb(54, 162, 235)',
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    setTempChartInstance(newTempChartInstance);
    setHumidityChartInstance(newHumidityChartInstance);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sensorData, isLoading, graphType]);

  return (
    <div>
      <div className="filters">
        <div className="type-filter">
          <div>
            <input
              type="radio"
              id="line"
              name="type"
              value="line"
              checked={graphType === 'line'}
              onChange={() => setGraphType('line')}
            />
            <label htmlFor="line">Line</label>
          </div>

          <div>
            <input
              type="radio"
              id="bar"
              name="type"
              value="bar"
              checked={graphType === 'bar'}
              onChange={() => setGraphType('bar')}
            />
            <label htmlFor="bar">Bar</label>
          </div>

          <div>
            <input
              type="radio"
              id="pie"
              name="type"
              value="pie"
              checked={graphType === 'pie'}
              onChange={() => setGraphType('pie')}
            />
            <label htmlFor="pie">Pie</label>
          </div>
        </div>

        <div className="type-filter">
          <div>
            <input
              type="radio"
              id="last-hour"
              name="date"
              value="last-hour"
              checked={date === 'last-hour'}
              onChange={() => setDate('last-hour')}
            />
            <label htmlFor="last-hour">Última hora</label>
          </div>

          <div>
            <input
              type="radio"
              id="last-day"
              name="date"
              value="last-day"
              checked={date === 'last-day'}
              onChange={() => setDate('last-day')}
            />
            <label htmlFor="last-day">Últimas 24 horas</label>
          </div>
        </div>

      </div>

      <div className="graphs">
        <canvas id="temp-chart" width="600" height="200"></canvas>
        <canvas id="humidity-chart" width="600" height="200"></canvas>
      </div>
    </div>
  );
}

export default SensorDataChart;