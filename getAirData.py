
import json, requests, os

url = 'https://data.lass-net.org/data/'

# TW-EPA => last-all-epa.json

# LASS devices      => last-all-lass.json
# AirBox devices    => last-all-airbox.json
# MAPS devices      => last-all-maps.json
# ProbeCube devices => last-all-probecube.json
fileName = ['last-all-lass.json', 'last-all-airbox.json', 'last-all-maps.json', 'last-all-probecube.json']

try:
  for name in fileName:
    path = os.path.dirname(os.path.abspath(__file__))
    data = requests.get(url+name)
    data.encoding = 'utf-8'
    with open(path + '/' + name, 'w') as f:
      json.dump(data.json(), f)
except:
  print('get data error!')