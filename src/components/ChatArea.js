import ChatInput from './ChatInput';
import { Menu, User, Bot } from 'lucide-react';

const ChatArea = ({ isSidebarOpen, toggleSidebar, messages, isLoading, onSendMessage }) => {
    return (
        <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="p-4 flex items-center gap-4 border-b border-gemini-card">
                <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gemini-card">
                    <Menu size={20} />
                </button>
                <h1 className="text-lg font-medium">Chat</h1>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-3xl mx-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-4 mb-6 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gemini-accent flex items-center justify-center">
                                    <Bot size={20} color="black" />
                                </div>
                            )}
                            <div className={`p-4 rounded-lg max-w-lg ${msg.role === 'user' ? 'bg-gemini-user-bg border border-gemini-card' : 'bg-gemini-model-bg'}`}>
                                {msg.imageUrl && <img src={msg.imageUrl} alt="Uploaded content" className="rounded-md mb-2 max-w-xs" />}
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-600 flex items-center justify-center">
                                    <User size={20} />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gemini-accent flex items-center justify-center animate-pulse">
                                <Bot size={20} color="black" />
                            </div>
                            <div className="p-4 rounded-lg bg-gemini-model-bg">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gemini-text-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gemini-text-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gemini-text-secondary rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="p-4 md:p-6 border-t border-gemini-card">
                <div className="max-w-3xl mx-auto">
                    <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default ChatArea;
