const http = require('http')

let notes = [
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

const app = http.createServer((request, response) => {
response.writeHead(200, { 'Content-Type': 'application/json' })
response.end(JSON.stringify(notes))
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)