import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import consola from 'consola'
const app = express.default()

mongoose.Schema.Types.Boolean.convertToFalse.add("") // for empty value cases
mongoose.connect('mongodb://localhost/sgfx', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true
})
mongoose.connection.on("error", error => consola.error(error))

app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser.default())

const routeAuth = require('./routes/auth')
const routeDB = require('./routes/db')

app.use('/auth', routeAuth(app))
app.use('/db', routeDB(app))

module.exports = { path: '/api', handler: app }
