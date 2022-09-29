const express = require('express')
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const { response } = require('express')
require('dotenv').config()
const Person = require("./models/person")

morgan.token("body", (req) => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan("tiny"))
app.use(cors())
app.use(express.static('build'))

/*let määrä = persons.length*/
let pvm = new Date()

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

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/info', (req, res) => {
  res.send(`<h4>Phonebook has info for ${määrä} people<h4/><h4>${pvm}<h4/>`)
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
  if (person) {
    response.send(person.number)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', morgan(":body"), (request, response) => {
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
  if (persons.map(x => x.name === body.name).includes(true)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  const person = {
    id: tunniste(määrä, 100),
    name: body.name,
    number: body.number
  }
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})