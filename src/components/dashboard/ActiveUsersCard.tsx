import React from 'react';

interface ActiveUsersCardProps {
  count: number;
}

export function ActiveUsersCard({ count }: ActiveUsersCardProps) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '24px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      minWidth: '300px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <h3 style={{
            margin: 0,
            fontSize: '1.1rem',
            color: '#666',
            fontWeight: 500
          }}>
            Active today
          </h3>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#2c3e50',
            marginTop: '8px'
          }}>
            {count}
          </div>
        </div>
        <div style={{
          width: '120px',
          height: '120px',
          position: 'relative'
        }}>
          {/* Placeholder for illustration */}
          <div style={{
            width: '100%',
            height: '100%',
            background: '#f5f7fa',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '0.8rem'
          }}>
            Illustration
          </div>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        <div style={{
          padding: '6px 12px',
          background: '#e8f5e9',
          borderRadius: '16px',
          color: '#4CAF50',
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          +12% from yesterday
        </div>
        <div style={{
          fontSize: '0.9rem',
          color: '#666'
        }}>
          • Online now
        </div>
      </div>
    </div>
  );
} 