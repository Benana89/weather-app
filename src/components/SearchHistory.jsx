import { 
    Search, Trash2,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

export const SearchHistoryList = () => {
    const { searchHistory, fetchWeather, deleteHistoryRecord, formatTriggerTime, isDarkMode } = useWeather();
    
    const handleHistoryClick = (query) => {
        fetchWeather(query);
    };

     const historyCardBg = isDarkMode 
    ? "bg-[#1A1A1A80]/30 text-white "
    :"bg-white/20 text-black "

    const searchItemBg = isDarkMode 
    ? "bg-[#1A1A1A80]/50 text-white "
    :"bg-white/40"

    const searchItemButton = isDarkMode 
    ? "border-2 border-white/40 text-white/40 "
    :"text-black/50 bg-white"

    return (
        <div className={`pt-4 mt-6 rounded-[24px] p-8 ${historyCardBg}`}>
            <h2 className="text-lg flex items-center mb-4">
                Search History
            </h2>

            {searchHistory.length === 0 ? (
                <p className="text-sm italic">No search records yet for this session.</p>
            ) : (
                <ul className="space-y-2">
                    {searchHistory.map((record) => (
                        <li key={record.id} className={`flex justify-between items-center  rounded-lg text-sm p-4 ${searchItemBg}`}>
                            
                            {/* Content */}
                            <div className="grow flex flex-col sm:flex-row justify-between mr-3">
                                <p className="font-medium mr-4 whitespace-nowrap">
                                    {record.city}, {record.country}
                                </p>
                                <p className="text-xs sm:text-sm" style={{opacity: isDarkMode ? 0.5 : 0.7}}>
                                    {formatTriggerTime(record.timestamp)}
                                </p>
                            </div>

                            {/* Actions Group */}
                            <div className="flex gap-[10px] shrink-0">
                                
                                {/* Search Button */}
                                <button
                                    onClick={() => handleHistoryClick(record.searchQuery)}
                                    className={`p-1 rounded-full ${searchItemButton}`}
                                    aria-label="Re-run search"
                                >
                                    <Search className="w-4 h-4" />
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => deleteHistoryRecord(record.id)}
                                    className={`p-1 rounded-full ${searchItemButton}`}
                                    aria-label="Delete history record"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};