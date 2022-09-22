const http = require('http')
const app = express()

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "040-1111111"
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
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})