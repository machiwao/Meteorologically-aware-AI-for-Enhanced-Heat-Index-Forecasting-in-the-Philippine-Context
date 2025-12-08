import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import L from 'leaflet'; 
// We will rely on the global 'L' object provided by the CDN script tags.

const App = () => {
  const [selectedDate, setSelectedDate] = useState('2025-10-01');
  const [selectedStation, setSelectedStation] = useState('Science Garden, Pasay City');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Data for the line chart (Placeholder for monthly heat index trend)
  const chartData = [
    { month: 1, temp: 38 }, { month: 2, temp: 32 }, { month: 3, temp: 41 },
    { month: 4, temp: 45 }, { month: 5, temp: 40 }, { month: 6, temp: 35 },
    { month: 7, temp: 37 }, { month: 8, temp: 39 }, { month: 9, temp: 40 },
    { month: 10, temp: 39 }, { month: 11, temp: 37 }, { month: 12, temp: 36 },
  ];

  // Data for stations (Placeholder data)
  const stations = [
    { name: 'Ambulong, Batangas', temp: 40, lat: 14.09008056, lng: 121.0552444 },
    { name: 'Aparri, Cagayan', temp: 38, lat: 18.360059, lng: 121.630454 },
    { name: 'Baguio City, Benguet', temp: 42, lat: 16.403992, lng: 120.60147 },
    { name: 'Baler, Aurora', temp: 32, lat: 15.748809, lng: 121.632028 },
    { name: 'Basco, Batanes', temp: 38, lat: 20.427284, lng: 121.970536 },
    { name: 'Calapan City, Oriental Mindoro', temp: 30, lat: 13.409775, lng: 121.1896667 },
    { name: 'Clark Airport, Pampanga', temp: 33, lat: 15.1717, lng: 120.5600 },
    { name: 'Daet, Camarines Norte', temp: 31, lat: 14.128689, lng: 122.982559 },
    { name: 'Dagupan City, Pangasinan', temp: 38, lat: 16.086784, lng: 120.352045 },
    { name: 'Iba, Zambales', temp: 32, lat: 15.328408, lng: 119.965661 },
    { name: 'Infanta, Quezon', temp: 39, lat: 14.74663611, lng: 121.6490333 },
    { name: 'Laoag City, Ilocos Norte', temp: 40, lat: 18.183016, lng: 120.534723 },
    { name: 'Legazpi City, Ilocos Norte', temp: 32, lat: 13.150937, lng: 123.728605 },
    { name: 'NAIA - Pasay City, Metro Manila', temp: 33, lat: 14.5047, lng: 121.004751 },
    { name: 'Port Area, Manila', temp: 35, lat: 14.58841, lng: 120.967866 },
    { name: 'Puerto Princesa City, Palawan', temp: 36, lat: 9.740134, lng: 118.758613 },
    { name: 'San Jose, Occidental Mindoro', temp: 34, lat: 12.359602, lng: 121.04788 },
    { name: 'Sangley Point, Cavite City', temp: 37, lat: 14.494953, lng: 120.906838 },
    { name: 'Science Garden, Pasay City', temp: 36, lat: 14.645072, lng: 121.044282 },
    { name: 'Sinait, Ilocos Sur', temp: 32, lat: 17.89019, lng: 120.459762 },
    { name: 'Tanay, Rizal', temp: 33, lat: 14.581167, lng: 121.36927 },
    { name: 'Tayabas City, Quezon', temp: 35, lat: 14.018428, lng: 121.596575 },
    { name: 'Tuguegarao City, Cagayan', temp: 30, lat: 17.647678, lng: 121.758469 },
    { name: 'Virac, Catuandanes', temp: 38, lat: 13.576558, lng: 124.209834 }

  ];

  // Data for the pie chart (Placeholder for station distribution by classification)
  const pieData = [
    { name: 'Not Hazardous', value: 2.5, color: '#4CAF50' },
    { name: 'Caution', value: 2, color: '#FFC107' },
    { name: 'Extreme Caution', value: 1, color: '#FF9800' },
    { name: 'Danger', value: 3, color: '#F44336' },
    { name: 'Extreme Danger', value: 1, color: '#B71C1C' }
  ];

  // Function to determine the marker color based on heat index
  const getHeatIndexColor = (temp) => {
    if (temp >= 52) return '#8B0000'; // Hot (Hazardous)
    if (temp >= 42) return '#DC143C'; // Extreme Danger (42 - 52°C)
    if (temp >= 33) return '#FF4500'; // Danger (33 - 41°C)
    if (temp >= 27) return '#FFA500'; // Extreme Caution (27 - 32°C)
    return '#FFD700'; // Caution (< 27°C)
  };

  useEffect(() => {
    // Check if Leaflet object (L) is available globally before initialization
    // L will be available if the script tag has loaded successfully.
    if (typeof L === 'undefined' || !mapRef.current) {
      // If L is not available or map container isn't mounted yet, wait.
      console.error("Leaflet (L) is not defined or map container not ready.");
      return;
    }

    // Initialize Leaflet map
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [12.8797, 121.7740], // Center on the Philippines
        zoom: 6,
        minZoom: 5,
        maxZoom: 10,
        zoomControl: false // We will manually place the zoom control for better positioning
      });

      // Use satellite imagery tiles (like the reference image)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxNativeZoom: 17,
        maxZoom: 19
      }).addTo(map);

      // Add labels overlay
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        pane: 'overlayPane',
        attribution: '',
        maxNativeZoom: 17,
        maxZoom: 19
      }).addTo(map);

      // Add zoom control to the bottom left corner
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

        // --- Marker Popup Content ---
        const popupContent = `
          <div style="font-family: Inter, system-ui, -apple-system, sans-serif; min-width: 260px; padding: 4px;">
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
                <div style="font-size: 28px; font-weight: bold; color: ${getHeatIndexColor(station.temp)};">${station.temp}°C</div>
              </div>
              <div style="text-align: center; flex: 1;">
                <div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">DAILY-Forecasted</div>
                <div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">06:00 PM</div>
                <div style="font-size: 28px; font-weight: bold; color: ${getHeatIndexColor(station.temp)};">${station.temp}°C</div>
              </div>
              <div style="text-align: center; flex: 1;">
                <div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">Weekly-Forecasted</div>
                <div style="font-size: 10px; color: #6b7280; margin-bottom: 4px;">Next Week</div>
                <div style="font-size: 28px; font-weight: bold; color: ${getHeatIndexColor(station.temp)};">${station.temp}°C</div>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'custom-popup'
        });

        marker.on('click', () => {
          setSelectedStation(station.name);
          // Optional: Center map on the selected marker
          // map.setView([station.lat, station.lng], map.getZoom());
        });

        markersRef.current.push(marker);
      });
    }

    return () => {
      // Clean up map instance on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Run only on mount and unmount

  // Find the currently selected station data
  const currentStationData = stations.find(s => s.name === selectedStation) || stations[0];
  const currentHeatIndexColor = getHeatIndexColor(currentStationData.temp);

  // --- JSX Rendering ---
  return (
    <>
      {/* Leaflet CSS and JS must be loaded via CDN links */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" 
      />
      {/* Script tag must be placed outside of the component render logic 
          in a single-file environment if we are to use the global variable 'L'
          that it provides. However, for an all-in-one React file, placing them
          here relies on the framework's ability to inject them, which seems 
          to be the only way to satisfy the single-file constraint.
      */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
      
      {/* Custom Styles to fix the missing icon issue and improve aesthetics */}
      <style>
        {`
          /* Fix for missing Leaflet marker icons when using bundlers */
          .leaflet-default-icon-path {
              background-image: url('https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png');
          }
          .leaflet-default-icon-path.leaflet-marker-shadow {
              background-image: url('https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png');
          }
          
          /* Custom styling for Leaflet elements */
          .leaflet-popup-content-wrapper {
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
            font-family: Inter, system-ui, -apple-system, sans-serif;
          }
          .leaflet-popup-tip {
            display: none; /* Hide the popup triangle for a clean box look */
          }
          .custom-marker {
            background: none;
            border: none;
          }

          /* Ensure the root element fills the screen and hides overflow */
          #app-root, html, body {
            height: 100%;
            width: 100%;
            overflow: hidden;
            margin: 0;
            padding: 0;
          }
          
          .leaflet-control-zoom {
              border-radius: 8px !important;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }
          .leaflet-control-zoom a {
              color: #1f2937 !important;
              background-color: white !important;
          }
          .leaflet-control-zoom a:first-child {
              border-top-left-radius: 8px;
              border-top-right-radius: 8px;
          }
          .leaflet-control-zoom a:last-child {
              border-bottom-left-radius: 8px;
              border-bottom-right-radius: 8px;
          }
        `}
      </style>
      
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#f9fafb' }}>
        
        {/* Top Header (PH HEAT INDEX) */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '16px 32px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100
        }}>
          <h1 style={{ fontSize: '35px', fontWeight: 'bold', margin: 0 }}>PH HEAT INDEX</h1>
          <div style={{ fontSize: '20px', color: '#000000', fontStyle: 'italic'}}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
        
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
          
          {/* Main Content - Map */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>

            {/* FLOATING LEFT CONTROLS (Positioned over the map) */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 400, // Above map and controls
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '300px',
            }}>
              
              {/* Date & Station Combined Section */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}>
                {/* Date Content */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '20px', fontWeight: '400', marginBottom: '8px', color: '#000000' }}>Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ 
                      width: '92%', 
                      border: '1px solid #B8BBC2', 
                      borderRadius: '5px', // Increased border radius
                      padding: '10px', // Increased padding for larger input field
                      fontSize: '14px', // Increased font size
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                    }}
                  />
                </div>

                {/* Station Content */}
                <div>
                  <label style={{ display: 'block', fontSize: '20px', fontWeight: '400', marginBottom: '8px', color: '#000000' }}>Station</label>
                  <select
                    value={selectedStation}
                    onChange={(e) => setSelectedStation(e.target.value)}
                    style={{ 
                      width: '100%', 
                      border: '1px solid #B8BBC2', 
                      borderRadius: '8px', // Increased border radius
                      padding: '10px', // Increased padding for larger select field
                      fontSize: '14px', // Increased font size
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                    }}
                  >
                    {stations.map((station) => (
                      <option key={station.name} value={station.name}>{station.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Heat Index Classification */}
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '5px 5px 5px rgba(0,0,0,0.2)',
                border: '1px solid #e5e7eb',
                width: '100%'
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb' }}>
                  <h2 style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    margin: 0, 
                    color: '#000000',
                    textAlign: 'center'
                    }}>Heat Index Classification</h2>
                </div>
                <table style ={{
                  width: '100%',
                  borderCollapse: 'collapse'
                }}>
                  <thead>
                    <tr style ={{
                      backgroundColor: '#ffffff',
                      borderBottom: '2px solid #e5e7eb'
                    }}>
                      <th style ={{
                        padding: '8px 16px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: '#374151',
                        textAlign: 'left'
                      }}>Label</th>
                      <th style ={{
                        padding: '8px 16px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: '#374151',
                        textAlign: 'left'
                      }}>Measure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Not Hazardous', range: '< 27° C', color: '#4CAF50' },
                      { label: 'Caution', range: '27 - 32° C', color: '#FFC107' },
                      { label: 'Extreme Caution', range: '33 - 41° C', color: '#FF9800' },
                      { label: 'Danger', range: '42 - 51° C', color: '#F44336' },
                      { label: 'Extreme Danger', range: '> 52° C', color: '#B71C1C' },
                    ].map((item, i) => (
                      <div key={i} style={{ 
                        padding: '8px 16px', 
                        backgroundColor: 'white',
                        borderBottom: i < 4 ? '1px solid #f3f4f6' : 'none'
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
                          <div style={{ fontSize: '10px', color: '#6b7280', marginLeft: 'auto' }}>{item.range}</div>
                        </div>
                      </div>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
            
          </div>

          {/* Right Sidebar (Dashboard) */}
          <div style={{
            width: '320px',
            backgroundColor: '#f9f9f9', // Slightly distinct background
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
                <div style={{ fontSize: '56px', fontWeight: 'bold', color: currentHeatIndexColor, lineHeight: 1 }}>{currentStationData.temp}°C</div>
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
                        onClick={() => {
                          setSelectedStation(station.name);
                          // We check for the global L object here too, just in case
                          if (mapInstanceRef.current && typeof L !== 'undefined') {
                            mapInstanceRef.current.setView([station.lat, station.lng], mapInstanceRef.current.getZoom());
                            // Find the correct marker using its coordinates/name to open its popup
                            const targetMarker = markersRef.current.find(m => 
                                m.getLatLng().lat === station.lat && m.getLatLng().lng === station.lng
                            );
                            if (targetMarker) {
                                targetMarker.openPopup();
                            }
                          }
                        }}
                      >
                        <td style={{ padding: '8px', color: '#374151' }}>{station.name}</td>
                        <td style={{ textAlign: 'right', padding: '8px', fontWeight: '600', color: getHeatIndexColor(station.temp) }}>{station.temp}°C</td>
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
            
            {/* Metrics */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '5px 5px 5px rgba(0,0,0,0.2)'
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