import { useEffect, useState, useCallback } from 'react';
import './App.css';
import ThemeToggle from './ThemeToggle';
import LoadingAnimation from './LoadingAnimation';

// Type definitions
interface CountUpProps {
  end: number;
  duration?: number;
}

// Define type for dashboard data items from API
type DashboardDataItem = [string, number | string, string?];

interface DashboardCardProps {
  title: string;
  value: number | string;
  color?: string;
}

// CountUp component for animation
function CountUp({ end, duration = 2000 }: CountUpProps) {
  // Inisialisasi dengan nilai kosong yang akan diupdate pada render pertama
  const [count, setCount] = useState<number>(0);
  const [prevEnd, setPrevEnd] = useState<number | null>(null);
  const [isFirstRender, setIsFirstRender] = useState(true);
  
  useEffect(() => {
    if (end === undefined) return;
    
    // Tentukan nilai awal untuk animasi
    let startValue;
    
    if (isFirstRender) {
      startValue = 100;
      setIsFirstRender(false);
    } else {
      // Pada render berikutnya, mulai dari nilai sebelumnya
      startValue = prevEnd !== null ? prevEnd : count;
    }
    
    // Simpan nilai akhir saat ini untuk perubahan berikutnya
    setPrevEnd(end);
    
    // Hanya animasikan jika nilai berbeda
    if (startValue === end) {
      setCount(end);
      return;
    }
    
    // Hitung step dan jalankan animasi
    const stepTime = 10;
    const steps = duration / stepTime;
    const stepValue = (startValue - end) / steps;
    let current = startValue;
    
    const timer = setInterval(() => {
      current -= stepValue;
      
      // Kondisi berhenti ketika mencapai nilai akhir (baik naik maupun turun)
      if ((stepValue > 0 && current <= end) || (stepValue < 0 && current >= end)) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.round(current));
      }
    }, stepTime);
    
    // Cleanup timer saat unmount atau nilai berubah
    return () => clearInterval(timer);
  }, [end, duration]); // Hapus prevEnd dari dependensi untuk menghindari loop
  
  return <span className="counter-value">{count}</span>;
}

// Dashboard Card component
function DashboardCard({ title, value, color }: DashboardCardProps) {
  const defaultColor = "var(--value-color)";
  // Use the provided color or fall back to the default color
  const accentColor = color && color !== "#ffffff" ? color : defaultColor;
  
  const cardStyle = {
    "--card-accent-color": accentColor,
    "--title-underline-color": accentColor,
    "--value-text-color": accentColor
  } as React.CSSProperties;

  return (
    <div className="dashboard-card" style={cardStyle}>
      <h2>{title}</h2>
      <div className="value-container">
        <CountUp end={parseInt(value.toString())} />
      </div>
    </div>
  );
}

function App() {
  const [dashboardData, setDashboardData] = useState<DashboardDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Create a reusable fetch function
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}?action=read`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDashboardData(data);
      setLastUpdated(new Date());
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Setup auto-refresh interval (every 10 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing dashboard data...');
      fetchData();
    }, 10000); // 10 seconds in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchData]);

  if (loading && !dashboardData.length) {
    return (
      <>
        <ThemeToggle />
        <LoadingAnimation />
      </>
    );
  }

  if (error && !dashboardData.length) {
    return (
      <>
        <ThemeToggle />
        <div className="error">{error}</div>
      </>
    );
  }

  return (
    <>
      <ThemeToggle />
      <div className="dashboard-container">
        <h1>{dashboardData.length > 0 ? dashboardData[0][1] : 'Dashboard'}</h1>
        {lastUpdated && (
          <div className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
        <div className="dashboard-grid">
          {dashboardData.slice(1).map((item, index) => (
            <DashboardCard 
              key={index} 
              title={item[0]} 
              value={item[1]} 
              color={item[2] && item[2] !== "#ffffff" ? item[2] : undefined} 
            />
          ))}
        </div>
        {loading && <div className="refreshing-indicator">Refreshing data...</div>}
        {error && <div className="refresh-error">{error}</div>}
      </div>
    </>
  );
}

export default App;