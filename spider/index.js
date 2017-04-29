const request = require('request');
const cheerio = require('cheerio');
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

const Data = function () {
  this.name = '';
  this.value = 0;
}

var ALL = [];

const dataFromBody = function (data, body) {
  const e = cheerio.load(body, {
    decodeEntities: false
  });
  const json = e('#gisDataJson').attr('value');

  var airObjects = JSON.parse(json);
  for (var i = 0; i < airObjects.length; i++) {
    var airObject = airObjects[i];
    var object = new Data();

    object.name = airObject.CITY.split('市')[0];
    object.value = parseInt(airObject.AQI);
    data.push(object);
  }
}

const postRequest = function (pageNum, cb) {
  var postData = {};

  if (pageNum == 1) {
    postData = {
      url: 'http://datacenter.mep.gov.cn:8099/ths-report/report!list.action',
      formData: {
        'xmlname': '1462259560614'
      }
    };
  } else {
    var today = new Date();
    var yesterday = today.setDate(today.getDate() - 1);
    const date = new Date(yesterday).Format('yyyy-MM-dd');
    var postData = {
      url: 'http://datacenter.mep.gov.cn:8099/ths-report/report!list.action',
      formData: {
        'page.pageNo': `${pageNum}`,
        'page.orderBy': '',
        'page.order': '',
        'orderby': '',
        'ordertype': '',
        'xmlname': '1462259560614',
        'queryflag': 'open',
        'gisDataJson': '',
        'V_DATE': date,
        'E_DATE': date,
        'isdesignpatterns': 'false',
        'CITY': ''
      }
    };
  }
  request.post(postData, function (error, response, body) {
    if (error === null) {
      dataFromBody(ALL, body);
      cb && cb();
    }
  });
}


const saveData = function (data) {
  const date = new Date().Format('yyyy-MM-dd');
  var FogData = AV.Object.extend('FogData');

  var fogData = new FogData();
  fogData.set('time', date);
  fogData.set('data', data);
  
  fogData.save().then(function (data) {
    console.log('success');
  }, function (error) {
    console.log('error', error);
  });
}

postRequest(1, () => {
  postRequest(2, () => {
    postRequest(3, () => {
      postRequest(4, () => {
        postRequest(5, () => {
          postRequest(6, () => {
            postRequest(7, () => {
              postRequest(8, () => {
                postRequest(9, () => {
                  postRequest(10, () => {
                    postRequest(11, () => {
                      postRequest(12, () => {
                        postRequest(13, () => {
                          saveData(ALL);
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})