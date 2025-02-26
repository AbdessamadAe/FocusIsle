import React, { useState, useEffect } from 'react';
import { useFocusSession } from './FocusSessionContext';
import { ActiveUsersCard } from './dashboard/ActiveUsersCard';
import { ProgressCard } from './dashboard/ProgressCard';
import { GeographicMap } from './dashboard/GeographicMap';
import backgroundImage from '../assets/background.jpg';

interface DashboardStats {
  activeUsers: number;
  totalFocusMinutes: number;
  topLocations: Array<{
    name: string;
    count: number;
    coordinates: [number, number];
  }>;
}

interface DashboardProps {
  onJoinClick: () => void;
}

export function Dashboard({ onJoinClick }: DashboardProps) {
  const { users } = useFocusSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3003/api/session/default/stats', {
          credentials: 'include'
        });
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: `url(${backgroundImage}) center/cover no-repeat`,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#2c3e50'
    }}>
      {/* Blur overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        zIndex: 1,
      }} />

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '95%',
        maxWidth: '1400px',
        height: '90%',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '32px',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        transform: 'scale(0.8)',
        transformOrigin: 'center center'
      }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '24px',
          color: '#2c3e50',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <span>Focus Island</span>
          <span style={{
            fontSize: '1rem',
            padding: '4px 12px',
            background: '#e3f2fd',
            borderRadius: '20px',
            color: '#1976d2'
          }}>
            Beta
          </span>
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <ActiveUsersCard count={stats.activeUsers} />
          <ProgressCard 
            focusMinutes={stats.totalFocusMinutes} 
            targetMinutes={18000} // 5 hours daily goal
          />
        </div>

        <div style={{
          flex: 1,
          minHeight: 0,
          marginBottom: '24px'
        }}>
          <GeographicMap locations={stats.topLocations} />
        </div>

        <button
          onClick={onJoinClick}
          style={{
            alignSelf: 'center',
            padding: '15px 30px',
            fontSize: '1.1rem',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.2)',
            transition: 'all 0.3s ease',
            ':hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px rgba(76, 175, 80, 0.3)'
            }
          }}
        >
          Join Focus Session
        </button>
      </div>
    </div>
  );
} 