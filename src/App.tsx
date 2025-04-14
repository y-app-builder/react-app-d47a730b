import React, { useState, useEffect, useRef } from 'react';

const App: React.FC = () => {
  const [altitude, setAltitude] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);
  const [pitch, setPitch] = useState<number>(0);
  const [isFlying, setIsFlying] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  const startFlight = () => {
    setIsFlying(true);
  };

  const stopFlight = () => {
    setIsFlying(false);
    setAltitude(0);
    setSpeed(0);
    setPitch(0);
  };

  const increaseAltitude = () => {
    setPitch(prev => Math.min(prev + 5, 45));
  };

  const decreaseAltitude = () => {
    setPitch(prev => Math.max(prev - 5, -45));
  };

  const increaseSpeed = () => {
    setSpeed(prev => Math.min(prev + 10, 1000));
  };

  const decreaseSpeed = () => {
    setSpeed(prev => Math.max(prev - 10, 0));
  };

  useEffect(() => {
    if (isFlying) {
      const interval = setInterval(() => {
        setAltitude(prev => {
          const altitudeChange = (pitch / 45) * (speed / 100);
          return Math.max(0, prev + altitudeChange);
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isFlying, pitch, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw sky
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#007bff');
      gradient.addColorStop(1, '#87CEEB');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw ground
      const groundY = canvas.height - (altitude / 10);
      if (groundY < canvas.height) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
      }
      
      // Draw horizon line
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();
      
      // Draw airplane
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((pitch * Math.PI) / 180);
      
      // Airplane body
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.ellipse(0, 0, 30, 10, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Wings
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(-40, 15);
      ctx.lineTo(-10, 15);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(40, 15);
      ctx.lineTo(10, 15);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.stroke();
      
      // Tail
      ctx.beginPath();
      ctx.moveTo(-25, 0);
      ctx.lineTo(-35, -15);
      ctx.lineTo(-25, -15);
      ctx.lineTo(-15, 0);
      ctx.fill();
      ctx.stroke();
      
      ctx.restore();
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [altitude, pitch]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0'
    }}>
      <h1>Flight Simulator</h1>
      
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={400} 
        style={{ 
          border: '2px solid #333',
          borderRadius: '8px',
          marginBottom: '20px'
        }}
      />
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px',
        width: '800px',
        padding: '20px',
        backgroundColor: '#333',
        borderRadius: '8px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p>Altitude: {altitude.toFixed(0)} feet</p>
            <p>Speed: {speed.toFixed(0)} knots</p>
            <p>Pitch: {pitch.toFixed(0)}°</p>
          </div>
          <div>
            {!isFlying ? (
              <button 
                onClick={startFlight}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: 'green',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Start Engine
              </button>
            ) : (
              <button 
                onClick={stopFlight}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Emergency Landing
              </button>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <div>
            <h3>Pitch Controls</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={increaseAltitude}
                disabled={!isFlying}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: isFlying ? 'cyan' : 'gray',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isFlying ? 'pointer' : 'not-allowed'
                }}
              >
                Pitch Up
              </button>
              <button 
                onClick={decreaseAltitude}
                disabled={!isFlying}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  backgroundColor: isFlying ? 'cyan' : 'gray',
                  color: 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isFl