"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Calendar, User, FileText, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {YtAnalyze , YtAsk} from '@/service/ytAnalyzer';
export default function YoutubeAnalyzer() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVideoSubmit = async () => {
    if (!videoUrl.trim()) return;

      setIsLoading(true);
      try {
       const data = await YtAnalyze(videoUrl);
       console.log("success", data);
       setVideoData(data);

      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
  };

  const handleAsk = async () => {
  if (!inputMessage.trim() || !videoData) return;

  // Add user message
  setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);
  const currentQuestion = inputMessage;
  setInputMessage('');
  setIsLoading(true);

  try {
    const answer = await YtAsk(videoData.video_id, currentQuestion);
    // Add AI response
    setMessages(prev => [...prev, { type: 'ai', content: answer }]);
  } catch (error) {
    console.error('Error asking question:', error);
    setMessages(prev => [...prev, { 
      type: 'ai', 
      content: 'Sorry, I encountered an error processing your question.' 
    }]);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl font-light tracking-tight text-neutral-900 mb-3">
            Video Analysis
          </h1>
          <p className="text-neutral-500 text-lg font-light">
            Intelligent conversation with video content
          </p>
        </motion.div>

        {/* URL Input Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-8">
              <label className="block text-sm font-medium text-neutral-700 mb-4 tracking-wide uppercase text-xs">
                Video URL
              </label>
              <div className="flex gap-4">
                <Input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVideoSubmit()}
                  placeholder="Enter Link"
                  className="flex-1 h-12 bg-neutral-50 border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-neutral-900 placeholder:text-neutral-400 rounded-md"
                />
                <Button
                  onClick={handleVideoSubmit}
                  disabled={isLoading}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white h-12 px-8 rounded-md font-medium transition-colors"
                >
                  {isLoading ? (
                    'Processing...'
                  ) : (
                    <span className="flex items-center gap-2">
                      Analyze
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Video Info Card */}
        <AnimatePresence>
          {videoData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-12"
            >
              <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-3 gap-8 p-8">
                  {/* Thumbnail */}
                  <div className="md:col-span-1">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className="relative rounded-md overflow-hidden shadow-md group"
                    >
                      <img
                        src={videoData.thumbnail}
                        alt="Video thumbnail"
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                      <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-medium text-white">
                        {videoData.duration}
                      </div>
                    </motion.div>
                  </div>

                  {/* Video Info */}
                  <div className="md:col-span-2 space-y-5">
                    <div>
                      <h2 className="text-2xl font-medium text-neutral-900 leading-tight mb-3">
                        {videoData.title}
                      </h2>
                      <div className="h-px bg-neutral-200 w-16"></div>
                    </div>
                    
                    <div className="flex flex-wrap gap-6 text-sm text-neutral-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-neutral-400" />
                        <span className="font-medium">{videoData.channelName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neutral-400" />
                        <span>{videoData.publishedAt}</span>
                      </div>
                    </div>

                    <div className="text-neutral-600 text-sm leading-relaxed border-l-2 border-neutral-200 pl-4">
                      {videoData.description}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Section */}
        <AnimatePresence>
          {videoData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-8 py-5 border-b border-neutral-200">
                  <h3 className="font-medium text-neutral-900 tracking-wide uppercase text-xs">
                    Conversation
                  </h3>
                </div>

                {/* Messages */}
                <div className="h-[500px] overflow-y-auto p-8 space-y-6 bg-neutral-50">
                  <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg px-5 py-4 ${
                            msg.type === 'user'
                              ? 'bg-neutral-900 text-white'
                              : 'bg-white text-neutral-900 border border-neutral-200 shadow-sm'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-6 border-t border-neutral-200 bg-white">
                  <div className="flex gap-3">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                      placeholder="Ask a question about this video..."
                      className="flex-1 h-12 bg-neutral-50 border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-neutral-900 placeholder:text-neutral-400 rounded-md"
                    />
                    <Button
                      onClick={handleAsk}
                      disabled={!inputMessage.trim()}
                      className="bg-neutral-900 hover:bg-neutral-800 text-white h-12 px-6 rounded-md transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .bg-neutral-50 {
          background-color: #fafafa;
        }
      `}</style>
    </div>
  );
}