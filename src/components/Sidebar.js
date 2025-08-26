import { MessageSquare, Plus } from 'lucide-react';

const Sidebar = ({ isOpen, onNewChat, sessions, activeSessionId, onSelectSession }) => {
    return (
        <div className={`bg-gemini-sidebar text-gemini-text-primary flex flex-col transition-all duration-300 ${isOpen ? 'w-64 p-4' : 'w-0 p-0'} overflow-hidden`} >
            <button
                onClick={onNewChat}
                className="flex items-center justify-between w-full p-2 mb-4 text-sm rounded-full bg-gemini-card hover:bg-gray-700 transition-colors"
            >
                <span>Buat Sesi Baru</span>
                <Plus size={18} />
            </button>

            <div className="flex-1 overflow-y-auto">
                <p className="text-xs font-semibold text-gemini-text-secondary mb-2 px-2">Riwayat</p>
                <ul>
                    {sessions.map((session) => (
                        <li key={session.id}>
                            <button
                                onClick={() => onSelectSession(session.id)}
                                className={`w-full text-left text-sm px-2 py-2 rounded-md truncate ${activeSessionId === session.id ? 'bg-gemini-accent/20 text-gemini-accent' : 'hover:bg-gemini-card'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={16} />
                                    <span>{session.title}</span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
