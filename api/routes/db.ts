import * as express from 'express'
import Dots from '../schemas/Dots'
import { Entry } from "~/assets/consts"
import { levenshtein } from "../../assets/utils"
import consola from 'consola'
const router = express.Router()

module.exports = () => {
  router.post("/addEntry", async (req, res) => {
    if (req.access) {
      new Dots({ ...req.body, date: new Date() }).save()
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

  const resThen = (res: express.Response, message: any) => {
    if (!message) res.status(404).json({ result: 0, message: 'Not found' })
    else res.status(200).json({ result: 1, message })
  }
  const resCatch = (res: express.Response, err: Error) => {
    res.status(500).json({ result: 0, message: err })
  }

  router.get('/search', async (req, res) => {
    let name = req.query.name
    Dots.find({ name: { $regex: name, $options: "i" } }, null, { sort: { date: -1 } })
      .then((entries: Entry[]) => resThen(res, entries))
      .catch((err: Error) => resCatch(res, err))
  })

  router.get('/getLastFive', async (req, res) => {
    Dots.find({}, null, { sort: { date: -1 }, limit: 5 })
      .then((entries: Entry[]) => resThen(res, entries))
      .catch((err: Error) => resCatch(res, err))
  })

  router.get('/getCount', async (req, res) => {
    Dots.estimatedDocumentCount({})
      .then((entries: number) => resThen(res, entries))
      .catch((err: Error) => resCatch(res, err))
  })

  router.get('/getAll', async (req, res) => {
    Dots.find({}, null, { sort: { date: -1 } })
      .then((entries: Entry[]) => resThen(res, entries))
      .catch((err: Error) => resCatch(res, err))
  })

  router.get('/bulkSearch', async (req, res) => {
    const IGNORED_NAMES = [
      'SugarF0x',
      'UNFORGIVEN',
      'Maks333f',
      'Just'
    ]

    let names = req.query.names as string[]
    names = names.filter(name => {
      let distance = 100;
      IGNORED_NAMES.forEach(ignored => {
        let lev = levenshtein(ignored.toLowerCase(), name.toLowerCase())
        if (lev < distance) distance = lev
      })
      if (distance >= 2) return true
    })

    Dots.find({}, null, { sort: { date: -1 } })
      .then((entries: Entry[]) => {
        entries = entries.filter(entry => {
          let distance = 100
          names.forEach(name => {
            let lev = levenshtein(name.toLowerCase(), entry.name.toLowerCase())
            if (lev < distance && !IGNORED_NAMES.includes(entry.name)) distance = lev
          })
          if (distance <= 1) return true
        })
        resThen(res, entries)
      })
      .catch((err: Error) => resCatch(res, err))
  })

  return router
}
