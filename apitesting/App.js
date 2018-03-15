import React from 'react';
import { ActivityIndicator, Text, View, Image  } from 'react-native';

export default class App extends React.Component {

  constructor(props){
    super(props);
    this.state = { 
      isLoading: true, 
      aqi: [], 
      temp: [], 
      city: [], 
      latitude: null, 
      longitude: null,
      error: null,
      weatherconditions: [],
      translation: [],
    }
  }

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    )

    return fetch('http://mazer.curiousest.com/loc/air/67/?auth_token=d5dae6a6ed7d9f43c073a25072b5092a246b7f9d')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("****** ARRIVED ******");
    })
    .catch((error) => {
      console.log(error);
    });

    return fetch('http://api.airvisual.com/v2/nearest_city?lat=' + this.state.latitude + '&lon=' + this.state.longitude +'&key=k4RpPvALiGn3NL6ai')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          city: responseJson.data.city,
          aqi: responseJson.data.current.pollution.aqius,
          temp: responseJson.data.current.weather.tp,
          weatherconditions: responseJson.data.current.weather.ic
        }, function(){

        });
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  determineWeatherConditions() {
    let weathercond = null;

    if(this.state.weatherconditions === "01d") {
      weathercond = require("./images/ic_weather_clear.png");
    } else if(this.state.weatherconditions === "01n") {
      weathercond =  require("./images/ic_weather_clear.png");
    } else if (this.state.weatherconditions === "13d") {
      weathercond = require("./images/ic_weather_snow.png");
    } else if (this.state.weatherconditions === "02d") {
      weathercond = require("./images/ic_weather_clouds.png");
    } else if (this.state.weatherconditions === "02n") {
      weathercond =  require("./images/ic_weather_clouds.png");
    } else if (this.state.weatherconditions === "03d") {
      weathercond = require("./images/ic_weather_clouds.png");
    } else if (this.state.weatherconditions === "04d") {
      weathercond = require("./images/ic_weather_clouds.png");
    } else if (this.state.weatherconditions === "09d") {
      weathercond = require("./images/ic_weather_rain.png");
    } else if (this.state.weatherconditions === "10d") {
      weathercond =  require("./images/ic_weather_rain.png");
    } else if (this.state.weatherconditions === "10n") {
      weathercond =  require("./images/ic_weather_rain.png");
    } else if (this.state.weatherconditions === "11d") {
      weathercond =  require("./images/ic_weather_thunderstorm.png");
    } else if (this.state.weatherconditions === "50d") {
      weathercond =  require("./images/ic_weather_drizzle.png");
    }

    return weathercond;
  }
  

  render() {
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    
    let img = this.determineWeatherConditions().toString();

    return(
      <View style={{flex: 1, paddingTop:20}}>
        <Text> City: {this.state.city} </Text>
        <Text> AQI: {this.state.aqi}</Text>
        <Text> Temperature: {this.state.temp}</Text>
        <Image source={img} />
        <Text>{this.state.translation}</Text>
      </View>
    );
  }
}
