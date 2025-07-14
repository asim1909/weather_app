import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ImageBackground, ScrollView, RefreshControl, Keyboard, FlatList } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import axios from 'axios';
import WeatherCard from '../components/WeatherCard';
import ForecastList from '../components/ForecastList';
import { fetchWeather } from '../utils/fetchWeather';
import { fetchForecast } from '../utils/fetchForecast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';

const apikey = Constants.expoConfig.extra.openWeatherApiKey;
console.log('OpenWeather API Key:', apikey); // Debug log
const getUnitSymbol = (unit) => (unit === 'metric' ? '°C' : '°F');

const axiosInstance = axios.create({
  timeout: 7000, // 7 seconds timeout
});

export default function HomeScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [unit, setUnit] = useState('metric');
  const [favorites, setFavorites] = useState([]);
  const [lastCoords, setLastCoords] = useState(null); // Store last used coordinates

  // Load favorites from AsyncStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favs = await AsyncStorage.getItem('favorites');
        if (favs) setFavorites(JSON.parse(favs));
      } catch (e) {
        console.error('Failed to load favorites', e);
      }
    };
    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage
  const saveFavorites = async (newFavs) => {
    setFavorites(newFavs);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  // Add or remove current city from favorites
  const toggleFavorite = () => {
    if (!city) return;
    let newFavs;
    if (favorites.includes(city)) {
      newFavs = favorites.filter(fav => fav !== city);
    } else {
      newFavs = [...favorites, city];
    }
    saveFavorites(newFavs);
  };

  // Select a favorite city
  const selectFavorite = (favCity) => {
    setCity(favCity);
    handleSearch(favCity);
  };

  // Fetch weather and forecast for current location
  const getLocationWeather = async (selectedUnit = unit) => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission status:', status);
      if (status !== 'granted') {
        alert('Permission denied for location access.');
        setLoading(false);
        return;
      }
      // Use enableHighAccuracy: false for faster fetch
      const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: false });
      console.log('Location object:', location);
      const { latitude, longitude } = location.coords;
      setLastCoords({ latitude, longitude });
      const response = await axiosInstance.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=${selectedUnit}`
      );
      console.log('Weather API response:', response.data);
      setWeather(response.data);
      setCity(response.data.name);
      const forecastData = await axiosInstance.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${response.data.name}&appid=${apikey}&units=${selectedUnit}`
      );
      console.log('Forecast API response:', forecastData.data);
      setForecast(forecastData.data);
    } catch (error) {
      console.error('Error in getLocationWeather:', error);
      setWeather(null);
      setForecast(null);
      alert('Error getting weather from location.');
    }
    setLoading(false);
  };

  // When toggling units, fetch by last used coordinates if available, else by city
  useEffect(() => {
    const fetchData = async () => {
      if (lastCoords) {
        await getLocationWeather(unit);
      } else if (city) {
        await handleSearch(city);
      } else {
        await getLocationWeather(unit);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  // On mount, fetch location weather
  useEffect(() => {
    console.log('Initial mount: fetching location weather');
    getLocationWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (searchCity) => {
    const cityToSearch = searchCity || city;
    if (!cityToSearch) return;
    setLoading(true);
    Keyboard.dismiss();
    try {
      const data = await fetchWeather(cityToSearch, unit);
      setWeather(data);
      const forecastData = await fetchForecast(cityToSearch, unit);
      setForecast(forecastData);
    } catch (err) {
      setWeather(null);
      setForecast(null);
      alert('City not found!');
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getLocationWeather();
    setRefreshing(false);
  };

  const getBackgroundImage = () => {
    if (!weather) return require('../assets/sunny.jpg');
    const main = weather.weather[0].main.toLowerCase();
    if (main.includes('rain')) return require('../assets/rainy.jpg');
    if (main.includes('cloud')) return require('../assets/cloudy.jpg');
    return require('../assets/sunny.jpg');
  };

  // Toggle between Celsius and Fahrenheit
  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  // Location button handler
  const handleUseLocation = async () => {
    setCity('');
    setLastCoords(null); // Reset lastCoords so getLocationWeather always fetches fresh location
    await getLocationWeather();
  };

  return (
    <LinearGradient colors={['#e0eafc', '#cfdef3']} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Unit Toggle Button */}
          <TouchableOpacity style={styles.unitToggle} onPress={toggleUnit}>
            <Text style={styles.unitToggleText}>{getUnitSymbol(unit)}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Weather App</Text>
          <BlurView intensity={60} tint="light" style={styles.glassBox}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter city"
                placeholderTextColor="#888"
                value={city}
                onChangeText={setCity}
                returnKeyType="search"
                onSubmitEditing={() => handleSearch()}
              />
              <TouchableOpacity style={styles.button} onPress={() => handleSearch()} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
              {/* Favorite Button */}
              <TouchableOpacity style={styles.favButton} onPress={toggleFavorite}>
                <MaterialCommunityIcons
                  name={favorites.includes(city) ? 'star' : 'star-outline'}
                  size={28}
                  color={favorites.includes(city) ? '#ffd700' : '#888'}
                />
              </TouchableOpacity>
              {/* Use My Location Button */}
              <TouchableOpacity style={styles.locationButton} onPress={handleUseLocation}>
                <MaterialCommunityIcons name="crosshairs-gps" size={28} color="#007aff" />
              </TouchableOpacity>
            </View>
          </BlurView>

          {/* Favorites List */} 
          {favorites.length > 0 && (
            <View style={styles.favListBox}>
              <Text style={styles.favListTitle}>Favorites:</Text>
              <FlatList
                data={favorites}
                horizontal
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.favItem} onPress={() => selectFavorite(item)}>
                    <Text style={styles.favItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
          {loading && <ActivityIndicator size="large" color="#1e90ff" style={{ marginVertical: 20 }} />}
          {weather && (
            <BlurView intensity={60} tint="light" style={styles.glassBox}>
              <View style={styles.cardInner}>
                <WeatherCard weather={weather} unit={getUnitSymbol(unit)} />
              </View>
            </BlurView>
          )}
          {forecast && (
            <BlurView intensity={60} tint="light" style={styles.glassBox}>
              <View style={styles.cardInner}>
                <ForecastList forecast={forecast} unit={getUnitSymbol(unit)} />
              </View>
            </BlurView>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 32,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 50,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 40,
    fontWeight: '600',
    marginBottom: 36,
    color: '#222',
    letterSpacing: 1,
    textAlign: 'center',
  },
  glassBox: {
    width: '90%',
    maxWidth: 350,
    alignSelf: 'center',
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 18,
    paddingHorizontal: 12,
    color: '#222',
    backgroundColor: 'transparent',
    borderRadius: 12,
    fontWeight: '400',
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  cardInner: {
    padding: 12,
  },
  unitToggle: {
    position: 'absolute',
    top: 20,
    right: 30,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  unitToggleText: {
    fontSize: 18,
    color: '#007aff',
    fontWeight: '600',
  },
  favButton: {
    marginLeft: 8,
    padding: 4,
  },
  favListBox: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    padding: 8,
  },
  favListTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#007aff',
  },
  favItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    elevation: 2,
  },
  favItemText: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  locationButton: {
    marginLeft: 8,
    padding: 4,
    backgroundColor: 'rgba(0,122,255,0.08)',
    borderRadius: 16,
  },
});