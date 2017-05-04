const fs = require('fs')
let promise = require('bluebird')
let request = promise.promisifyAll(require('request'), {multiArgs: true})
const firebase = require('firebase')

let config = {
  apiKey: 'AIzaSyD-YNvYmEjGPd2cDyVtiKykUg4tkSASkl8',
  authDomain: 'airdata-a643c.firebaseapp.com',
  databaseURL: 'https://airdata-a643c.firebaseio.com',
  projectId: 'airdata-a643c',
  storageBucket: 'airdata-a643c.appspot.com',
  messagingSenderId: '367753495244'
}
firebase.initializeApp(config)

let db = firebase.database()

let rootPath = 'https://data.lass-net.org/data/'

let fileName = [
  'last-all-epa.json',
  'last-all-lass.json',
  'last-all-lass4u.json',
  'last-all-maps.json',
  'last-all-airbox.json',
  'last-all-probecube.json',
  'last-all-indie.json'
]
let srcData = {'epa': [], 'lass': [], 'lass4u': [], 'lassmaps': [], 'airbox': [], 'probecube': [], 'indie': []}
let sites = ['epa', 'lass', 'lass4u', 'lassmaps', 'airbox', 'probecube', 'indie']

let urlList = []
for (let i = 0; i < fileName.length; i++) {
  urlList.push(rootPath + fileName[i])
}

promise.map(urlList, (url) => {
  return request.getAsync(url).spread((response, body) => {
    return [JSON.parse(body), url]
  })
}).then((res) => {
  // results is an array of all the parsed bodies in order
  res[0][0]['feeds'].forEach((key, val) => {
    let data = {
      'SiteName': val['SiteName'],
      'LatLng': {
        'lat': val['gps_lat'],
        'lng': val['gps_lon']
      },
      'SiteGroup': 'ProbeCube',
      'Data': {
        'temp': undefined,
        'humi': undefined,
        'pm25': val['PM2_5']
      },
      'time': val['timestamp'],
      'uniqueKey': undefined
    }
    srcData['probecube'].push(data)
    let ref = db.ref('/probecube')
    // console.log(srcData['probecube'][0])
    ref.set(srcData['probecube'][0])
  })
  for (let i = 1; i <= 4; i++) {
    let feeds = res[i][0]['feeds']
    feeds.forEach((val, key) => {
      let siteGroup = ''
      let site = ''
      switch(i) {
        case 1:
          siteGroup = 'LASS'
          site = 'lass'
          break
        case 2:
          siteGroup = 'LASS-4U'
          site = 'lass4u'
          break
        case 3:
          siteGroup = 'LASS-MAPS'
          site = 'lassmaps'
          break
        case 4:
          siteGroup = 'AirBox'
          site = 'airbox'
          break
      }
      let data = {
        'SiteName': val['SiteName'],
        'LatLng': {
          'lat': val['gps_lat'],
          'lng': val['gps_lon']
        },
        'SiteGroup': siteGroup,
        'Data': {
          'pm25': val['s_d0'],
          'temp': val['s_t0']===undefined?0:val['s_t0'],
          'humi': val['s_h0']===undefined?0:val['s_h0']
        },
        'time': val['timestamp'],
        'uniqueKey': val['device_id']
      }
      srcData[site].push(data)
    })
  }
  for (let i = 5; i <= 6; i++) {
    let feeds = res[i][0]['feeds']
    
    let siteGroup = ''
    let site = ''
    switch(i) {
      case 5:
        siteGroup = 'ProbeCube'
        site = 'probecube'
        break
      case 6:
        siteGroup = 'Indie'
        site = 'indie'
        break
    }
    feeds.forEach((val, key) => {
      let data = {
        'SiteName': val['SiteName'],
        'LatLng': {
          'lat': val['gps_lat'],
          'lng': val['gps_lon']
        },
        'SiteGroup': siteGroup,
        'Data': {
          'temp': val['Temperature'],
          'humi': val['Humidity'],
          'pm25': val['PM25']
        },
        'time': val['timestamp'],
        'uniqueKey': val['device_id']
      }
      srcData[site].push(data)
    })
  }

  // sites.forEach((val, key) => {
  //   // fs.writeFile(__dirname + '/data/' + val + '.json', JSON.stringify(srcData[val]), (err) => {
  //   //   if (err) {
  //   //     console.error(err)
  //   //   }
  //   // })
  //   console.log(val + ' done!')
  //   console.log(srcData[val])

  //   // let ref = db.ref('/' + val)
  //   // ref.set(srcData[val])
  // })

}).catch((err) => {
  console.log(err)
})