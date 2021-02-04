import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
const app = express.default()

/**
 * Establish MongoDB connection
 */
// const mongoose = require('mongoose')
// mongoose.Schema.Types.Boolean.convertToFalse.add("") // for empty value cases
//
// if (process.env.MONGO_DB !== 'false') {
//     // prevent duplicate connection on hot reload
//   if (!mongoose.connection.readyState) {
//     mongoose.connect(process.env.MONGO_DB, {
//       useCreateIndex: true,
//       useNewUrlParser: true,
//       useFindAndModify: true,
//       useUnifiedTopology: true
//     })
//
//     const db = mongoose.connection
//     db.on("error", error => consola.error(error))
//     db.once("open", () => consola.success('Connected to SGFX database'))
//   }
// } else {
//   consola.info('MongoDB disabled')
// }

app.use(bodyParser.json())
app.use(express.json())
app.use(cookieParser.default())

const routeAuth = require('./routes/auth')
// const routeDB   = require('./routes/db')

app.use('/auth', routeAuth(app))
// app.use('/db', routeDB(app))

module.exports = app
