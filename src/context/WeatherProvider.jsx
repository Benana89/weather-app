import React, { useState, useCallback, useEffect} from 'react';
import { WeatherContext } from './WeatherContext';
import sun from "../assets/sun.png"; // Local sun icon image
import cloud from "../assets/cloud.png"; // Local cloud icon image
import {  Cloud, Zap 
} from 'lucide-react';


const API_KEY = "17bbda84c541166d22dd2daf6185f992"; // <<<--- IMPORTANT: REPLACE THIS WITH YOUR ACTUAL OpenWeatherMap API KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const WeatherProvider = ({ children }) => {
    // Weather States
    const [cityInput, setCityInput] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // History State
    const [searchHistory, setSearchHistory] = useState([]);

     const [isDarkMode, setIsDarkMode] = useState(() => {
        try {
            const storedTheme = sessionStorage.getItem('weatherAppTheme');
            console.log("Loaded theme from sessionStorage:", storedTheme);
            
            return storedTheme === 'light' ? false : true;
        } catch (e) {
            return true;
        }
    });
    
    // --- Session Storage Management ---
    
    // Load history from sessionStorage on component mount
    useEffect(() => {
        try {
            const storedHistory = sessionStorage.getItem('weatherSearchHistory');
            if (storedHistory) {
                const parsedHistory = JSON.parse(storedHistory);
                if (Array.isArray(parsedHistory)) {
                    setSearchHistory(parsedHistory.slice(0, 10));
                }
            }
        } catch (e) {
            console.error("Could not load history from sessionStorage", e);
        }
    }, []);

    // Effect to save theme preference
    useEffect(() => {
        console.log("Saving theme to sessionStorage:", isDarkMode ? "dark" : "light");
        
        sessionStorage.setItem('weatherAppTheme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // Save history to sessionStorage whenever the state changes
    useEffect(() => {
        try {
            sessionStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
        } catch (e) {
            console.error("Could not save history to sessionStorage", e);
        }
    }, [searchHistory]);

     const toggleTheme = useCallback(() => {
        setIsDarkMode(prevMode => !prevMode);
    }, []);

    // Helper function: formats the time of the search trigger (user's device time)
    const formatTriggerTime = useCallback((timestamp) => {
        if (!timestamp) return 'Time not available';
        
        const date = new Date(timestamp);
        
        // Pad numbers to ensure two digits (e.g., 07 instead of 7)
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        // Convert to 12-hour format
        hours = hours % 12;
        hours = hours ? hours : 12; // The hour '0' should be '12'
        hours = String(hours).padStart(2, '0');

        // Target format: DD-MM-YYYY hh:mm A (e.g., 07-11-2025 09:41 PM)
        return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    }, []);


    // --- Core Action: Fetch Weather ---
    const fetchWeather = useCallback(async (searchQuery) => {
        const searchParam = searchQuery.trim();
        
        if (!searchParam) {
            setError("Please enter a city and country (e.g., 'Paris, FR').");
            setLoading(false);
            return;
        }
        
        if (API_KEY === "YOUR_API_KEY_HERE") {
            setError("API Key not configured. Please replace 'YOUR_API_KEY_HERE' in the code with your OpenWeatherMap API key.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        setWeatherData(null);

        try {
            // Note: OpenWeatherMap automatically infers the timezone based on the location.
            const response = await fetch(`${BASE_URL}?q=${searchParam}&appid=${API_KEY}&units=metric`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`City/Country '${searchParam}' not found. Please check the spelling or format.`);
                }
                throw new Error("Failed to fetch weather data. Check input and API key.");
            }

            const data = await response.json();
            setWeatherData(data);

            // Save successful search to sessionStorage state
            const newRecord = {
                id: Date.now().toString(), 
                searchQuery: searchParam,
                city: data.name,
                country: data.sys.country,
                timestamp: Date.now(), // Capture the trigger time
            };
            
            // Add new record to the front of the array and limit to 10
            setSearchHistory(prevHistory => {
                const updatedHistory = [newRecord, ...prevHistory].filter((item, index, self) => 
                    index === self.findIndex((t) => (
                        t.searchQuery === item.searchQuery // Remove duplicates by query string
                    ))
                );
                return updatedHistory.slice(0, 10);
            });

        } catch (err) {
            console.error("Fetch Error:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [API_KEY]);

    // --- Core Action: Delete History Record (local state update only) ---
    const deleteHistoryRecord = useCallback((id) => {
        setSearchHistory(prevHistory => prevHistory.filter(record => record.id !== id));
    }, []);

    // Helper to format temperature
    const formatTemp = (temp) => Math.round(temp);
    
    // Helper to select icon (Simplified for the glassmorphism aesthetic)
    const getWeatherIcon = (weatherId) => {
        const commonClass = "drop-shadow-lg";
        if (!weatherId) return <Cloud className={`w-12 h-12 text-white/80 ${commonClass}`} />;
        
        // Clear Sky
        if (weatherId === 800) return (
            <div className="w-[157px] md:w-[300px] h-24">
                <img src={sun} alt='sun' className={`w-[157px] md:w-[300px] sm:h-[157px] md:h-[300px] absolute -top-[70px] md:-top-[110px] right-10 ${commonClass}`}  />
            </div>
        );
        // Clouds
        if (weatherId >= 801) return (
             <div className="w-[157px] md:w-[300px] h-24">
                <img src={cloud} alt='cloud' className={`w-[157px] sm:w-[300px] sm:h-[300px] absolute -top-[70px] sm:-top-[110px] right-10 ${commonClass}`} style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.7))' }} />
            </div>
        );
        // Rain/Drizzle
        if (weatherId >= 300 && weatherId < 600) return <Cloud className={`w-24 h-24 text-blue-300 ${commonClass}`} />;
        // Thunder
        if (weatherId >= 200 && weatherId < 300) return <Zap className={`w-24 h-24 text-yellow-300 ${commonClass}`} />;

        return <Cloud className={`w-24 h-24 text-white/80 ${commonClass}`} />;
    };

    // Determine the background gradient based on the image's style
    const getBackgroundClass = () => 'bg-gradient-to-b from-purple-400/80 to-indigo-500/80';
    
    // Expose all state and actions via the context value
    const contextValue = {
        cityInput,
        setCityInput,
        weatherData,
        loading,
        error,
        searchHistory,
        fetchWeather,
        deleteHistoryRecord,
        formatTemp,
        getWeatherIcon,
        getBackgroundClass,
        formatTriggerTime,
        isDarkMode,
        toggleTheme
    };

    return (
        <WeatherContext.Provider value={contextValue}>
            {children}
        </WeatherContext.Provider>
    );
};