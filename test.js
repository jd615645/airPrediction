const fs = require('fs')

let sites = fs.readFileSync('./sites.json', 'utf8')
let predictionReg = fs.readFileSync('./predictionReg.json', 'utf8')

sites = JSON.parse(sites)
predictionReg = JSON.parse(predictionReg)

siteHash = []
sites.forEach((key) => {
  let siteName = key['siteName']
  let gps_lat = key['gps_lat']
  let gps_lon = key['gps_lon']
  siteHash[siteName] = {
    'lat': gps_lat,
    'lon': gps_lon
  }
})

let siteData = []

predictionReg.forEach((key) => {
  let siteName = key['local']

  if (siteHash[siteName] !== undefined) {
    let w0 = key['w0']
    let w1 = key['w1']
    let lat = siteHash[siteName]['lat']
    let lon = siteHash[siteName]['lon']

    let data = {
      'siteName': siteName,
      'w0': w0,
      'w1': w1,
      'lat': lat,
      'lon': lon
    }
    siteData.push(data)
  }
})

fs.writeFile(__dirname + '/siteData.json', JSON.stringify(siteData), (err) => {
  if (err) {
    console.error(err)
  }
})