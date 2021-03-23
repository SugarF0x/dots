import * as express from 'express'
import * as jwt from 'jsonwebtoken'
const router  = express.Router()

const PASSWORD = process.env.PASSWORD || '1234'
const SECRET = process.env.SECRET || '4321'

declare global {
  namespace Express {
    interface Request {
      access?: boolean
    }
  }
}

module.exports = (app: express.Express) => {
  app.use(async (req,res,next) => {
    req["access"] = false
    let token = ''
    if (req.cookies["auth._token.local"] && req.cookies["auth._token.local"].split(' ')[0] === 'Bearer') {
      token = req.cookies["auth._token.local"].split(' ')[1]
    } else if (req.headers && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (token !== '') {
      try {
        let decoded = jwt.verify(token, SECRET) as string | { access: boolean }
        if (typeof decoded === 'object' && decoded.access) {
          req["access"] = true
        }
        next()
      } catch(err) {
        next()
      }
    } else {
      next()
    }
  })

  router.post("/login", async (req, res) => {
    if (req.body.password) {
      if (req.body.password !== PASSWORD) {
        res.status(400).json({ result: 0, message: "Bad credentials" })
      } else {
        jwt.sign(
          { access: true },
          SECRET,
          (err: Error | null, token: string | undefined) => {
            res.json({ token })
          }
        )
      }
    } else {
      res.status(400).json({ result: 0, message: 'No password specified' })
    }
  })

  router.get("/me", async (req, res) => {
    if (req["access"]) {
      res.json({
        token: true
      })
    } else {
      res.status(401).json({ result: 0, message: "Unauthorized" })
    }
  })

  return router
}
