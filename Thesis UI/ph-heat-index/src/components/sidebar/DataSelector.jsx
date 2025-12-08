import React from 'react';

const DateSelector = ({ selectedDate, setSelectedDate, selectedStation, setSelectedStation, stations }) => {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    }}>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', fontSize: '20px', fontWeight: '400', marginBottom: '8px', color: '#000000' }}>
          Date
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ 
            width: '92%', 
            border: '1px solid #B8BBC2', 
            borderRadius: '5px',
            padding: '10px',
            fontSize: '14px',
            fontFamily: 'Poppins, sans-serif'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '20px', fontWeight: '400', marginBottom: '8px', color: '#000000' }}>
          Station
        </label>
        <select
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
          style={{ 
            width: '100%', 
            border: '1px solid #B8BBC2', 
            borderRadius: '8px',
            padding: '10px',
            fontSize: '14px',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          {stations.map((station) => (
            <option key={station.name} value={station.name}>{station.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DateSelector;