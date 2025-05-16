import React from 'react';
import { motion } from 'framer-motion';

const CatMascot = ({ size = 'medium', mood = 'normal' }) => {
  // Define sizes
  const sizes = {
    small: { width: 40, height: 40 },
    medium: { width: 60, height: 60 },
    large: { width: 100, height: 100 },
  };
  
  // Define cat expressions based on mood
  const getMoodStyles = (mood) => {
    switch (mood) {
      case 'happy':
        return {
          leftEye: { backgroundColor: '#4ADE80', animation: 'blinkHappy 4s infinite' },
          rightEye: { backgroundColor: '#4ADE80', animation: 'blinkHappy 4s infinite' },
          mouth: { width: '40%', height: '15%', borderRadius: '0 0 100px 100px', backgroundColor: '#FDA4AF' },
          ears: { animation: 'wiggle 2s infinite' },
          body: { animation: 'bounce 2s infinite' }
        };
      case 'curious':
        return {
          leftEye: { backgroundColor: '#60A5FA', animation: 'blink 3s infinite' },
          rightEye: { backgroundColor: '#60A5FA', animation: 'blink 3s infinite' },
          mouth: { width: '20%', height: '10%', borderRadius: '100px', backgroundColor: '#FDA4AF' },
          ears: { animation: 'tilt 3s infinite' },
          body: { animation: 'tiltSlight 4s infinite' }
        };
      case 'sleeping':
        return {
          leftEye: { height: '5%', backgroundColor: 'transparent', borderBottom: '2px solid #475569' },
          rightEye: { height: '5%', backgroundColor: 'transparent', borderBottom: '2px solid #475569' },
          mouth: { width: '20%', height: '10%', borderRadius: '100px 100px 0 0', backgroundColor: '#FDA4AF' },
          ears: {},
          body: { animation: 'breathe 4s infinite' }
        };
      case 'playful':
        return {
          leftEye: { backgroundColor: '#818CF8', animation: 'blink 2s infinite' },
          rightEye: { backgroundColor: '#818CF8', animation: 'blink 2s infinite' },
          mouth: { width: '30%', height: '15%', borderRadius: '0 0 100px 100px', backgroundColor: '#FDA4AF' },
          ears: { animation: 'wiggle 1s infinite' },
          body: { animation: 'jump 1.5s infinite' }
        };
      default:
        return {
          leftEye: { backgroundColor: '#34D399', animation: 'blink 5s infinite' },
          rightEye: { backgroundColor: '#34D399', animation: 'blink 5s infinite' },
          mouth: { width: '25%', height: '8%', borderRadius: '100px', backgroundColor: '#FDA4AF' },
          ears: {},
          body: {}
        };
    }
  };
  
  const { width, height } = sizes[size];
  const moodStyles = getMoodStyles(mood);
  
  // Define keyframes for the animations
  const keyframes = `
    @keyframes blink {
      0%, 45%, 55%, 100% { height: 25%; }
      50% { height: 5%; }
    }
    
    @keyframes blinkHappy {
      0%, 45%, 55%, 100% { height: 25%; transform: scale(1); }
      50% { height: 5%; transform: scale(1.1, 0.9); }
    }
    
    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }
    
    @keyframes tilt {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(15deg); }
    }
    
    @keyframes tiltSlight {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(3deg); }
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10%); }
    }
    
    @keyframes jump {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-15%) rotate(5deg); }
    }
    
    @keyframes breathe {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05, 0.95); }
    }
  `;
  
  return (
    <div style={{ position: 'relative', width, height }}>
      <style>{keyframes}</style>
      
      {/* Cat body */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, ...moodStyles.body }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          borderRadius: '50%',
          overflow: 'visible',
        }}
      >
        {/* Left eye */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '25%',
            width: '25%',
            height: '25%',
            borderRadius: '50%',
            ...moodStyles.leftEye
          }}
        />
        
        {/* Right eye */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            right: '25%',
            width: '25%',
            height: '25%',
            borderRadius: '50%',
            ...moodStyles.rightEye
          }}
        />
        
        {/* Mouth */}
        <div
          style={{
            position: 'absolute',
            bottom: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            ...moodStyles.mouth
          }}
        />
        
        {/* Left ear */}
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            left: '20%',
            width: '25%',
            height: '40%',
            backgroundColor: 'black',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            transformOrigin: 'bottom center',
            animation: moodStyles.ears?.animation,
          }}
        />
        
        {/* Right ear */}
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            right: '20%',
            width: '25%',
            height: '40%',
            backgroundColor: 'black',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            transformOrigin: 'bottom center',
            animation: moodStyles.ears?.animation,
          }}
        />
        
        {/* Optional whiskers for medium and large cats */}
        {(size === 'medium' || size === 'large') && (
          <>
            {/* Left whiskers */}
            <div style={{ 
              position: 'absolute', 
              left: '10%', 
              top: '50%', 
              width: '20%', 
              height: '1px', 
              backgroundColor: '#64748B' 
            }}></div>
            <div style={{ 
              position: 'absolute', 
              left: '5%', 
              top: '55%', 
              width: '25%', 
              height: '1px', 
              backgroundColor: '#64748B' 
            }}></div>
            
            {/* Right whiskers */}
            <div style={{ 
              position: 'absolute', 
              right: '10%', 
              top: '50%', 
              width: '20%', 
              height: '1px', 
              backgroundColor: '#64748B' 
            }}></div>
            <div style={{ 
              position: 'absolute', 
              right: '5%', 
              top: '55%', 
              width: '25%', 
              height: '1px', 
              backgroundColor: '#64748B' 
            }}></div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CatMascot;