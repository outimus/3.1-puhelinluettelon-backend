const mongoose = require('mongoose')

const addedName = process.argv[3]
const addedNr = process.argv[4]

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://OM:${password}@cluster0.vkmxypp.mongodb.net/puhelinluettelo_App`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})

person.save().then(result => {
  console.log(`added ${addedName} number ${addedNr} to phonebook`)
  mongoose.connection.close()
})

Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })