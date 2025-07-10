import 'dotenv/config';

export default {
  expo: {
    name: 'weather-app',
    slug: 'weather-app',
    version: '1.0.0',
    extra: {
      openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
    },
    // ...other config if needed
  },
}; 