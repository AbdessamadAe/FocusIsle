import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from "react-simple-maps";

interface Location {
  name: string;
  count: number;
  coordinates: [number, number];
}

interface GeographicMapProps {
  locations: Location[];
}

// Updated mock data with coordinates
const COUNTRY_COORDINATES: { [key: string]: [number, number] } = {
  "United States": [-97, 38],
  "India": [78, 22],
  "Germany": [10, 51],
  "Japan": [138, 36],
  "Brazil": [-53, -10],
};

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export function GeographicMap({ locations }: GeographicMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const maxCount = Math.max(...locations.map(loc => loc.count));

  // Add coordinates to locations
  const locationsWithCoordinates = locations.map(location => ({
    ...location,
    coordinates: COUNTRY_COORDINATES[location.name] || [0, 0]
  }));

  const getRegionColor = (count: number) => {
    const intensity = (count / maxCount) * 0.8 + 0.2;
    return `rgba(76, 175, 80, ${intensity})`;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      padding: '24px',
      width: '100%',
      height: '100%',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1.1rem',
          color: '#666',
          fontWeight: 500
        }}>
          Geographic Distribution
        </h3>
        <div style={{
          fontSize: '0.9rem',
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>Total Regions:</span>
          <span style={{ color: '#2c3e50', fontWeight: 'bold' }}>
            {locations.length}
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '24px',
        flex: 1,
        minHeight: 0
      }}>
        <div style={{
          flex: 1,
          position: 'relative',
          background: '#f8fafc',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <ComposableMap
            projectionConfig={{
              scale: 147,
            }}
          >
            <ZoomableGroup>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const location = locations.find(
                      loc => loc.name === geo.properties.name
                    );
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={location ? getRegionColor(location.count) : "#F5F5F5"}
                        stroke="#FFFFFF"
                        strokeWidth={0.5}
                        style={{
                          default: {
                            outline: "none",
                          },
                          hover: {
                            fill: location ? "#4CAF50" : "#F5F5F5",
                            outline: "none",
                            cursor: location ? "pointer" : "default"
                          },
                          pressed: {
                            outline: "none",
                          },
                        }}
                        onMouseEnter={() => {
                          if (location) {
                            setHoveredRegion(location.name);
                          }
                        }}
                        onMouseLeave={() => {
                          setHoveredRegion(null);
                        }}
                      />
                    );
                  })
                }
              </Geographies>
              {locationsWithCoordinates.map((location) => (
                <Marker key={location.name} coordinates={location.coordinates}>
                  <circle
                    r={Math.max(4, (location.count / maxCount) * 10)}
                    fill="#4CAF50"
                    stroke="#FFF"
                    strokeWidth={2}
                    opacity={0.8}
                  />
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {hoveredRegion && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'white',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              fontSize: '0.9rem',
              zIndex: 10
            }}>
              <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                {hoveredRegion}
              </div>
              <div style={{ color: '#666', marginTop: '4px' }}>
                {locations.find(loc => loc.name === hoveredRegion)?.count || 0} users
              </div>
            </div>
          )}
        </div>

        <div style={{
          width: '240px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflowY: 'auto'
        }}>
          {locations.map((location, index) => (
            <div
              key={location.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: hoveredRegion === location.name ? '#f8fafc' : 'transparent',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                transform: hoveredRegion === location.name ? 'translateX(4px)' : 'none'
              }}
              onMouseEnter={() => setHoveredRegion(location.name)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: getRegionColor(location.count),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontSize: '0.9rem',
                  color: '#2c3e50',
                  fontWeight: 500
                }}>
                  {location.name}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#666',
                  marginTop: '2px'
                }}>
                  {location.count} users
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 