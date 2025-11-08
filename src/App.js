import bgLight from "./assets/bg-light.png"; 
import bgDark from "./assets/bg-dark.png"; 
import { 
    Sun, Moon
} from 'lucide-react';

import { SearchForm } from './components/SearchForm';
import { WeatherCardContent } from './components/WeatherCard';
import { SearchHistoryList } from './components/SearchHistory';

import { WeatherProvider } from './context/WeatherProvider';
import { useWeather } from './context/WeatherContext';

const AppCore = () => {
    const { getBackgroundClass, isDarkMode, toggleTheme } = useWeather();
    const bgClass = getBackgroundClass();

    const bgImage = isDarkMode ? bgDark : bgLight;

    const themeIcon = isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />;
    const themeButtonClasses = isDarkMode 
        ? "text-white/80 hover:text-white bg-purple-700/50 hover:bg-purple-700" 
        : "text-gray-800/80 hover:text-gray-800 bg-white/50 hover:bg-white/70";

    const weatherCardBg = isDarkMode 
    ? "bg-[#1A1A1A80]/30"
    :"bg-white/20 border border-white/30 "
    
    return (
        <div className={`min-h-screen flex flex-col items-center p-4 ${bgClass}`}
             style={{ backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed', }}>

                  {/* Theme Toggle */}
            <button
                onClick={toggleTheme}
                className={`absolute top-2 right-4 p-2 rounded-full transition duration-300 shadow-lg ${themeButtonClasses}`}
                aria-label="Toggle Theme"
            >
                {themeIcon}
            </button>

            <div className="w-full max-w-[700px] mt-8">
                <SearchForm />
            </div>

            <div className={`w-full max-w-[700px] mt-[70px] mb-4 backdrop-blur-xl rounded-[30px] p-8 md:p-10 flex flex-col grow ${weatherCardBg}`}>
                
                <WeatherCardContent />
                
                <div className="flex flex-col grow">
                     <SearchHistoryList />
                </div>
            </div>
            
        </div>
    );
};

const App = () => (
    <WeatherProvider>
        <AppCore />
    </WeatherProvider>
);

export default App;

