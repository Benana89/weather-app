// Weather.js
import React, { useState } from "react";

const Weather = () => {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const apiKey = "17bbda84c541166d22dd2daf6185f992"; // Replace with your API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric`;

  const handleFetchWeather = () => {
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

  return (
    <div className="overall-area">
      <div>
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
      </div>
      {error && <p>{error}</p>}
      <div className="weather-area">
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

        <div className="search-area">
          <div className="search-text">Search History</div>
          <div>
            {searchHistory.map((search, index) => (
              <div className="search-item" key={index}>
                {search}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
