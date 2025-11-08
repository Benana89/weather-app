import { 
    AlertTriangle, Loader2
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';

// Component for Current Weather Display (consumes context)
export const WeatherCardContent = () => {
    const { weatherData, loading, error, formatTemp, getWeatherIcon, isDarkMode } = useWeather();

    const textColor = isDarkMode ? 'text-white' : "text-black";
    const weatherInfoTextColor = isDarkMode ?  'text-white' : 'text-[#666666] opacity-80 ';
    const temperatureColor = isDarkMode ? 'text-white' : 'text-[#6C40B5]';
    const countryTextColor = isDarkMode ? 'text-white' : 'text-[#666666]';

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-48 text-white/90">
                <Loader2 className="w-8 h-8 mr-3 animate-spin" />
                <p className="mt-2 text-lg font-medium">Fetching weather data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-4 bg-red-500/50 border border-red-300 text-white rounded-xl">
                <AlertTriangle className="w-6 h-6 mr-3" />
                <p className="font-medium text-sm">{error}</p>
            </div>
        );
    }

    if (!weatherData) {
        return (
            <div className="text-center p-8 ">
                <p className="text-lg">Enter a city to get the forecast.</p>
            </div>
        );
    }

    // Determine H: XX° L: XX° format
    const tempMinMax = `H: ${formatTemp(weatherData.main.temp_max)}° L: ${formatTemp(weatherData.main.temp_min)}°`;

    // Function to format the current local time based on weather data timezone
    const formatLocalTime = (timezoneOffset) => {
        const utcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
        // Calculate the local time by adding the timezone offset (in seconds)
        const localTime = new Date(utcTime + timezoneOffset * 1000); 
        
        // Use the custom formatter logic for DD-MM-YYYY hh:mm A
        const date = localTime;
        console.log(date);
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        let hours = date.getHours();
        
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        hours = String(hours).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    };



    // Weather Data Display (matching the image layout)
    return (
        <div>
            
            {/* Top Section: Main Temp and Icon */}
            <div className="flex gap-5 items-end mb-2">
                <div className={textColor}>
                    <p className="font-medium mb-1" style={{opacity: isDarkMode ? 1:0.7}}>Today's Weather</p>
                    <span className={`text-7xl font-bold leading-none ${temperatureColor}`}>{formatTemp(weatherData.main.temp)}°</span>
                    <p className="text-sm font-light mt-1"  style={{opacity: isDarkMode ? 1:0.8}}>{tempMinMax}</p>
                    <span className={`font-semibold ${countryTextColor}`} >{weatherData.name}, {weatherData.sys.country}</span>
                </div>
                
                <div className='flex-1'>
                  <div className='-mt-8 -mr-8'>
                    {getWeatherIcon(weatherData.weather[0].id)}
                    </div>

                     <div className={`flex flex-col md:flex-row md:justify-between md:items-start items-end ${weatherInfoTextColor}`} >
                        <div className="order-first md:order-last">{weatherData.weather[0].main}</div>
                        <div>Humidity: {weatherData.main.humidity}%</div>
                        <div className="order-last md:order-first">{formatLocalTime(weatherData.timezone)}</div>
                    </div>
                </div>
            </div>

        </div>
    );
};
