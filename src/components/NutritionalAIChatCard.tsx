import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Mic, MicOff, Send, Image as ImageIcon, X, 
  Activity, CheckCircle2, BookmarkPlus, Clock, Zap, ArrowRight, CornerDownLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MockFoodItem } from '../data/mockFoodDb';

interface NutritionalAIChatCardProps {
  onSaveToAnalytics: (food: MockFoodItem) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  image?: string;
  time: string;
  parsed?: {
    name: string;
    sugarSpike: string;
    calories: number;
    carbs: string;
    protein: string;
    fat: string;
  };
}

export const NutritionalAIChatCard: React.FC<NutritionalAIChatCardProps> = ({
  onSaveToAnalytics,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [timeContextPrompt, setTimeContextPrompt] = useState('What did you eat for dinner?');
  const [currentTimeWindow, setCurrentTimeWindow] = useState('Night Window');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Compute Time-Based Context
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    let prompt = 'What did you eat for dinner?';
    let windowLabel = 'Night (8:00 PM - 5:59 AM)';

    if (hour >= 6 && hour < 12) {
      prompt = 'What did you eat for breakfast?';
      windowLabel = 'Morning (6:00 AM - 11:59 AM)';
    } else if (hour >= 12 && hour < 15) {
      prompt = 'What did you eat for lunch?';
      windowLabel = 'Afternoon (12:00 PM - 2:59 PM)';
    } else if (hour >= 15 && hour < 20) {
      prompt = 'What did you eat for the evening?';
      windowLabel = 'Evening (3:00 PM - 7:59 PM)';
    }

    setTimeContextPrompt(prompt);
    setCurrentTimeWindow(windowLabel);

    // Initial greeting from the AI assistant
    setMessages([
      {
        id: 'init_ai',
        sender: 'ai',
        text: prompt,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  // Voice speech-to-text recognition with Gemini 3.5 Transcribe fallback
  const toggleVoiceRecording = async () => {
    setVoiceError(null);

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecording(true);

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((r: any) => r[0].transcript)
            .join('');
          setInputText(transcript);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch {
        setIsRecording(false);
      }
    }

    // Fallback: record real microphone audio and transcribe server-side with Gemini
    if (navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        recorder.ondataavailable = (ev) => {
          if (ev.data.size > 0) {
            audioChunksRef.current.push(ev.data);
          }
        };

        recorder.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(audioChunksRef.current, {
            type: recorder.mimeType || 'audio/webm',
          });
          if (blob.size === 0) return;

          setIsTranscribing(true);
          try {
            const reader = new FileReader();
            const base64Audio: string = await new Promise((resolve, reject) => {
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            const res = await fetch('/api/transcribe-audio', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64Audio,
                mimeType: blob.type || 'audio/webm',
              }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
              throw new Error(data?.error || 'Audio transcription failed.');
            }
            if (data.transcript) {
              setInputText(data.transcript);
            }
          } catch (err: any) {
            setVoiceError(err?.message || 'Unable to transcribe audio.');
          } finally {
            setIsTranscribing(false);
          }
        };

        mediaRecorderRef.current = recorder;
        recorder.start();
        setIsRecording(true);
      } catch {
        setVoiceError('Microphone access denied. Please type or attach a meal image.');
        setIsRecording(false);
      }
    } else {
      setVoiceError('Voice recording is not supported in this browser.');
    }
  };

  // Image Attachment Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send message for nutritional analysis
  const handleSendMessage = async (textToSend?: string) => {
    const userPrompt = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!userPrompt && !attachedImage) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: userPrompt || 'Analyzed photo upload',
      image: attachedImage || undefined,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const historySnapshot = messages.slice(-6).map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    const sentImage = attachedImage;
    setAttachedImage(null);
    setIsAnalyzing(true);
    setVoiceError(null);

    try {
      const res = await fetch('/api/chat-nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userPrompt,
          image: sentImage,
          localTime: new Date().toISOString(),
          history: historySnapshot,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data?.error || 'AI nutritional analysis failed.');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: data.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          parsed: data.parsed,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'ai',
          text: `Unable to complete AI analysis: ${err?.message || 'Please try again.'}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 1-Click Save to Analytics
  const handleSaveParsedFood = (parsed: ChatMessage['parsed']) => {
    if (!parsed) return;
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#34d399', '#f472b6', '#38bdf8', '#fbbf24'],
    });

    const isHighSpike = parsed.sugarSpike.toLowerCase().includes('high');
    const isMediumSpike = parsed.sugarSpike.toLowerCase().includes('medium');

    const foodItem: MockFoodItem = {
      id: `chat_food_${Date.now()}`,
      name: parsed.name,
      calories: parsed.calories,
      protein: parsed.protein,
      carbs: parsed.carbs,
      fat: parsed.fat,
      fiber: '6g',
      good: isHighSpike ? 'Rapid Energy Available' : 'Protective Glycemic Buffer',
      bad: isHighSpike
        ? 'Rapid Glycemic Excursion (+40 mg/dL spike)'
        : isMediumSpike
        ? 'Moderate Sugar Excursion'
        : 'None (Optimal Steady Metabolic Response)',
      glycemicIndex: isHighSpike ? 75 : isMediumSpike ? 52 : 24,
      advice: isHighSpike
        ? 'Take a brisk 15-minute walk post-meal to suppress blood sugar peak.'
        : 'Steady glucose release curve maintained.',
    };

    onSaveToAnalytics(foodItem);
  };

  return (
    <div className="w-full bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-5 sm:p-7 shadow-xl shadow-emerald-950/5 relative overflow-hidden transition-all">
      {/* Background bioluminescent accents */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-rose-100/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Live Time Slot Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-neutral-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 border border-emerald-300/50 flex items-center justify-center text-emerald-700 shadow-xs">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight text-[#1C2E1E]">
                Context-Aware Nutritional AI
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                Gemini AI
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Type, speak, or upload your meal for real-time sugar spike and macro analysis
            </p>
          </div>
        </div>

        {/* Current Time Context Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 border border-neutral-200/90 text-xs text-neutral-700 shadow-xs self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-medium">{currentTimeWindow}</span>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 pb-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm shadow-xs ${
                  isUser
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                    : 'bg-white/90 border border-neutral-200/90 text-neutral-800 rounded-tl-none shadow-sm'
                }`}
              >
                {/* User attached photo thumbnail */}
                {msg.image && (
                  <div className="mb-2.5 rounded-xl overflow-hidden border border-white/20 max-h-48">
                    <img src={msg.image} alt="Uploaded meal" className="w-full object-cover" />
                  </div>
                )}

                {/* AI Structured Output or Simple Text */}
                {msg.parsed ? (
                  <div className="space-y-3">
                    {/* Food Identified */}
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                      <span className="font-semibold text-neutral-500 text-xs">Food Identified:</span>
                      <span className="font-bold text-sm text-[#1C2E1E]">{msg.parsed.name}</span>
                    </div>

                    {/* Sugar Spike Highlight (Mandatory High Priority) */}
                    <div
                      className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                        msg.parsed.sugarSpike.toLowerCase().includes('low')
                          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                          : msg.parsed.sugarSpike.toLowerCase().includes('high')
                          ? 'bg-rose-50/90 border-rose-200 text-rose-900'
                          : 'bg-amber-50/90 border-amber-200 text-amber-900'
                      }`}
                    >
                      <Zap
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          msg.parsed.sugarSpike.toLowerCase().includes('low')
                            ? 'text-emerald-600'
                            : msg.parsed.sugarSpike.toLowerCase().includes('high')
                            ? 'text-rose-600'
                            : 'text-amber-600'
                        }`}
                      />
                      <div>
                        <div className="font-bold text-xs">
                          Sugar Spike Potential:{' '}
                          <span className="uppercase underline">
                            {msg.parsed.sugarSpike.split(' ')[0]}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-90 mt-0.5">{msg.parsed.sugarSpike}</p>
                      </div>
                    </div>

                    {/* Macro Grid */}
                    <div className="grid grid-cols-4 gap-2 text-center pt-1">
                      <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                        <span className="text-[10px] text-neutral-400 font-semibold block uppercase">
                          Calories
                        </span>
                        <span className="text-xs font-bold text-neutral-800">
                          {msg.parsed.calories} kcal
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                        <span className="text-[10px] text-neutral-400 font-semibold block uppercase">
                          Carbs
                        </span>
                        <span className="text-xs font-bold text-neutral-800">
                          {msg.parsed.carbs}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                        <span className="text-[10px] text-neutral-400 font-semibold block uppercase">
                          Protein
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          {msg.parsed.protein}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-neutral-50 border border-neutral-100">
                        <span className="text-[10px] text-neutral-400 font-semibold block uppercase">
                          Fat
                        </span>
                        <span className="text-xs font-bold text-neutral-800">
                          {msg.parsed.fat}
                        </span>
                      </div>
                    </div>

                    {/* Save to Analytics Action Button */}
                    <div className="pt-2 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Ready to save to analytics.
                      </span>

                      <button
                        onClick={() => handleSaveParsedFood(msg.parsed)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>Save to Analytics</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                )}
              </div>
              <span className="text-[10px] text-neutral-400 mt-1 px-1">{msg.time}</span>
            </motion.div>
          );
        })}

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3.5 rounded-2xl bg-white/80 border border-neutral-200 text-xs text-neutral-600 w-fit"
          >
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <span>Analyzing nutritional breakdown & glycemic spike with Gemini AI...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Food Prompts */}
      <div className="mt-4 pt-3 border-t border-neutral-200/70">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-[11px]">
          <span className="text-neutral-400 font-medium shrink-0">Quick ask:</span>
          {[
            'Oatmeal with blueberries & chia',
            '2 slices of cheese pizza',
            'Chicken breast with quinoa & broccoli',
            'Masala dosa with coconut chutney',
          ].map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sample)}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-600 hover:text-emerald-700 whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Attached Image Preview */}
      {attachedImage && (
        <div className="relative mb-3 inline-block">
          <img
            src={attachedImage}
            alt="Attachment"
            className="w-16 h-16 rounded-xl object-cover border border-emerald-300 shadow-xs"
          />
          <button
            onClick={() => setAttachedImage(null)}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-500 text-white hover:bg-rose-600 cursor-pointer shadow-xs"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Voice Error Notice */}
      {voiceError && (
        <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
          <span>{voiceError}</span>
          <button
            type="button"
            onClick={() => setVoiceError(null)}
            className="text-rose-500 hover:text-rose-800 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input Bar: Text, Voice Transcription, Image Attach, and Send */}
      <div className="relative flex items-center gap-2 pt-1">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Attach Image Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-500 hover:text-neutral-800 border border-neutral-200 transition-colors cursor-pointer shadow-xs"
          title="Attach meal picture"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* Voice Recording / Live Transcription Button */}
        <button
          type="button"
          onClick={toggleVoiceRecording}
          disabled={isTranscribing}
          className={`p-2.5 rounded-2xl border transition-all cursor-pointer shadow-xs flex items-center justify-center ${
            isRecording
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : isTranscribing
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-white hover:bg-neutral-50 text-neutral-500 hover:text-emerald-700 border-neutral-200'
          }`}
          title={isRecording ? 'Listening... click to stop' : 'Record voice meal log'}
        >
          {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={
              isRecording
                ? 'Listening to your meal description...'
                : isTranscribing
                ? 'Transcribing voice with Gemini AI...'
                : `Type meal, question, or "${timeContextPrompt}"...`
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-white border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 transition-all shadow-inner"
          />
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() && !attachedImage}
          className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
