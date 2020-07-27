# :cloud: Weather-arg

## :ok_hand: Code Quality Status
![Tests](https://github.com/gastonpereyra/weather-arg/workflows/Tests/badge.svg)
[![Coverage Status](https://img.shields.io/coveralls/github/gastonpereyra/weather-arg/master.svg)](https://coveralls.io/r/gastonpereyra/weather-arg?branch=master)

## :eyes: Description
A Package to consult the weather in Argentina

## Installation

```
npm i weather-arg
```

## Usage

```js
const WeatherArg = require('weather-arg');

// Get all substation Weather

const substationWeathers = await WeatherArg.getWeathers();

/*
output: [
    {
        id: 9949,
        name: 'Cutral Co',
        province: 'Neuquén',
        lastUpdate: 2020-07-26T22:00:00.000Z,
        humidity: 62,
        pressure: 982.1,
        st: 5.2,
        visibility: 15,
        windSpeed: 14,
        weatherId: 0,
        description: 'Despejado',
        temperature: 7.8,
        windDirection: 'Oeste',
        temperatureDescription: '7.8ºC'
    },
    ...180 more
]
*/

// Get substation Weather by Province

const substationWeathers = await WeatherArg.getWeathersByProvince('Neuquén');

/*
output: [
    {
        id: 9949,
        name: 'Cutral Co',
        province: 'Neuquén',
        lastUpdate: 2020-07-26T22:00:00.000Z,
        humidity: 62,
        pressure: 982.1,
        st: 5.2,
        visibility: 15,
        windSpeed: 14,
        weatherId: 0,
        description: 'Despejado',
        temperature: 7.8,
        windDirection: 'Oeste',
        temperatureDescription: '7.8ºC'
    },
    ...10 more
]
*/

// Get substation Weather by Name

const substationWeathers = await WeatherArg.getWeathersByName('Cutral Co');

/*
output: [
    {
        id: 9949,
        name: 'Cutral Co',
        province: 'Neuquén',
        lastUpdate: 2020-07-26T22:00:00.000Z,
        humidity: 62,
        pressure: 982.1,
        st: 5.2,
        visibility: 15,
        windSpeed: 14,
        weatherId: 0,
        description: 'Despejado',
        temperature: 7.8,
        windDirection: 'Oeste',
        temperatureDescription: '7.8ºC'
    }
]
*/

// Get substation Weather by ID

const substationWeather = await WeatherArg.getWeatherById(9949);

/*
output: {
    id: 9949,
    name: 'Cutral Co',
    province: 'Neuquén',
    lastUpdate: 2020-07-26T22:00:00.000Z,
    humidity: 62,
    pressure: 982.1,
    st: 5.2,
    visibility: 15,
    windSpeed: 14,
    weatherId: 0,
    description: 'Despejado',
    temperature: 7.8,
    windDirection: 'Oeste',
    temperatureDescription: '7.8ºC'
}
*/

// Get substation Weather by Coordinates

const substationWeather = await WeatherArg.getWeatherByCoordinates('-38.93712236','-69.22969054');

/*
output: {
    id: 9949,
    name: 'Cutral Co',
    province: 'Neuquén',
    lastUpdate: 2020-07-26T22:00:00.000Z,
    humidity: 62,
    pressure: 982.1,
    st: 5.2,
    visibility: 15,
    windSpeed: 14,
    weatherId: 0,
    description: 'Despejado',
    temperature: 7.8,
    windDirection: 'Oeste',
    temperatureDescription: '7.8ºC'
}
*/
```
