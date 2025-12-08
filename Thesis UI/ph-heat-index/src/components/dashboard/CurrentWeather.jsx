import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const CurrentWeather = () => {
  const chartData = [
    { month: 1, temp: 38 }, { month: 2, temp: 32 }, { month: 3, temp: 41 },
    { month: 4, temp: 45 }, { month: 5, temp: 40 }, { month: 6, temp: 35 },
    { month: 7, temp: 37 }, { month: 8, temp: 39 }, { month: 9, temp: 40 },
    { month: 10, temp: 39 }, { month: 11, temp: 37 }, { month: 12, temp: 36 },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px', 
      padding: '20px',
      fontFamily: 'Poppins, sans-serif'
    }}>
      {/* Main Heat Index Card */}
      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'stretch'
      }}>
        {/* Large Temperature Card */}
        <div style={{
          flex: '0 0 280px',
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#6B7280',
            marginBottom: '8px'
          }}>
            October 1, 2025
          </div>
          <div style={{
            fontSize: '72px',
            fontWeight: '700',
            color: '#EF4444',
            lineHeight: '1',
            marginBottom: '8px'
          }}>
            44° C
          </div>
          <div style={{
            fontSize: '13px',
            color: '#EF4444',
            fontWeight: '500'
          }}>
            Danger (42 – 51°C)
          </div>
        </div>

        {/* Side Forecast Cards */}
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>October 2, 2025</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#000' }}>42°C</div>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>October 3, 2025</div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#000' }}>40°C</div>
          </div>
        </div>
      </div>

      {/* Heat Index Trend Chart */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#000' }}>
            Heat Index
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: '#000',
              color: 'white',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Month
            </button>
            <button style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              background: 'white',
              color: '#6B7280',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif'
            }}>
              Year
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData}>
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#EF4444" 
              strokeWidth={3}
              dot={false}
            />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CurrentWeather;
