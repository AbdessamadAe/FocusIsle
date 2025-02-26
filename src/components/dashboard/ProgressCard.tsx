import React from 'react';

interface ProgressCardProps {
  focusMinutes: number;
  targetMinutes: number;
}

export function ProgressCard({ focusMinutes, targetMinutes }: ProgressCardProps) {
  const progress = Math.min((focusMinutes / targetMinutes) * 100, 100);
  
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
            Progress today
          </h3>
          <div style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#2c3e50',
            marginTop: '8px'
          }}>
            {Math.round(progress)}%
          </div>
        </div>
        
        {/* Circular Progress Indicator */}
        <div style={{
          width: '87px',
          height: '87px',
          position: 'relative'
        }}>
          <svg width="87" height="87" viewBox="0 0 87 87">
            {/* Background circle */}
            <circle
              cx="43.5"
              cy="43.5"
              r="38.5"
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="10"
            />
            {/* Progress circle */}
            <circle
              cx="43.5"
              cy="43.5"
              r="38.5"
              fill="none"
              stroke="#FF9500"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 38.5 * progress / 100} ${2 * Math.PI * 38.5}`}
              strokeDashoffset="0"
              transform="rotate(-90 43.5 43.5)"
              style={{
                transition: 'stroke-dasharray 0.8s ease-in-out'
              }}
            />
          </svg>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: '#fff8f0',
        padding: '16px',
        borderRadius: '16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Focus time</div>
          <div style={{ 
            color: '#2c3e50', 
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            {Math.floor(focusMinutes / 60)}h {focusMinutes % 60}m
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ color: '#666', fontSize: '0.9rem' }}>Daily goal</div>
          <div style={{ 
            color: '#2c3e50', 
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            {Math.floor(targetMinutes / 60)}h {targetMinutes % 60}m
          </div>
        </div>
      </div>
    </div>
  );
} 