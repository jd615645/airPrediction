# -*- coding:UTF-8 -*-

import csv
import cv2
import sys
import numpy as np
import matplotlib.pyplot as plt
from sklearn import datasets, linear_model
import math
import json

years = ['103', '104', '105']
locations = ['三義站', '三重站', '中壢站', '中山站', '二林站', '仁武站', '冬山站', '前金站', '前鎮站', '南投站', '古亭站', '善化站', '嘉義站', '土城站', '埔里站', '基隆站', '士林站', '大同站', '大園站', '大寮站', '大里站', '安南站', '宜蘭站', '小港站', '屏東站', '崙背站', '左營站', '平鎮站', '彰化站', '復興站', '忠明站', '恆春站', '斗六站', '新店站', '新港站', '新營站', '新竹站', '新莊站', '朴子站', '松山站', '板橋站', '林口站', '林園站', '桃園站', '楠梓站', '橋頭站', '永和站', '汐止站', '沙鹿站', '淡水站', '湖口站', '潮州站', '竹山站', '竹東站', '線西站', '美濃站', '臺南站', '臺東站', '臺西站', '花蓮站', '苗栗站', '菜寮站', '萬華站', '萬里站', '西屯站', '觀音站', '豐原站', '金門站', '關山站', '陽明站', '頭份站', '馬公站', '馬祖站', '鳳山站', '麥寮站', '龍潭站']

def get_mod(local):
    list=[]
    result=[]
    row=0
    colum=0
    error=0

    for year in years:
        filename = './EPAhistory/' + year + '年' + local + '.csv'
        # 把讀檔路徑转换为utf-8格式
        ufilename = unicode(filename , 'utf8')

        try:
          with open(ufilename, 'r') as f:
              #dat中所有字符串读入data
              data = f.readlines()
              for line in data:
                  #将单个数据分隔开存好
                  odom = line.split(',')
                  colum=len(odom)
                  if 'PM2.5'in odom:
                      try:
                          #第三个开始开始数据  一直取9个数
                          lists= map(int, odom[3:12])
                          #取第10个数
                          results= map(int, odom[12:13])
                          list.append(lists)
                          result.append(results)
                      except:
                          error += 1
                  row=row+1
        except:
            print(ufilename, 'is not found!')

    # print('有{0}個训練數据'.format(len(list)))

    regr = linear_model.LinearRegression()
    # 訓練模型了
    regr.fit(list, result)

    b_0 = regr.intercept_
    th  = regr.coef_

    sol = {
      'local': local,
      'w0': b_0.tolist()[0],
      'w1': th.tolist()[0]
    }
    # print(sol)

    return sol

def main():
    mod = []
    for location in locations:
        mod.append(get_mod(location))
    # print mod

    with open('predictionReg.json', 'w') as outfile:
        json.dump(mod, outfile, ensure_ascii=False, encoding='utf-8')

if __name__ == '__main__':
    main()