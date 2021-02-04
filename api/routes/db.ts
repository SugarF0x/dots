import * as express from 'express'
import Dots, { IDots } from '../schemas/Dots'
const router  = express.Router()

module.exports = () => {
  // router.post("/addEntry", async (req, res) => {
  //   if (req["access"]) {
  //     // if logged in, one can proceed with DB modification
  //   } else {
  //     res.status(401).json({ result: 0, message: "Unauthorized" })
  //   }
  // })

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
