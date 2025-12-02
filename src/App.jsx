import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getLatestData, WS_URL } from './api/dashboardApi';
import Dashboard from './pages/Dashboard';
import PowerDetail from './pages/PowerDetail';
import BatteryDetail from './pages/BatteryDetail';
import PVDetail from './pages/PVDetail';
import GridDetail from './pages/GridDetail';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const wsRef = useRef(null);

  // REST API로 초기 데이터 로드
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await getLatestData();
        setData(response.data);
      } catch (error) {
        console.error('초기 데이터 로드 실패:', error);
      }
    };
    fetchInitialData();
  }, []);

  // WebSocket 연결
  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket(WS_URL);

      wsRef.current.onopen = () => {
        console.log('WebSocket 연결됨');
        setConnectionStatus('connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          setData(newData);
        } catch (error) {
          console.error('데이터 파싱 오류:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket 연결 종료');
        setConnectionStatus('disconnected');
        setTimeout(connectWebSocket, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket 오류:', error);
        setConnectionStatus('error');
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard data={data} connectionStatus={connectionStatus} />} />
        <Route path="/power" element={<PowerDetail data={data} />} />
        <Route path="/battery" element={<BatteryDetail data={data} />} />
        <Route path="/pv" element={<PVDetail data={data} />} />
        <Route path="/grid" element={<GridDetail data={data} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
