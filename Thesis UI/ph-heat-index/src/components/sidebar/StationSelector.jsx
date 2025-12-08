import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StationSelector = ({ stations, selectedStation, setSelectedStation, mapInstanceRef, markersRef }) => {
  const chartData = [
    { month: 1, temp: 38 }, { month: 2, temp: 32 }, { month: 3, temp: 41 },
    { month: 4, temp: 45 }, { month: 5, temp: 40 }, { month: 6, temp: 35 },
    { month: 7, temp: 37 }, { month: 8, temp: 39 }, { month: 9, temp: 40 },
    { month: 10, temp: 39 }, { month: 11, temp: 37 }, { month: 12, temp: 36 },
  ];

  const pieData = [
    { name: 'Not Hazardous', value: 2.5, color: '#4CAF50' },
    { name: 'Caution', value: 2, color: '#FFC107' },
    { name: 'Extreme Caution', value: 1, color: '#FF9800' },
    { name: 'Danger', value: 3, color: '#F44336' },
    { name: 'Extreme Danger', value: 1, color: '#B71C1C' }
  ];

  const getHeatIndexColor = (temp) => {
    if (temp >= 52) return '#8B0000';
    if (temp >= 42) return '#DC143C';
    if (temp >= 33) return '#FF4500';
    if (temp >= 27) return '#FFA500';
    return '#FFD700';
  };

  const currentStationData = stations.find(s => s.name === selectedStation) || stations[0];
  const currentHeatIndexColor = getHeatIndexColor(currentStationData.temp);

  const handleStationClick = (station) => {
    setSelectedStation(station.name);
    if (mapInstanceRef.current && typeof L !== 'undefined') {
      mapInstanceRef.current.setView([station.lat, station.lng], mapInstanceRef.current.getZoom());
      const targetMarker = markersRef.current.find(m => 
        m.getLatLng().lat === station.lat && m.getLatLng().lng === station.lng
      );
      if (targetMarker) {
        targetMarker.openPopup();
      }
    }
  };

  return (
    <div style={{
      width: '320px',
      backgroundColor: '#f9f9f9',
      padding: '20px',
      overflowY: 'auto',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      boxShadow: '5px 5px 5px rgba(0,0,0,0.2)'
    }}>
      
      {/* Current Day Summary */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '5px 5px 5px rgba(0,0,0,0.2)'
      }}>
        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>Today, October 1, 2025</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div style={{ fontSize: '56px', fontWeight: 'bold', color: currentHeatIndexColor, lineHeight: 1 }}>
            {currentStationData.temp}°C
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#6b7280' }}>Weekly-Forecast</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>42°C</div>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
          Heat Index: <span style={{ fontWeight: '600', color: currentHeatIndexColor }}>DANGER</span>
          <div style={{ fontSize: '10px', color: '#9ca3af' }}>{currentStationData.name}</div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '8px', color: '#6b7280' }}>
            <span style={{ fontWeight: '600', color: '#111827' }}>Heat Index Trend</span>
            <span>Month</span>
            <span>Year</span>
          </div>
          <ResponsiveContainer width="100%" height={80}>
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="temp" stroke={currentHeatIndexColor} strokeWidth={2} dot={false} />
              <XAxis dataKey="month" hide />
              <YAxis hide domain={[30, 50]} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Synoptic Stations Table */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '5px 5px 5px rgba(0,0,0,0.2)'
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>Synoptic Stations</h3>
        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
          <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f3f4f6', position: 'sticky', top: 0, borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', fontWeight: '700', color: '#111827' }}>Station</th>
                <th style={{ textAlign: 'right', padding: '8px', fontWeight: '700', color: '#111827' }}>Heat Index</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station, index) => (
                <tr 
                  key={station.name} 
                  style={{ 
                    borderTop: index > 0 ? '1px solid #f3f4f6' : 'none',
                    backgroundColor: station.name === selectedStation ? '#eff6ff' : 'white',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleStationClick(station)}
                >
                  <td style={{ padding: '8px', color: '#374151' }}>{station.name}</td>
                  <td style={{ textAlign: 'right', padding: '8px', fontWeight: '600', color: getHeatIndexColor(station.temp) }}>
                    {station.temp}°C
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Station Distribution Pie Chart */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '5px 5px 5px rgba(0,0,0,0.2)'
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>Stations</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '120px', height: '120px', flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={1}
                  outerRadius={60}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: 1, fontSize: '10px' }}>
            {pieData.map((item) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', marginRight: '8px', backgroundColor: item.color }}></div>
                <span style={{ color: '#374151', fontWeight: '500' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationSelector;