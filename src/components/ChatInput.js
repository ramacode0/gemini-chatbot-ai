import { useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';

const ChatInput = ({ onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLoading || (!input.trim() && !imageFile)) return;
        onSendMessage(input, imageFile);
        setInput('');
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center bg-gemini-input rounded-full p-2">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-full hover:bg-gray-600 transition-colors"
                >
                    <Paperclip size={20} className="text-gemini-text-secondary" />
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder={imageFile ? `${imageFile.name} - Ketik pesan...` : "Ketik pesan..."}
                    className="flex-1 bg-transparent px-4 text-gemini-text-primary focus:outline-none resize-none"
                    rows={1}
                    style={{ maxHeight: '100px' }}
                />
                <button
                    type="submit"
                    disabled={isLoading || (!input.trim() && !imageFile)}
                    className="p-3 rounded-full bg-gemini-card disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                    <Send size={20} />
                </button>
            </div>
        </form>
    );
};

export default ChatInput;
