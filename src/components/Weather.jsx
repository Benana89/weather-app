// Weather.js
import React, { useEffect, useState, useRef } from "react";
import cloud from "../assets/cloud.png";
import sun from "../assets/sun.png";

const Weather = () => {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const flag = useRef(false);

  useEffect(() => {
    if (flag.current) {
      handleFetchWeather();
      flag.current = false;
    }
  }, [city, country]);

  const apiKey = "17bbda84c541166d22dd2daf6185f992"; // Replace with your API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;

  const handleFetchWeather = () => {
    setError(null);
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("City not found");
        }
        return response.json();
      })
      .then((data) => {
        setWeatherData(data);

        // Add the search to the search history
        setSearchHistory([
          ...searchHistory,
          `${data.name}, ${data.sys.country}`,
        ]);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const renderWeatherImage = () => {
    if (weatherData) {
      const weatherCondition = weatherData.weather[0].main.toLowerCase();
      if (weatherCondition === "rain") {
        return <img className="image-style" src={cloud} />; // Cloud image for rain
      } else {
        return <img className="image-style" src={sun}></img>; // Sun image for other conditions
      }
    }
    return null;
  };

  const handleDeleteSearch = (index) => {
    // Remove the selected search history item by its index
    const updatedSearchHistory = [...searchHistory];
    updatedSearchHistory.splice(index, 1);
    setSearchHistory(updatedSearchHistory);
  };

  const handleReselectSearch = (index) => {
    // Retrieve and re-search the selected search history item
    const selectedSearch = searchHistory[index];
    const [selectedCity, selectedCountry] = selectedSearch.split(", ");

    setCity(selectedCity);
    setCountry(selectedCountry);

    flag.current = true;
  };

  return (
    <div className="overall-area">
      <div className="input-area">
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <button onClick={handleFetchWeather}>Get Weather</button>
        {error && <p>{error}</p>}
      </div>

      <div className="weather-area">
        <div className="weather-placeholder"> {renderWeatherImage()}</div>
        {weatherData && (
          <div className="header-left">
            <div>Today's Weather</div>
            <div className="main-temperature">{weatherData.main.temp}°</div>
            <div>
              H: {weatherData.main.temp_max}° L: {weatherData.main.temp_min}°
            </div>
            <div>
              {weatherData.name}, {weatherData.sys.country}
            </div>
          </div>
        )}
        <div className="search-area">
          <div className="search-text">Search History</div>

          {searchHistory.length === 0 ? (
            <p>No Record</p>
          ) : (
            <div>
              {searchHistory.map((search, index) => (
                <div className="search-item" key={index}>
                  {search}

                  <div>
                    <button onClick={() => handleReselectSearch(index)}>
                      Re-Search
                    </button>
                    <button onClick={() => handleDeleteSearch(index)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
