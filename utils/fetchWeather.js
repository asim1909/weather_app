import axios from 'axios';
import Constants from 'expo-constants';

const apikey = Constants.expoConfig.extra.openWeatherApiKey;

export const fetchWeather = async (city, unit = 'metric') => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=${unit}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};
