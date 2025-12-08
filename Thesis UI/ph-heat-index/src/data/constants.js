// src/data/constants.js

export const chartData = [
  { month: 1, temp: 38 }, { month: 2, temp: 39 }, { month: 3, temp: 41 },
  { month: 4, temp: 43 }, { month: 5, temp: 44 }, { month: 6, temp: 42 },
  { month: 7, temp: 40 }, { month: 8, temp: 39 }, { month: 9, temp: 40 },
  { month: 10, temp: 38 }, { month: 11, temp: 37 }, { month: 12, temp: 36 },
];


export const stations = [
  { name: 'Ambulong, Batangas', temp: 40, dailyForecast: 41, weeklyForecast: 39, lat: 13.9167, lng: 121.0500 },
  { name: 'Baguio City, Benguet', temp: 42, dailyForecast: 43, weeklyForecast: 42, lat: 16.4023, lng: 120.5960 },
  { name: 'Baler, Aurora', temp: 42, dailyForecast: 42, weeklyForecast: 41, lat: 15.7592, lng: 121.5605 },
  { name: 'Basco, Batanes', temp: 38, dailyForecast: 39, weeklyForecast: 38, lat: 20.4487, lng: 121.9702 },
  { name: 'Catarman, Oriental Mindoro', temp: 38, dailyForecast: 38, weeklyForecast: 37, lat: 12.5833, lng: 121.2667 },
  { name: 'Clark Airport, Pampanga', temp: 46, dailyForecast: 47, weeklyForecast: 45, lat: 15.1860, lng: 120.5600 },
  { name: 'Daet, Camarines Norte', temp: 45, dailyForecast: 45, weeklyForecast: 44, lat: 14.1117, lng: 122.9550 },
  { name: 'Dagupan City, Pangasinan', temp: 48, dailyForecast: 49, weeklyForecast: 47, lat: 16.0433, lng: 120.3333 },
  { name: 'Iba, Zambales', temp: 42, dailyForecast: 43, weeklyForecast: 42, lat: 15.3269, lng: 119.9774 },
  { name: 'Infanta, Quezon', temp: 40, dailyForecast: 41, weeklyForecast: 40, lat: 14.7525, lng: 121.6475 },
  { name: 'Science Garden, Pasay City', temp: 45, dailyForecast: 45, weeklyForecast: 45, lat: 14.6507, lng: 121.0494 },
];



export const pieData = [
  { name: 'Hot (Hazardous)', value: 0, color: '#8B0000' },
  { name: 'Caution', value: 2, color: '#FFD700' },
  { name: 'Extreme Caution', value: 3, color: '#FFA500' },
  { name: 'Danger', value: 4, color: '#FF4500' },
  { name: 'Extreme Danger', value: 2, color: '#DC143C' },
];

export const heatIndexClassification = [
  { label: 'Hot (Hazardous)', range: '> 52°C', color: '#8B0000' },
  { label: 'Extreme Danger', range: '42 - 52°C', color: '#DC143C' },
  { label: 'Danger', range: '33 - 41°C', color: '#FF4500' },
  { label: 'Extreme Caution', range: '27 - 32°C', color: '#FFA500' },
  { label: 'Caution', range: '< 27°C', color: '#FFD700' },
];

export const getHeatIndexColor = (temp) => {
  if (temp >= 52) return '#8B0000';
  if (temp >= 42) return '#DC143C';
  if (temp >= 33) return '#FF4500';
  if (temp >= 27) return '#FFA500';
  return '#FFD700';
};