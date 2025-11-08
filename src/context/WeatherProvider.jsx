import React, { useState, useCallback, useEffect } from "react";
import { WeatherContext } from "./WeatherContext";
import sun from "../assets/sun.png"; // Local sun icon image
import cloud from "../assets/cloud.png"; // Local cloud icon image

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || "YOUR_API_KEY_HERE"; // <<<--- IMPORTANT: REPLACE THIS WITH YOUR ACTUAL OpenWeatherMap API KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const WeatherProvider = ({ children }) => {
  // Weather States
  const [cityInput, setCityInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // History State
  const [searchHistory, setSearchHistory] = useState([]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const storedTheme = sessionStorage.getItem("weatherAppTheme");

      if (storedTheme === "light") return false;
      if (storedTheme === "dark") return true;
      return false;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      const storedHistory = sessionStorage.getItem("weatherSearchHistory");
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

  useEffect(() => {
    sessionStorage.setItem("weatherAppTheme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        "weatherSearchHistory",
        JSON.stringify(searchHistory)
      );
    } catch (e) {
      console.error("Could not save history to sessionStorage", e);
    }
  }, [searchHistory]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prevMode) => !prevMode);
  }, []);

  const formatTriggerTime = useCallback((timestamp) => {
    if (!timestamp) return "Time not available";

    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = String(hours).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  }, []);

  const fetchWeather = useCallback(
    async (searchQuery) => {
      const searchParam = searchQuery.trim();

      if (!searchParam) {
        setError("Please enter a city and country (e.g., 'Paris, FR').");
        setLoading(false);
        return;
      }

      if (API_KEY === "YOUR_API_KEY_HERE") {
        setError(
          "API Key not configured. Please replace 'YOUR_API_KEY_HERE' in the code with your OpenWeatherMap API key."
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setWeatherData(null);

      try {
        const response = await fetch(
          `${BASE_URL}?q=${searchParam}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              `City/Country '${searchParam}' not found. Please check the spelling or format.`
            );
          }
          throw new Error(
            "Failed to fetch weather data. Check input and API key."
          );
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
        setSearchHistory((prevHistory) => {
          const updatedHistory = [newRecord, ...prevHistory].filter(
            (item, index, self) =>
              index ===
              self.findIndex((t) => t.searchQuery === item.searchQuery)
          );
          return updatedHistory.slice(0, 10);
        });
      } catch (err) {
        console.error("Fetch Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [API_KEY]
  );

  const deleteHistoryRecord = useCallback((id) => {
    setSearchHistory((prevHistory) =>
      prevHistory.filter((record) => record.id !== id)
    );
  }, []);

  const formatTemp = (temp) => Math.round(temp);

  const getWeatherIcon = (weatherId) => {
    const commonClass = "drop-shadow-lg";

    // Group weather IDs by range (Thunder, Drizzle/Rain, Clear, Clouds, Default)
    switch (true) {
      // Clear Sky (800)
      case weatherId === 800:
        return (
          <div className="w-[157px] md:w-[300px] h-24">
            <img
              src={sun}
              alt="sun"
              className={`w-[157px] md:w-[300px] sm:h-[157px] md:h-[300px] absolute -top-[70px] md:-top-[110px] right-2`}
            />
          </div>
        );

      // Thunderstorm (200-299)
      case weatherId >= 200 && weatherId < 300:
      // Drizzle / Rain (300-599)
      case weatherId >= 300 && weatherId < 600:
      // Clouds (801 and up)
      case weatherId >= 801:
        return (
          <div className="w-[157px] md:w-[300px] h-24">
            <img
              src={cloud}
              alt="cloud"
              className={`w-[157px] sm:w-[300px] sm:h-[300px] absolute -top-[70px] sm:-top-[110px] right-2 `}
            />
          </div>
        );

      // Default / Weather ID not provided
      default:
        return (
          <div className="w-[157px] md:w-[300px] h-24">
            <img
              src={cloud}
              alt="cloud"
              className={`w-[157px] sm:w-[300px] sm:h-[300px] absolute -top-[70px] sm:-top-[110px] right-2 `}
            />
          </div>
        );
    }
  };

  const getBackgroundClass = () =>
    "bg-gradient-to-b from-purple-400/80 to-indigo-500/80";

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
    toggleTheme,
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  );
};
