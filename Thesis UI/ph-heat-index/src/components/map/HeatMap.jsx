import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const HeatMap = ({ stations, selectedStation, setSelectedStation, mapInstanceRef, markersRef }) => {
  const mapRef = useRef(null);

  const getHeatIndexColor = (temp) => {
    if (temp >= 52) return '#8B0000';
    if (temp >= 42) return '#DC143C';
    if (temp >= 33) return '#FF4500';
    if (temp >= 27) return '#FFA500';
    return '#FFD700';
  };

  useEffect(() => {
    if (typeof L === 'undefined' || !mapRef.current) {
      console.error("Leaflet (L) is not defined or map container not ready.");
      return;
    }

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [12.8797, 121.7740],
        zoom: 6,
        minZoom: 5,
        maxZoom: 10,
        zoomControl: false
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri',
        maxNativeZoom: 17,
        maxZoom: 19
      }).addTo(map);

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        pane: 'overlayPane',
        attribution: '',
        maxNativeZoom: 17,
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({
        position: 'bottomleft'
      }).addTo(map);

      mapInstanceRef.current = map;

      stations.forEach((station) => {
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
          iconAnchor: [10, 10],
          popupAnchor: [0, 10]
        });

        const marker = L.marker([station.lat, station.lng], { icon }).addTo(map);

        const getDangerLevel = (temp) => {
          if (temp >= 52) return { level: 'EXTREME DANGER', color: '#B71C1C' };
          if (temp >= 42) return { level: 'DANGER', color: '#F44336' };
          if (temp >= 33) return { level: 'EXTREME CAUTION', color: '#FF9800' };
          if (temp >= 27) return { level: 'CAUTION', color: '#FFC107' };
          return { level: 'NOT HAZARDOUS', color: '#4CAF50' };
        };

        const danger = getDangerLevel(station.temp);

      const popupContent = `
          <div style="font-family: 'Poppins', sans-serif; width: 360px; background: #F5F5F5; padding: 16px; border-radius: 12px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);">
            <!-- Header Section -->
            <div style="background: #5468FF; padding: 14px 18px; display: flex; align-items: center; gap: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); margin-bottom: 12px;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
              <div style="flex: 1;">
                <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px; text-transform: uppercase; line-height: 1.3;">${station.name}</div>
                <div style="font-size: 9.5px; font-weight: 400; color: #FFFFFF; opacity: 0.95; margin-top: 2px;">[latitude, longitude]</div>
              </div>
            </div>

            <!-- Heat Index Summary Section -->
            <div style="background: #FFFFFF; padding: 20px 8px; display: flex; gap: 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); margin-bottom: 12px;">
              <div style="flex: 1; text-align: center; padding: 0 4px; border-right: 1px solid #E5E7EB;">
                <div style="font-size: 9px; font-weight: 600; color: #6B7280; line-height: 1.3; margin-bottom: 8px;">Actual<br/>Heat Index</div>
                <div style="font-size: 24px; font-weight: 700; color: #000000; line-height: 1; letter-spacing: -1px;">${station.temp}° C</div>
              </div>
              <div style="flex: 1; text-align: center; padding: 0 4px; border-right: 1px solid #E5E7EB;">
                <div style="font-size: 9px; font-weight: 600; color: #6B7280; line-height: 1.3; margin-bottom: 8px;">PAGASA–Forecasted<br/>Heat Index</div>
                <div style="font-size: 24px; font-weight: 700; color: #000000; line-height: 1; letter-spacing: -1px;">${station.temp}° C</div>
              </div>
              <div style="flex: 1; text-align: center; padding: 0 4px;">
                <div style="font-size: 9px; font-weight: 600; color: #6B7280; line-height: 1.3; margin-bottom: 8px;">Model–Forecasted<br/>Heat Index</div>
                <div style="font-size: 24px; font-weight: 700; color: #000000; line-height: 1; letter-spacing: -1px;">${station.temp}° C</div>
              </div>
            </div>

            <!-- Danger Alert Section (Separate Box) -->
            <div style="background: #FFFFFF; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); overflow: hidden; margin-bottom: 12px;">
              <div style="background: ${danger.color}; padding: 12px 18px; display: flex; align-items: center; gap: 12px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                  <path d="M12 2L2 20h20L12 2z"/>
                  <path d="M12 9v4M12 17h.01" stroke="${danger.color}" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
                <div style="font-size: 16px; font-weight: 800; color: #FFFFFF; letter-spacing: 1.5px; text-transform: uppercase;">${danger.level}</div>
              </div>
              
              <!-- Effects Content Area -->
              <div style="background: #FFFFFF; padding: 18px 18px 20px 18px;">
                <div style="font-size: 14px; font-weight: 700; color: #000000; margin-bottom: 12px;">Effects on your people</div>
                <div style="font-size: 12px; color: #4B5563; line-height: 1.65; min-height: 65px;">
                  ${station.temp >= 52 ? 'Heat stroke is imminent. Avoid prolonged exposure to heat.' : 
                    station.temp >= 42 ? 'Heat cramps and heat exhaustion are likely; heat stroke is probable with continued activity.' :
                    station.temp >= 33 ? 'Heat cramps and heat exhaustion are possible. Continuing activity could result in heat stroke.' :
                    station.temp >= 27 ? 'Fatigue is possible with prolonged exposure and activity. Continuing activity could result in heat cramps.' :
                    'No significant health effects expected.'}
                </div>
              </div>
            </div>

            <!-- What To Do Section (Separate Box) -->
            <div style="background: #FFFFFF; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); overflow: hidden;">
              <div style="background: #4CAF50; padding: 12px 18px; display: flex; align-items: center; gap: 12px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                <div style="font-size: 16px; font-weight: 800; color: #FFFFFF; letter-spacing: 1.5px; text-transform: uppercase;">WHAT TO DO</div>
              </div>
              
              <!-- What To Do Content Area -->
              <div style="background: #FFFFFF; padding: 18px 18px 20px 18px;">
                <div style="font-size: 12px; color: #4B5563; line-height: 1.65; min-height: 65px;">
                  ${station.temp >= 52 ? 'Stay indoors in air-conditioned areas. Drink plenty of water. Avoid strenuous activities.' :
                    station.temp >= 42 ? 'Limit outdoor activities. Stay hydrated. Take frequent breaks in shaded or air-conditioned areas.' :
                    station.temp >= 33 ? 'Take precautions when working outdoors. Drink water regularly. Wear light-colored clothing.' :
                    station.temp >= 27 ? 'Stay hydrated during outdoor activities. Take breaks when needed.' :
                    'Enjoy outdoor activities with normal precautions.'}
                </div>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 360,
          minWidth: 340,
          className: 'custom-popup',
          offset: [0, 20],
          autoPan: true
        });

        marker.on('click', () => {
          setSelectedStation(station.name);
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

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default HeatMap;