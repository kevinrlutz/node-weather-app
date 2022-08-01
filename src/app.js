const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./util/geocode')
const weather = require('./util/weather')

const app = express()

const publicDirPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Kevin Lutz'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Weather App - About',
        name: 'Kevin Lutz'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Weather App - Help',
        name: 'Kevin Lutz'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'Address must be provided!'
        })
    }
    
    const address = req.query.address

    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        } else {
            console.log('Weather for', location)
        
            weather(latitude, longitude, (weatherError, { weather, temperature } = {}) => {
                if (weatherError) {
                    return res.send({ weatherError })
                } else {
                    res.send({
                        location,
                        weather,
                        temperature
                    })
                }
            })
        }
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Not Found!',
        name: 'Kevin Lutz',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Not Found!',
        name: 'Kevin Lutz',
        errorMessage: 'Page not found!'
    })
})

app.listen(3000, () => {
    console.log('server started on port 3000')
})