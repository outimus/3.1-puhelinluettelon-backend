const express = require('express')
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const { response } = require('express')
require('dotenv').config()
const Person = require("./models/person")
const { default: mongoose } = require('mongoose')
const { db } = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

morgan.token("body", (req) => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(morgan("tiny"))
app.use(cors())

const url = process.env.MONGODB_URI
mongoose.connect(url).then(result => {
  console.log("connected to MongoDB")
})
.catch((error) => {
  console.log("error connecting to MongoDB: ", error.message)
})

if (!process.argv[3]) {
  console.log("phonebook:")
  Person.find({}).then(result => {
      result.forEach(person => {
        console.log(person.name, person.number)
      })
    })
}

const addedName = process.argv[3]
const addedNr = process.argv[4]

if (process.argv.length > 3) {
  const person = new Person({
      name: process.argv[3],
      number: process.argv[4],    
  })
  person.save().then(result => {
      console.log(`added ${addedName} number ${addedNr} to phonebook`)
    })
}

/*Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})*/


const tunniste = (min, max) => {
  return (
    Math.round(Math.random() * (max - min) + min)
  )
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  const määrä = 0 // Miten saan määrän muuttujaan?
  let pvm = new Date()
  res.send(`<h4>Phonebook has info for ${määrä} people<h4/><h4>${pvm}<h4/>`)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.send(person.number)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.post('/api/persons', morgan(":body"), (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: "name is missing"
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number is missing"
    })
  }
  // Tämä ei toimi. "body.map" on väärin.
  /*if (body.map(x => x.name === body.name).includes(true)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }*/
  const person = new Person({
    id: tunniste(10, 100),
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({error: "malformatted id"})
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})