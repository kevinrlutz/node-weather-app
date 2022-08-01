const request = require('postman-request')

const weather = (lat, lon, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=505d24015c439726afa9b20dd3dabe99&query=' + lat + ',' + lon + '&units=f'

    request({ url: url, json: true }, (error,  { body }) => {
        if (error) {
            callback('Unable to connect to weatherstack API', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, {
                weather: body.current.weather_descriptions[0],
                temperature: body.current.temperature
            })
        }
    })
}

module.exports = weather