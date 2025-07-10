import axios from 'axios';

const apikey = "52b4b30e80ea54992a38162219caba8f";

export const fetchWeather = async (city, unit = 'metric') => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=${unit}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};
