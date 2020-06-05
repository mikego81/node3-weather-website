const request = require('postman-request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=c1d7fe74fb8ba2853ce94b675d7ca045&query=' + latitude + ',' + longitude + '&units=f'
    
    request({ url, json: true }, (error, { body } = {}) => {
        if (error) {
            callback('Unable to connect to the weather service.', undefined)
        } else if (body.error) {
            callback('Unable to find the location you provided. Try a different one!')
        } else {
            callback(undefined, {
                description: body.current.weather_descriptions[0],
                temperature: body.current.temperature,
                feelsLikeTemp: body.current.feelslike, 
                windspeed: body.current.wind_speed,
                humidity: body.current.humidity
            })
        }
    })
}

module.exports = forecast