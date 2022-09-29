const express = require('express')
const app = express()
const morgan = require("morgan")
const cors = require("cors")

morgan.token("body", (req) => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan("tiny"))
app.use(cors())
app.use(express.static('build'))


let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "54654646"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "040-545454545"
    },
    {
      id: 4,
      name: "Mary Poppendick",
      number: "12-23"
    }
  ]
let määrä = persons.length
let pvm = new Date()

const tunniste = (min, max) => {
  return (
    Math.round(Math.random() * (max - min) + min)
  )
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  res.send(`<h4>Phonebook has info for ${määrä} people<h4/><h4>${pvm}<h4/>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.send(person.number)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
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
  
  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})