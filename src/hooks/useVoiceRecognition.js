import { useState, useEffect } from 'react';

export const useVoiceRecognition = () => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'fr-FR'; // Set to French for the French app
      
      // When results are returned
      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setText(transcript);
      };

      // When recognition stops
      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      // When error occurs
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      setHasRecognitionSupport(true);
    } else {
      setHasRecognitionSupport(false);
    }
    
    // Cleanup on unmount
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const startListening = () => {
    setText('');
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  };
};