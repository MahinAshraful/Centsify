import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
// API Keys
const ASSEMBLY_AI_KEY = import.meta.env.VITE_ASSEMBLY_AI_KEY;
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
    formData.append('audio', audioBlob, 'recording.wav');

    try {
      const response = await fetch('https://api.assemblyai.com/v2/upload', {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLY_AI_KEY
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      const uploadResult = await response.json();

      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'Authorization': ASSEMBLY_AI_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audio_url: uploadResult.upload_url })
      });

      if (!transcriptResponse.ok) throw new Error('Transcription failed');
      const transcriptResult = await transcriptResponse.json();

      // Poll for transcription completion
      const pollingInterval = setInterval(async () => {
        const pollingResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptResult.id}`, {
          headers: { 'Authorization': ASSEMBLY_AI_KEY }
        });
        const pollingResult = await pollingResponse.json();

        if (pollingResult.status === 'completed') {
          clearInterval(pollingInterval);
          setInputText(pollingResult.text);
        } else if (pollingResult.status === 'error') {
          clearInterval(pollingInterval);
          console.error('Transcription error:', pollingResult.error);
        }
      }, 3000);
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = { text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(inputText);
      const response = await result.response;
      const botMessage: Message = { text: response.text(), sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);

      // Speak the bot's response
      speakText(botMessage.text);
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
    <div className="chatbot-container">
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
          placeholder="Type your message..."
        />
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;