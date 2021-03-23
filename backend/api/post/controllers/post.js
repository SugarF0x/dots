'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

function levenshtein (a, b) {
  let aLen = a.length
  let bLen = b.length
  if (aLen === 0) return bLen
  if (bLen=== 0) return aLen
  let tmp, i, j, prev, val, row, ma, mb, mc, md, bprev

  if (aLen> bLen) {
    tmp = a
    a = b
    b = tmp
  }

  row = new Int8Array(aLen+1)
  // init the row
  for (i = 0; i <= aLen; i++) {
    row[i] = i
  }

  // fill in the rest
  for (i = 1; i <= bLen; i++) {
    prev = i
    bprev = b[i - 1]
    for (j = 1; j <= aLen; j++) {
      if (bprev === a[j - 1]) {
        val = row[j-1]
      } else {
        ma = prev+1
        mb = row[j]+1
        mc = ma - ((ma - mb) & ((mb - ma) >> 7))
        md = row[j-1]+1
        val = mc - ((mc - md) & ((md - mc) >> 7))
      }
      row[j - 1] = prev
      prev = val
    }
    row[aLen] = prev
  }
  return row[aLen]
}

module.exports = {
  async bulk(ctx) {
    let names = ctx.query.name
    const entries = await strapi.services.post.find({ _sort: 'createdAt:DESC' })
    return entries.filter(entry => {
      let distance = 100
      names.forEach(name => {
        let lev = levenshtein(name.toLowerCase(), entry.name.toLowerCase())
        if (lev < distance) distance = lev
      })
      return distance <= 1
    })

    // TODO: take another look at this
    // TODO: messages are to contain not just the array of entries, but also the names that did match to tag parse results as matched
    // let message = [] as { match: string; entry: Entry }[]
    // entries.forEach(entry => {
    //   let distance = 100
    //   let match = ''
    //   names.forEach(name => {
    //     let lev = levenshtein(name.toLowerCase(), entry.name.toLowerCase())
    //     if (lev < distance && !IGNORED_NAMES.includes(entry.name)) distance = lev
    //     if (lev <= 1) match = name
    //   })
    //   if (distance <= 1) message.push({ match, entry })
    // })
    // resThen(res, message)
  }
};
