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
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

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

    // 주기적으로 REST API로 데이터 갱신 (WebSocket 백업)
    const interval = setInterval(fetchInitialData, 10000);
    return () => clearInterval(interval);
  }, []);

  // WebSocket 연결
  useEffect(() => {
    let reconnectTimeout;

    const connectWebSocket = () => {
      // 이미 연결 중이거나 연결된 상태면 스킵
      if (wsRef.current?.readyState === WebSocket.CONNECTING || 
          wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      setConnectionStatus('connecting');
      
      try {
        wsRef.current = new WebSocket(WS_URL);

        wsRef.current.onopen = () => {
          console.log('WebSocket 연결됨');
          setConnectionStatus('connected');
          reconnectAttempts.current = 0;
        };

        wsRef.current.onmessage = (event) => {
          try {
            const newData = JSON.parse(event.data);
            setData(newData);
          } catch (error) {
            console.error('데이터 파싱 오류:', error);
          }
        };

        wsRef.current.onclose = (event) => {
          console.log('WebSocket 연결 종료:', event.code);
          setConnectionStatus('disconnected');
          
          // 재연결 시도
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current += 1;
            const delay = Math.min(3000 * reconnectAttempts.current, 15000);
            console.log(`${delay/1000}초 후 재연결 시도... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
            reconnectTimeout = setTimeout(connectWebSocket, delay);
          }
        };

        wsRef.current.onerror = () => {
          // onclose에서 재연결 처리하므로 여기서는 상태만 업데이트
          setConnectionStatus('error');
        };
      } catch (error) {
        console.error('WebSocket 생성 오류:', error);
        setConnectionStatus('error');
      }
    };

    // 초기 연결 (1초 후 - 서버 웜업 시간)
    const initialTimeout = setTimeout(connectWebSocket, 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(reconnectTimeout);
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
