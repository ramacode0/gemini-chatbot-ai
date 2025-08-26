"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';

export default function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all chat sessions on initial load
    useEffect(() => {
        const fetchSessions = async () => {
            const { data, error } = await supabase
                .from('chat_sessions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching sessions:', error);
            } else {
                setSessions(data);
                if (data.length > 0 && !activeSessionId) {
                    handleSelectSession(data[0].id);
                } else if (data.length === 0) {
                    handleNewChat();
                }
            }
        };
        fetchSessions();
    }, []);

    // Fetch messages for the active session
    useEffect(() => {
        if (activeSessionId) {
            const fetchMessages = async () => {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('chat_messages')
                    .select('*')
                    .eq('session_id', activeSessionId)
                    .order('created_at', { ascending: true });

                if (error) {
                    console.error('Error fetching messages:', error);
                } else {
                    setMessages(data.map(msg => ({ role: msg.role, content: msg.content, imageUrl: msg.image_url })));
                }
                setIsLoading(false);
            };
            fetchMessages();
        }
    }, [activeSessionId]);

    const handleNewChat = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('chat_sessions')
            .insert([{ title: 'Percakapan Baru' }])
            .select()
            .single();

        if (error) {
            console.error('Error creating new session:', error);
        } else {
            setSessions([data, ...sessions]);
            setActiveSessionId(data.id);
            setMessages([]);
        }
        setIsLoading(false);
    };

    const handleSelectSession = (sessionId) => {
        setActiveSessionId(sessionId);
    };

    const handleSendMessage = async (userInput, imageFile = null) => {
        if (!userInput.trim() && !imageFile) return;
        setIsLoading(true);

        let imageUrl = null;
        let base64Image = null;

        if (imageFile) {
            // For display
            imageUrl = URL.createObjectURL(imageFile);

            // For API
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            await new Promise((resolve) => {
                reader.onload = () => {
                    base64Image = reader.result.split(',')[1];
                    resolve();
                };
            });
        }

        const userMessage = { role: 'user', content: userInput, imageUrl };
        setMessages(prev => [...prev, userMessage]);

        // Save user message to Supabase
        await supabase.from('chat_messages').insert({
            session_id: activeSessionId,
            role: 'user',
            content: userInput,
            image_url: imageUrl, // Note: Storing blob URL, for persistent storage upload to Supabase Storage
        });

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: userInput,
                    history: messages,
                    image: base64Image,
                    mimeType: imageFile ? imageFile.type : null,
                }),
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const data = await response.json();
            const modelMessage = { role: 'model', content: data.text };

            setMessages(prev => [...prev, modelMessage]);

            // Save model response to Supabase
            await supabase.from('chat_messages').insert({
                session_id: activeSessionId,
                role: 'model',
                content: data.text,
            });

        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = { role: 'model', content: "Maaf, terjadi kesalahan saat menghubungi AI." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-gemini-bg font-sans">
            <Sidebar
                isOpen={isSidebarOpen}
                onNewChat={handleNewChat}
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelectSession={handleSelectSession}
            />
            <div className="flex-1 flex flex-col transition-all duration-300">
                <ChatArea
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    messages={messages}
                    isLoading={isLoading}
                    onSendMessage={handleSendMessage}
                />
            </div>
        </div>
    );
}
