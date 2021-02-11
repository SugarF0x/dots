import { HERO_NAMES } from "~/assets/consts"

export interface IDots {
  date: Date
  name: string,
  hero: typeof HERO_NAMES[number],
  rating: number,
  comment: string
}

const mongoose = require("mongoose")
const dotsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    immutable: true
  },
  name: {
    type: String,
    required: true
  },
  hero: {
    type: String as () => typeof HERO_NAMES[number],
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String,
    required: true
  }
})

// Prevent crash on hot reload as a result of duplicate schema creation
let toExport: any
try {
  toExport = mongoose.model('Dots')
} catch (err) {
  toExport = mongoose.model('Dots', dotsSchema)
}

export default toExport
