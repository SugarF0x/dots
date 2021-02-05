import * as express from 'express'
import Dots, { IDots } from '../schemas/Dots'
import consola from 'consola'
const router  = express.Router()

module.exports = () => {
  router.post("/addEntry", async (req, res) => {
    if (req.access) {
      new Dots({...req.body}).save()
        .then(() => {
          consola.success(`A new entry has been created: ${req.body.name} (${req.body.hero}) [${req.body.rating}]`)
          res.status(201).json({ result: 1, message: "New entry created" })
      })
        .catch((err: Error | undefined) => {
          res.status(500).json({ result: 0, message: err })
        })
    } else {
      res.status(401).json({ result: 0, message: "Unauthorized" })
    }
  })

  router.get('/search', async (req, res) => {
    let name = req.query.name

    Dots.find({
      name: {
        $regex: name,
        $options: "i"
      }
    }, (err: Error | undefined, entries: IDots[] | undefined) => {
      if (!err && entries) {
        res.json(entries)
      }
    })
  })

  return router
}
