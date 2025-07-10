import axios from 'axios';

const apikey = "52b4b30e80ea54992a38162219caba8f";

export const fetchForecast = async (city, unit = 'metric') => {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}&units=${unit}`;
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    throw error;
  }
};
