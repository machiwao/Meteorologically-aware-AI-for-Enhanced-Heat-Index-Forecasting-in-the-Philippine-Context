/**
 * ============================================================================
 * PH HEAT INDEX - Main Application Component
 * ============================================================================
 * 
 * Main application component that manages the Philippines Heat Index
 * visualization and monitoring system.
 * 
 * Features:
 * - Interactive heat map with weather stations
 * - Real-time heat index monitoring
 * - Date and station selection
 * - Heat index classification and legends
 * - Station-specific weather data
 * ============================================================================
 */

// ============================================================================
// IMPORTS
// ============================================================================
import React, { useState, useRef } from 'react';
import HeatMap from './components/map/HeatMap';
import DataSelector from './components/sidebar/DataSelector';
import HeatIndexLegend from './components/sidebar/HeatIndexLegend';
import StationSelector from './components/sidebar/StationSelector';

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
const App = () => {
  // -------------------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------------------
  // Selected date for weather data display
  const [selectedDate, setSelectedDate] = useState('2025-10-01');
  
  // Currently selected weather station
  const [selectedStation, setSelectedStation] = useState('Science Garden, Pasay City');
  
  // Reference to Leaflet map instance for programmatic control
  const mapInstanceRef = useRef(null);
  
  // Reference array storing all map markers for interaction
  const markersRef = useRef([]);

  // -------------------------------------------------------------------------
  // WEATHER STATION DATA
  // -------------------------------------------------------------------------
  // Static data array containing all synoptic weather stations in the Philippines
  // Each station includes: name, temperature, latitude, and longitude
  const stations = [
    { name: 'Ambulong, Batangas', temp: 40, lat: 14.09008056, lng: 121.0552444 },
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

  // -------------------------------------------------------------------------
  // COMPONENT RENDER
  // -------------------------------------------------------------------------
  return (
    <>
      {/* ================================================================== */}
      {/* GLOBAL STYLES */}
      {/* ================================================================== */}
      <style>
        {`
          * {
            font-family: 'Poppins', sans-serif !important;
          }
          
          .leaflet-default-icon-path {
              background-image: url('https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png');
          }
          .leaflet-default-icon-path.leaflet-marker-shadow {
              background-image: url('https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png');
          }
          
          .leaflet-popup-content-wrapper {
            background: transparent !important;
            box-shadow: none !important;
            font-family: 'Poppins', sans-serif;
            padding: 0 !important;
          }
          .leaflet-popup-tip {
            display: none;
          }
          .custom-marker {
            background: none;
            border: none;
          }

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

          /* Responsive adjustments */
          @media (max-width: 1366px) {
            .sidebar-overlay {
              width: 280px !important;
            }
          }
          
          @media (max-width: 1024px) {
            .sidebar-overlay {
              width: 260px !important;
            }
            .header-title {
              font-size: 28px !important;
            }
            .header-date {
              font-size: 16px !important;
            }
          }
          
          @media (max-width: 768px) {
            .sidebar-overlay {
              width: 240px !important;
            }
            .header-title {
              font-size: 24px !important;
            }
            .header-date {
              font-size: 14px !important;
            }
          }
        `}
      </style>
      
      {/* ================================================================== */}
      {/* MAIN APPLICATION LAYOUT */}
      {/* ================================================================== */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Poppins, sans-serif', backgroundColor: '#f9fafb' }}>
        
        {/* ============================================================== */}
        {/* HEADER SECTION */}
        {/* ============================================================== */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '16px 32px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100
        }}>
          <h1 className="header-title" style={{ fontSize: '35px', fontWeight: 'bold', margin: 0 }}>PH HEAT INDEX</h1>
          <div className="header-date" style={{ fontSize: '20px', color: '#000000', fontStyle: 'italic'}}>
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        
        {/* ============================================================== */}
        {/* MAIN CONTENT AREA */}
        {/* ============================================================== */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
          
          {/* ========================================================== */}
          {/* MAP CONTAINER */}
          {/* ========================================================== */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <HeatMap 
              stations={stations}
              selectedStation={selectedStation}
              setSelectedStation={setSelectedStation}
              mapInstanceRef={mapInstanceRef}
              markersRef={markersRef}
            />

            {/* ====================================================== */}
            {/* LEFT SIDEBAR OVERLAY - Data Selector & Legend */}
            {/* ====================================================== */}
            <div className="sidebar-overlay" style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 400,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '300px'
            }}>
              <DataSelector 
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedStation={selectedStation}
                setSelectedStation={setSelectedStation}
                stations={stations}
              />
              
              <HeatIndexLegend />
            </div>
          </div>

          {/* ========================================================== */}
          {/* RIGHT SIDEBAR - Station Selector Panel */}
          {/* ========================================================== */}
          <StationSelector 
            stations={stations}
            selectedStation={selectedStation}
            setSelectedStation={setSelectedStation}
            mapInstanceRef={mapInstanceRef}
            markersRef={markersRef}
          />
        </div>
      </div> 
    </>
  );
};

export default App;