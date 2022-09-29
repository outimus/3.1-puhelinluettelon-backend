const mongoose = require("mongoose")

const url = process.env.MONGODB_URI

mongoose.connect(url)
.then(result => {
    console.log("connected to MongoDB")
})
.catch((error) => {
    console.log("error connecting to MongoDB: ", error.message)
})

//Pitääkö olla id?
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (!process.argv[3]) {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
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
        mongoose.connection.close()
      })
}

/*Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })*/

module.exports = mongoose.model('Person', personSchema)