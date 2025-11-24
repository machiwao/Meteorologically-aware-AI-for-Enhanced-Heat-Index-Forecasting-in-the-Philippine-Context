import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import L from 'leaflet';

const App = () => {
  const [selectedDate, setSelectedDate] = useState('2025-10-01');
  const [selectedStation, setSelectedStation] = useState('Science Garden, Pasay City');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const chartData = [
    { month: 1, temp: 38 }, { month: 2, temp: 39 }, { month: 3, temp: 41 },
    { month: 4, temp: 43 }, { month: 5, temp: 44 }, { month: 6, temp: 42 },
    { month: 7, temp: 40 }, { month: 8, temp: 39 }, { month: 9, temp: 40 },
    { month: 10, temp: 38 }, { month: 11, temp: 37 }, { month: 12, temp: 36 },
  ];

  const stations = [
    { name: 'Ambulong, Batangas', temp: 40, lat: 13.9167, lng: 121.0500 },
    { name: 'Baguio City, Benguet', temp: 42, lat: 16.4023, lng: 120.5960 },
    { name: 'Baler, Aurora', temp: 42, lat: 15.7592, lng: 121.5605 },
    { name: 'Basco, Batanes', temp: 38, lat: 20.4487, lng: 121.9702 },
    { name: 'Catarman, Oriental Mindoro', temp: 38, lat: 12.5833, lng: 121.2667 },
    { name: 'Clark Airport, Pampanga', temp: 46, lat: 15.1860, lng: 120.5600 },
    { name: 'Daet, Camarines Norte', temp: 45, lat: 14.1117, lng: 122.9550 },
    { name: 'Dagupan City, Pangasinan', temp: 48, lat: 16.0433, lng: 120.3333 },
    { name: 'Iba, Zambales', temp: 42, lat: 15.3269, lng: 119.9774 },
    { name: 'Infanta, Quezon', temp: 40, lat: 14.7525, lng: 121.6475 },
    { name: 'Science Garden, Pasay City', temp: 45, lat: 14.6507, lng: 121.0494 },
  ];

  const pieData = [
    { name: 'Hot (Hazardous)', value: 0, color: '#8B0000' },
    { name: 'Caution', value: 2, color: '#FFD700' },
    { name: 'Extreme Caution', value: 3, color: '#FFA500' },
    { name: 'Danger', value: 4, color: '#FF4500' },
    { name: 'Extreme Danger', value: 2, color: '#DC143C' },
  ];

  const getHeatIndexColor = (temp) => {
    if (temp >= 52) return '#8B0000';
    if (temp >= 42) return '#DC143C';
    if (temp >= 33) return '#FF4500';
    if (temp >= 27) return '#FFA500';
    return '#FFD700';
  };

  useEffect(() => {
    // Initialize Leaflet map
    if (!mapInstanceRef.current && mapRef.current) {
      const map = L.map(mapRef.current, {
        center: [12.8797, 121.7740],
        zoom: 6,
        minZoom: 5,
        maxZoom: 10,
        zoomControl: false
      });

      // Use satellite imagery tiles
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
      }).addTo(map);

      // Add labels overlay
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        attribution: ''
      }).addTo(map);

      L.control.zoom({
        position: 'bottomleft'
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add markers
      stations.forEach((station, idx) => {
        const icon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
              background-color: ${getHeatIndexColor(station.temp)};
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            ">
              <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = L.marker([station.lat, station.lng], { icon }).addTo(map);

        const popupContent = `
          <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 260px;">
            <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 12px;">
              <div style="width: 20px; height: 20px; border-radius: 50%; background-color: #000; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                  <path d="M12 2v20M2 12h20"/>
                </svg>
              </div>
              <div style="flex: 1;">
                <div style="font-weight: bold; font-size: 14px; margin-bottom: 2px;">${station.name}</div>
                <div style="font-size: 11px; color: #6b7280;">(NGRids longitude)</div>
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 12px; border-top: 1px solid #e5e7eb; padding-top: 12px;">
              <div style="text-align: center; flex: 1;">
                <div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">Actual</div>
                <div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">12:00 PM</div>
                <div style="font-size: 28px; font-weight: bold; color: #ef4444;">${station.temp}°C</div>
              </div>
              <div style="text-align: center; flex: 1;">
                <div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">DAILY-Forecasted</div>
                <div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">06:00 PM</div>
                <div style="font-size: 28px; font-weight: bold; color: #ef4444;">${station.temp}°C</div>
              </div>
              <div style="text-align: center; flex: 1;">
                <div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">Weekly-Forecasted</div>
                <div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">Next Week</div>
                <div style="font-size: 28px; font-weight: bold; color: #ef4444;">${station.temp}°C</div>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'custom-popup'
        });

        marker.on('click', () => {
          setSelectedMarker(idx);
        });

        markersRef.current.push(marker);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" 
      />
      <style>
        {`
          .leaflet-popup-content-wrapper {
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          }
          .leaflet-popup-tip {
            display: none;
          }
          .custom-marker {
            background: none;
            border: none;
          }
        `}
      </style>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#f9fafb' }}>
        {/* Top Header */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '16px 32px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100
        }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>PH HEAT INDEX</h1>
          <div style={{ fontSize: '16px', fontStyle: 'italic', color: '#6b7280' }}>October 1, 2025</div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Sidebar */}
          <div style={{ 
            width: '180px', 
            backgroundColor: 'transparent', 
            padding: '20px', 
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            zIndex: 50,
            position: 'relative'
          }}>
            {/* Date Section */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>DATE</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ 
                  width: '100%', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px', 
                  padding: '8px', 
                  fontSize: '12px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              />
            </div>

            {/* Station Section */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Station</label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                style={{ 
                  width: '100%', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '4px', 
                  padding: '8px', 
                  fontSize: '11px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {stations.map((station) => (
                  <option key={station.name} value={station.name}>{station.name}</option>
                ))}
              </select>
            </div>

            {/* Heat Index Classification */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: '12px', fontWeight: 'bold', margin: 0, color: '#111827' }}>Heat Index Classification</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { label: 'Hot (Hazardous)', range: '> 52°C', color: '#8B0000' },
                  { label: 'Extreme Danger', range: '42 - 52°C', color: '#DC143C' },
                  { label: 'Danger', range: '33 - 41°C', color: '#FF4500' },
                  { label: 'Extreme Caution', range: '27 - 32°C', color: '#FFA500' },
                  { label: 'Caution', range: '< 27°C', color: '#FFD700' },
                ].map((item, i) => (
                  <div key={i} style={{ 
                    padding: '10px 16px', 
                    backgroundColor: 'white',
                    borderBottom: i < 4 ? '1px solid #f3f4f6' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        flexShrink: 0
                      }}></div>
                      <div style={{ fontWeight: '600', fontSize: '11px', color: '#111827' }}>{item.label}</div>
                    </div>
                    <div style={{ fontSize: '10px', color: '#6b7280', paddingLeft: '20px' }}>{item.range}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Map */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
          </div>

          {/* Right Sidebar */}
          <div style={{
            width: '320px',
            backgroundColor: 'transparent',
            padding: '20px',
            overflowY: 'auto',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>Today, October 1, 2025</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#ef4444', lineHeight: 1 }}>44°C</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: '#6b7280' }}>Weekly-Forecast</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>42°C</div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
                Heat Index: <span style={{ fontWeight: '600', color: '#111827' }}>DANGER</span>
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', marginBottom: '20px' }}>
                <div>
                  <div style={{ color: '#6b7280', marginBottom: '4px' }}>Observed</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>40°C</div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '8px', color: '#6b7280' }}>
                  <span style={{ fontWeight: '600', color: '#111827' }}>Heat Index</span>
                  <span>Month</span>
                  <span>Year</span>
                </div>
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={chartData}>
                    <Line type="monotone" dataKey="temp" stroke="#ef4444" strokeWidth={2} dot={false} />
                    <XAxis dataKey="month" hide />
                    <YAxis hide domain={[30, 50]} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>Synoptic Stations</h3>
              <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                <table style={{ width: '100%', fontSize: '11px' }}>
                  <thead style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0 }}>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px', fontWeight: '600' }}>Station</th>
                      <th style={{ textAlign: 'right', padding: '8px', fontWeight: '600' }}>Heat Index</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stations.map((station) => (
                      <tr key={station.name} style={{ borderTop: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '8px' }}>{station.name}</td>
                        <td style={{ textAlign: 'right', padding: '8px', fontWeight: '500' }}>{station.temp}°C</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>Stations</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '120px', height: '120px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
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
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center', fontSize: '10px' }}>
                <div>
                  <div style={{ color: '#6b7280', marginBottom: '4px' }}>RMSE</div>
                  <div style={{ fontWeight: 'bold', fontSize: '12px' }}>2.1</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', marginBottom: '4px' }}>MAE</div>
                  <div style={{ fontWeight: 'bold', fontSize: '12px' }}>2.1</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', marginBottom: '4px' }}>R²</div>
                  <div style={{ fontWeight: 'bold', fontSize: '12px' }}>2.1</div>
                </div>
                <div>
                  <div style={{ color: '#6b7280', marginBottom: '4px' }}>ACC_%</div>
                  <div style={{ fontWeight: 'bold', fontSize: '12px' }}>2.1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;