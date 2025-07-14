# Weather App

A modern, feature-rich React Native weather app with an Apple-style glass UI and comprehensive weather information.

## Features

- **Current Weather**: Get weather by city search or device location
- **5-Day Forecast**: Detailed weather predictions for the next 5 days
- **Unit Conversion**: Toggle between Celsius (°C) and Fahrenheit (°F)
- **Favorites System**: Save and quickly access your favorite cities
- **Location Services**: One-tap access to current location weather
- **Dynamic Background**: Clean gradient background (no more changing images)
- **Secure API Key Management**: Environment variables for API security
- **Offline Support**: Cached weather data for offline viewing
- **Pull-to-Refresh**: Refresh weather data with a simple swipe

## Recent Updates

### 🚀 New Features Added
- **Favorites/Saved Locations**: Save cities as favorites and access them quickly
- **Dynamic Unit Conversion**: Toggle between Celsius and Fahrenheit with real-time updates
- **Improved Location Services**: Faster location fetching with better UX
- **Enhanced Security**: API keys now stored securely using environment variables
- **Modern UI**: Replaced dynamic backgrounds with clean gradient design
- **Performance Improvements**: Added API timeouts and optimized location fetching

### 🔧 Technical Improvements
- **Environment Variables**: Secure API key management with `.env` file
- **AsyncStorage**: Persistent storage for favorite cities
- **Error Handling**: Better error messages and fallback handling
- **Loading States**: Improved loading indicators and user feedback
- **API Optimization**: 7-second timeout for faster response handling

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/asim1909/weather_app.git
   cd weather_app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   npx expo install expo-blur expo-location axios expo-linear-gradient @react-native-async-storage/async-storage dotenv
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the project root
   - Add your OpenWeather API key:
     ```
     OPENWEATHER_API_KEY=your_api_key_here
     ```

4. **Run the app**:
   ```bash
   npx expo start
   ```

## Usage

- **Search Cities**: Enter a city name and tap search
- **Use My Location**: Tap the location button (crosshairs icon) for current location weather
- **Toggle Units**: Tap the °C/°F button to switch temperature units
- **Save Favorites**: Tap the star icon next to any city to save it
- **Access Favorites**: Use the horizontal favorites list below the search bar
- **Refresh**: Pull down to refresh weather data

## API

This app uses the [OpenWeatherMap API](https://openweathermap.org/api) for weather data.

## Contributing

Feel free to open issues or submit pull requests to help improve this app.

## License

This project is open source and available under the [MIT License](LICENSE).

---

Enjoy the weather! 🌤️