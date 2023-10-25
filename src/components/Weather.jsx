// Weather.js
import React, { useEffect, useState, useRef } from "react";
import cloud from "../assets/cloud.png";
import sun from "../assets/sun.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

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

        const currentTime = moment().format("DD-MM-YYYY hh:mm a");
        // Add the search to the search history
        setSearchHistory([
          ...searchHistory,
          {
            location: `${data.name}, ${data.sys.country}`,
            timestamp: currentTime,
          },
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
      <div className="input-area flex">
        <div className="relative flex-1	 mr-2">
          <input
            className="form-control"
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <label className="floating-input" htmlFor="city">
            City
          </label>
        </div>
        <div className="relative flex-1	 mr-2">
          <input
            className="form-control"
            id="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <label className="floating-input" htmlFor="country">
            Country
          </label>
        </div>
        <button className="search-btn" onClick={handleFetchWeather}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
        </button>
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
                  {search.location}

                  <div>
                    <span className="mr-2"> {search.timestamp}</span>
                    <button
                      className="search-item-btn mr-2"
                      onClick={() => handleReselectSearch(index)}
                    >
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                    <button
                      className="search-item-btn"
                      onClick={() => handleDeleteSearch(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
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
