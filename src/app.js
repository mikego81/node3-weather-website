const express = require('express')
const path = require('path')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

// create the express application
const app = express()

// these are Express config setups for static content and handlebars views/templating
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// set the handlebars templating engine and views locations
app.set('view engine', 'hbs') // set handlebars as the views engine for templates
app.set('views', viewsPath) // tell express where to find handlebars views
hbs.registerPartials(partialsPath)
app.use(express.static(publicDirectoryPath)) // where to find the static public files to serve

cityState = 'Houston TX'

app.get('', (req, res) => {
    // this renders the handlebars at views/index.hbs
    res.render('index', { 
        title: 'Weather',
        cityState,
     })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        cityState,
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'Here is the help message',
        title: 'Help',
        cityState,
    })
})

// JSON endpoint
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address (e.g. Boston or New York)'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, { description, temperature, feelLikeTemp } = {}) => {
            if(error) {
                return({ error })
            }
            res.send({
                description,
                temperature,
                feelLikeTemp,
                location
            })
        })
    })
})

app.get('/products' , (req, res) => {
    if (!req.query.search) {
        return res.send({ // can return here so don't have to do the else
            error: 'You must provide a search term'
        })
    } 

    console.log(req.query)
    res.send({
        products: []
    })
    
    
})

app.get('/help/*', (req, res) => {

    res.render('404', {
        title: 'Help 404 page',
        cityState,
        message: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 page',
        cityState,
        message: 'Page not found'
    })
})

app.listen(4000, () => {
    console.log('Server is running on port: 4000')
})
