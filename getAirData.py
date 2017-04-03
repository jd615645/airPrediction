# -*- coding:UTF-8 -*-

from math import radians, cos, sin, asin, sqrt
import json, requests, os

url = 'https://data.lass-net.org/data/'

# TW-EPA => last-all-epa.json
epa = ['last-all-epa.json']

# LASS devices      => last-all-lass.json
# AirBox devices    => last-all-airbox.json
# MAPS devices      => last-all-maps.json
# ProbeCube devices => last-all-probecube.json
fileName = ['last-all-lass.json', 'last-all-airbox.json', 'last-all-maps.json', 'last-all-probecube.json']

# 經度1，緯度1，經度2，緯度2 （十进制度数）
def haversine(lon1, lat1, lon2, lat2):
  # convert decimal degrees to radians 
  lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
  # haversine formula 
  dlon = lon2 - lon1 
  dlat = lat2 - lat1 
  a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
  c = 2 * asin(sqrt(a)) 
  km = 6367 * c
  return km

try:
  for name in epa:
    path = os.path.dirname(os.path.abspath(__file__))
    data = requests.get(url+name)
    data.encoding = 'utf-8'
    with open(path + '/' + name, 'w') as f:
      json.dump(data.json(), f)
    print(name + ' done!')
except:
  print('get data error!')

