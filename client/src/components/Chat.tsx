import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { div } from 'framer-motion/client';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
// API Keys
const LEMON_FOX_API_KEY = import.meta.env.VITE_LEMON_FOX_API_KEY;
const VOICE_RSS_API_KEY = import.meta.env.VITE_VOICE_RSS_API_KEY;

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    formData.append('language', 'english');
    formData.append('response_format', 'json');

    try {
      console.log('Sending request to Lemon Fox API...');
      const response = await fetch('https://api.lemonfox.ai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LEMON_FOX_API_KEY}`
        },
        body: formData
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Transcription failed: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const result = await response.json();
      console.log('Transcription result:', result);
      
      if (result.text) {
        setInputText(result.text);
        handleSendMessage(result.text);  // Automatically send the transcribed text
      } else {
        console.error('No transcription returned');
      }
    } catch (error) {
      console.error('Error transcribing audio:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    }
  };

  const processGeminiResponse = (text: string): string => {
    let processed = text.replace(/\*\*/g, '').replace(/\n/g, ' ').trim();
    processed = processed.replace(/(Definition:|Functions of Money:|Forms of Money:|Types of Monetary Systems:)/g, '');
    const sentences = processed.split(/\.(?=\s|$)/).filter(s => s.trim().length > 0);
    const conciseSentences = sentences.slice(0, 3);
    return conciseSentences.join('. ') + '.';
  };

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMessage: Message = { text: text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(text);
      const response = await result.response;
      const processedResponse = processGeminiResponse(response.text());
      const botMessage: Message = { text: processedResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);

      speakText(processedResponse);
    } catch (error) {
      console.error('Error generating response:', error);
    }
  };

  const speakText = async (text: string) => {
    try {
      const response = await fetch(`https://api.voicerss.org/?key=${VOICE_RSS_API_KEY}&hl=en-us&src=${encodeURIComponent(text)}&c=MP3`);
      if (!response.ok) throw new Error('TTS request failed');
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error in text-to-speech:', error);
    }
  };

return (
    <>
    <div className="chatbot-container">
        <h1 className="chatbot-title">Centsify AI</h1>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className="input-field"
        />
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={`record-button ${isRecording ? 'recording' : ''}`}
        >
          {isRecording ? 'Stop' : 'Record'}
        </button>
      </div>
    </div>
    </>
  );
};

export default Chat;