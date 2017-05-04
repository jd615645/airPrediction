const firebase = require('firebase')
let promise = require('bluebird')
let request = promise.promisifyAll(require('request'), {multiArgs: true})

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
let ref = db.ref('/')

let rootPath = 'https://data.lass-net.org/data/'

let fileName = ['last-all-epa.json', 'last-all-lass.json', 'last-all-lass4u.json', 'last-all-maps.json', 'last-all-airbox.json', 'last-all-probecube.json', 'last-all-indie.json']
let urlList = []
let srcData = {'epa': [], 'lass': [], 'lass4u': [], 'lassmaps': [], 'airbox': [], 'probecube': [], 'indie': []}
let sites = ['epa', 'lass', 'lass4u', 'lassmaps', 'airbox', 'probecube', 'indie']

for (let i = 0; i < fileName.length; i++) {
  urlList.push(rootPath + fileName[i])
}

request(urlList[1], function (err, res, body) {
  if (!err && res.statusCode == 200) {
    console.log(body[0])
    let feeds = body[0]['feeds']
    let srcData = []
    feeds.forEach((val, key) => {
      let data = {
        'SiteName': val['SiteName'],
        'LatLng': {
          'lat': val['gps_lat'],
          'lng': val['gps_lon']
        },
        'SiteGroup': 'LASS',
        'Data': {
          'pm25': val['s_d0'],
          'temp': val['s_t0']===undefined?0:val['s_t0'],
          'humi': val['s_h0']===undefined?0:val['s_h0']
        },
        'time': val['timestamp'],
        'uniqueKey': val['device_id']
      }
      srcData.push(data)
    })
    // ref.set(JSON.parse(srcData))
  }
})


// let value = {
//   Test1: 't1',
//   Test2: 't2'
// }

// ref.set(value)

// ref.once('value', function(snapshot) {
//  console.log(snapshot.val())
// })