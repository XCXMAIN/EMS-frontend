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

  // 백엔드 데이터를 프론트엔드 형식으로 변환
  const normalizeData = (rawData) => {
    if (!rawData) return null;
    
    return {
      timestamp: rawData.timestamp,
      site: rawData.site || 'site-001',
      // 전력 현황
      voltage: rawData.voltage || rawData.ac_out_voltage || 0,
      current: rawData.current || (rawData.ac_out_watt / (rawData.ac_out_voltage || 1)) || 0,
      power: rawData.power || rawData.ac_out_watt || 0,
      // 배터리
      soc: rawData.soc || 0,
      battery_voltage: rawData.battery_voltage || 0,
      battery_temp: rawData.battery_temp || 0,
      // 태양광
      pv_voltage: rawData.pv_voltage || 0,
      pv_current: rawData.pv_current || 0,
      pv_power: rawData.pv_power || 0,
      // 계통
      grid_voltage: rawData.grid_voltage || 0,
      ac_output_w: rawData.ac_output_w || rawData.ac_out_watt || 0,
      load_percent: rawData.load_percent || 0,
      // 기타
      charge_current: rawData.charge_current || 0,
      discharge_current: rawData.discharge_current || 0,
    };
  };

  // REST API로 초기 데이터 로드
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await getLatestData();
        const normalized = normalizeData(response.data);
        if (normalized) {
          setData(normalized);
        }
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
            const rawData = JSON.parse(event.data);
            const normalized = normalizeData(rawData);
            if (normalized) {
              setData(normalized);
            }
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
