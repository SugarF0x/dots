export default function levenshtein (a: string, b: string): any {
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
