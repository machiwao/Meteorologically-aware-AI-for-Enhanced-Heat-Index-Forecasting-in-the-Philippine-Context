import React from 'react';

const HeatIndexLegend = () => {
  const legendItems = [
    { label: 'Not Hazardous', range: '< 27° C', color: '#4CAF5040' },
    { label: 'Caution', range: '27 - 32° C', color: '#FFC10740' },
    { label: 'Extreme Caution', range: '33 - 41° C', color: '#FB923C40' },
    { label: 'Danger', range: '42 - 51° C', color: '#F4433640' },
    { label: 'Extreme Danger', range: '> 52° C', color: '#B71C1C40' },
  ];

  return (
    <>
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '5px 5px 5px rgba(0,0,0,0.2)',
        border: '1px solid #e5e7eb',
        width: '100%',
        marginBottom: '16px'
      }}>
        <div style={{ padding: '16px 16px 12px 16px' }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            margin: 0, 
            color: '#000000',
            textAlign: 'center'
          }}>
            Heat Index Classification
          </h2>
        </div>
        <div style={{ padding: '0 16px 16px 16px' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #d1d5db'
          }}>
            <thead>
              <tr>
                <th style={{
                  padding: '10px 16px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: '#000000',
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db'
                }}>Label</th>
                <th style={{
                  padding: '10px 16px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: '#000000',
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                  border: '1px solid #d1d5db'
                }}>Measure</th>
              </tr>
            </thead>
            <tbody>
              {legendItems.map((item, i) => (
                <tr key={i}>
                  <td style={{
                    padding: '12px 16px',
                    fontWeight: '400',
                    fontSize: '13px',
                    color: '#000000',
                    backgroundColor: item.color,
                    border: '1px solid #d1d5db',
                    textAlign: 'left'
                  }}>
                    {item.label}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '13px',
                    color: '#000000',
                    backgroundColor: item.color,
                    border: '1px solid #d1d5db',
                    textAlign: 'center'
                  }}>
                    {item.range}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* RMSE Metrics Section - Separate Pane */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '5px 5px 5px rgba(0,0,0,0.2)',
        border: '1px solid #e5e7eb',
        width: '100%'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          backgroundColor: '#ffffff'
        }}>
          <div style={{
            padding: '12px 8px',
            textAlign: 'center',
            borderRight: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>RMSE</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>2.1</div>
          </div>
          <div style={{
            padding: '12px 8px',
            textAlign: 'center',
            borderRight: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>MAE</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>2.1</div>
          </div>
          <div style={{
            padding: '12px 8px',
            textAlign: 'center',
            borderRight: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>R²</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>2.1</div>
          </div>
          <div style={{
            padding: '12px 8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>BIAS</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>2.1</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeatIndexLegend;