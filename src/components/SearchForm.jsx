import { 
    Search,  Loader2
} from 'lucide-react';

import { useWeather } from '../context/WeatherContext';

// Component for the Search Form (consumes context)
export const SearchForm = () => {
    const { cityInput, setCityInput, loading, fetchWeather, isDarkMode } = useWeather();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        fetchWeather(cityInput);

        // Clear the input field immediately after submission
        setCityInput('');
    };

     const inputClasses = isDarkMode 
        ? "text-white placeholder-white/60 bg-[#1A1A1A80]/50"
        : "placeholder-black/40 bg-white/20"; // Light mode input matches image
    
    const buttonClasses = isDarkMode
        ? "bg-[#28124D] "
        : "bg-[#6C40B5] ";

    return (
        <form onSubmit={handleSubmit} className="flex space-x-0 mb-6 w-full mx-auto gap-[10px]">
            <div className="relative grow">
                <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="Enter City, Country (e.g., Singapore)"
                    className={`w-full p-4 pr-12 text-lg  rounded-[20px] outline-none backdrop-blur-md sm:h-[60px] h-12 ${inputClasses}`}
                    style={{ fontSize: '1.1rem' }}
                />
            </div>
            <button
                type="submit"
                className={`text-white p-4 rounded-[20px] -ml-12 sm:w-[60px] sm:h-[60px] w-12 h-12 flex items-center justify-center shadow-lg ${buttonClasses}`}
                disabled={loading}
                aria-label="Search Weather"
            >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
            </button>
        </form>
    );
};