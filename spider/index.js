"use strict";
const request = require('request');
const cheerio = require('cheerio');
var path = require('path');
const AV = require('leancloud-storage');

AV.init({
  appId: 'SiuLQajWrKuR3zDPRzfAOV1L-gzGzoHsz',
  appKey: '8pYRy3bB7zDxolBkT5WyGOQJ'
});

Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

const log = function () {
  console.log.apply(console, arguments);
}

const Data = function () {
  this.name = '';
  this.value = 0;
}

const dataFromJSON = function (data, json) {
  var airObjects = JSON.parse(json);
  for (var i = 0; i < airObjects.length; i++) {
    var airObject = airObjects[i];
    var object = new Data();

    object.name = airObject.CITY.split('市')[0];
    object.value = parseInt(airObject.AQI);
    data.push(object);
  }
}

const jsonFromBody = function (body) {
  const e = cheerio.load(body, {
    decodeEntities: false
  });
  const json = e('#gisDataJson').attr('value');

  return json;
}

const writeToFile = function (path, data) {
  const fs = require('fs');
  fs.writeFile(path, data, function (error) {
    log(path);
  })
}

const cachedUrl = function (pageNum) {
  const fs = require('fs');
  if (pageNum == 1) {
    var formData = {
      'xmlname': '1462259560614'
    };
    var postData = {
      url: 'http://datacenter.mep.gov.cn:8099/ths-report/report!list.action',
      formData
    };
    const path = __dirname + `/list.action!${pageNum}`;
    request.post(postData, function (error, response, body) {
      if (error === null) {
        writeToFile(path, body);
      }
    });
  } else {
    var path = __dirname + `/list.action!${pageNum - 1}`;
    fs.readFile(path, function (err, data) {
      var json = jsonFromBody(data);
      var formData = {
        'page.pageNo': `${pageNum}`,
        'page.orderBy': '',
        'page.order': '',
        'orderby': '',
        'ordertype': '',
        'xmlname': '1462259560614',
        'queryflag': 'open',
        'gisDataJson': json,
        'V_DATE': JSON.parse(json)[0].OPER_DATE,
        'E_DATE': JSON.parse(json)[0].OPER_DATE,
        'isdesignpatterns': 'false',
        'CITY': ''
      };
      var postData = {
        url: 'http://datacenter.mep.gov.cn:8099/ths-report/report!list.action',
        formData
      };
      path = __dirname + `/list.action!${pageNum}`;
      request.post(postData, function (error, response, body) {
        if (error === null) {
          writeToFile(path, body);
        }
      })
    });
  }
}


const store = function () {
  const fs = require('fs');
  const data = [];
  const date = new Date().Format('yyyy-MM-dd');
  var FogData = AV.Object.extend('FogData');

  var fogData = new FogData();
  fogData.set('time', date);

  for (var i = 1; i < 14; i++) {
    var path = __dirname + `/list.action!${i}`;
    fs.readFile(path, function (err, file) {
      var json = jsonFromBody(file);
      dataFromJSON(data, json);

      fogData.set('data', data);
      fogData.save().then(function (data) {
        log('success');
      }, function (error) {
        log('error', error);
      });
    });
  }
}

//cachedUrl(13);
//1-13
store();