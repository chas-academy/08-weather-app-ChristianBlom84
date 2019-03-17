import React from 'react';
import { Route } from 'react-router-dom';

import '../index.css';
import WeatherOverview from '../WeatherApp/WeatherOverview';
import WeatherDailyComponent from '../WeatherApp/WeatherDaily/WeatherDailyComponent';
import WeatherFiveDayOverview from '../WeatherApp/WeatherFiveDay/WeatherFiveDayOverview';

export default class ApiDarkSky extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      apiResponse: {},
      error: null,
      isLoaded: false,
      position: ''
    };

    this.apiKey = process.env.REACT_APP_DARKSKY_API_KEY;
    this.baseApiUrl = "https://api.darksky.net/forecast/";
    this.stockholm = "/59.3260668, 17.841971";
  }

  getCurrentWeather() {
    this.setState({
      isLoaded: false
    });

    fetch(`${process.env.REACT_APP_CORS}${this.baseApiUrl}${this.apiKey}/${this.props.coords}${(this.props.units) ? this.props.units : this.state.position}`)
      .then(res => {
        return res.json();
      })
      .then(weather => {
        this.setState({
          isLoaded: true,
          apiResponse: weather
        })
        if (this.state.isLoaded) {
          console.log(weather);
          console.log(this.state.apiResponse);
        }
      })
      .catch(err => {
        this.setState({
          isLoaded: true,
          error: err
        })
        console.log("Error, something went wrong" + err);
      })
  };

  componentDidMount() {
    this.getCurrentWeather();
  }

  componentDidUpdate(prevProps) {
    if (this.props.units !== prevProps.units || this.props.coords !== prevProps.coords) {
      this.getCurrentWeather();
    }
  }

  render() {
    const { apiResponse, error, isLoaded } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (isLoaded) {
      return(
        <div className="mainContainer">
          <Route
            exact path="/"
            render={(props) => <WeatherOverview {...props} weather={apiResponse} isLoaded={isLoaded} />}
          />
          <Route
            path="/daily"
            render={(props) => <WeatherDailyComponent {...props} weather={apiResponse} isLoaded={isLoaded} />}
          />
          <Route
            path="/fiveday"
            render={(props) => <WeatherFiveDayOverview {...props} weather={apiResponse} isLoaded={isLoaded} />}
          />
        </div>
      );
    } else {
      return(<p>Loading...</p>);
    }
  }
}