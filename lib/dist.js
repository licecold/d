'use strict';

var express = require('express');
var app = express();

var router = require('./routes');
// const cookieParser = require('cookie-parser')

app.all('*', function (req, res, next) {
  var _req$headers = req.headers,
      origin = _req$headers.origin,
      Origin = _req$headers.Origin,
      referer = _req$headers.referer,
      Referer = _req$headers.Referer;

  var allowOrigin = origin || Origin || referer || Referer || '*';
  res.header('Access-Control-Allow-Origin', allowOrigin);
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', true); // 可以带cookies
  res.header('X-Powered-By', 'Express');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

router(app);

app.listen(3001, function () {
  console.log('app listening on 3001');
});
'use strict';

var api = {
  biDashboard: '/getBi'
};

module.exports.api = api;
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mysql = require('mysql');
var dbConfig = require('../../db/DBConfig');
var pool = mysql.createPool(dbConfig.mysql);

var DashboardService = require('../../service/bi/dashboard');

var BiController = function () {
  function BiController() {
    _classCallCheck(this, BiController);

    this.pool = pool;
    this.DashboardService = DashboardService;
    this.getOverallByDate = this.getOverallByDate.bind(this);
  }

  _createClass(BiController, [{
    key: 'connectPool',
    value: function connectPool() {
      var pool = this.pool;
      return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
          if (err) {
            reject(err);
          }
          resolve(connection);
        });
      });
    }
  }, {
    key: 'getOverallByDate',
    value: function getOverallByDate(req, res, next) {
      var _this = this;

      this.connectPool().then(function (connection) {
        var start = _this.getDateStr(-15);
        var end = _this.getFormateTime(new Date());
        var sqlString = '\n        SELECT\n          CASE\n            WHEN\n              a.decision_state = 1 THEN\n                "\u672A\u547D\u4E2D" \n                WHEN a.decision_state = 2 THEN\n                "\u547D\u4E2D" \n                WHEN a.decision_state = 3 THEN\n                "\u5F02\u5E38" \n              END AS state,\n              a.query_date,\n              count( DISTINCT ( a.id_card ) ) AS count \n            FROM\n              bi_app_order_analysis a \n            WHERE\n              a.query_date >= \'' + start + '\' \n              AND a.query_date <= \'' + end + '\' \n              AND a.decision_code = "DT02" \n            GROUP BY\n            a.query_date,\n            a.decision_state';
        connection.query(sqlString, function (error, rows) {
          if (error) {
            res.send();
          } else {
            var data = _this.DashboardService.getOverallByDate(rows);
            res.json({
              code: 200,
              data: data,
              message: 'success'
            });
            connection.release();
          }
        });
      }).catch(function (err) {});
    }
  }, {
    key: 'getDateStr',
    value: function getDateStr(days) {
      var d = new Date();
      d.setDate(d.getDate() + days);
      return this.getFormateTime(d);
    }
  }, {
    key: 'getFormateTime',
    value: function getFormateTime(d) {
      var y = d.getFullYear();
      var m = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
      var d = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
      return y + '-' + m + '-' + d;
    }
  }]);

  return BiController;
}();

module.exports = new BiController();
'use strict';

var AreaSQL = {
  // insert:'INSERT INTO User(uid,userName) VALUES(?,?)', 
  queryAll: 'SELECT * FROM displayname'
  // getUserById:'SELECT * FROM User WHERE uid = ? ',
};
module.exports = AreaSQL;
'use strict';

// mySQL 模块
var mysql = require('mysql');
var dbConfig = require('./DBConfig.js');
// sql池
var pool = mysql.createPool(dbConfig.mysql);

module.exports = pool;
'use strict';

var connection = {
  mysql: {
    host: '192.168.1.114',
    user: 'hzcfsh',
    password: 'mhfjykMzk3YGBgD8',
    database: 'hj_bi',
    port: 3306
  }
};

module.exports = connection;
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseComponent = function () {
  function BaseComponent() {
    _classCallCheck(this, BaseComponent);
  }

  _createClass(BaseComponent, [{
    key: "getParams",
    value: function getParams(req) {}
  }]);

  return BaseComponent;
}();
'use strict';

var express = require('express');
var router = express.Router();

var BiController = require('../controller/bi/dashboard');

router.get('/getOverallByDate', BiController.getOverallByDate);

module.exports = router;
'use strict';

var express = require('express');
var router = express.Router();

var dbConfig = require('./db/DBConfig');
var mysql = require('mysql');
var pool = mysql.createPool(dbConfig.mysql);

router.get('/getBi', function (req, res, next) {
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.query('SELECT\n      CASE\n        WHEN\n          a.decision_state = 1 THEN\n            "\u672A\u547D\u4E2D" \n            WHEN a.decision_state = 2 THEN\n            "\u547D\u4E2D" \n            WHEN a.decision_state = 3 THEN\n            "\u5F02\u5E38" \n          END AS state,\n          a.query_date,\n          count( DISTINCT ( a.id_card ) ) AS count \n        FROM\n          bi_app_order_analysis a \n        WHERE\n          a.query_date >= \'2019-02-20\' \n          AND a.query_date <= \'2019-03-04\' \n          AND a.decision_code = "DT02" \n        GROUP BY\n        a.query_date,\n        a.decision_state', function (error, rows) {
        if (error) {
          console.log('search fail');
        } else {
          var legend = ['未命中', '命中', '异常', '整体通过率'];
          var queryDateList = rows.map(function (v) {
            return v.query_date;
          });
          var a = rows.map(function (v) {
            return new Date(v.query_date).getFullYear() + '-' + (new Date(v.query_date).getMonth() + 1) + '-' + new Date(v.query_date).getDate();
          });
          var xAxis = _.uniq(a);
          var series = legend.map(function (v) {
            var i = {
              name: v,
              barMinHeight: 10,
              type: 'bar',
              stack: '数量',
              data: []
            };
            switch (v) {
              case '未命中':

                break;
              case '命中':

                break;
              case '异常':

                break;
              case '整体通过率':
                i.yAxisIndex = 1;
                i.stack = '通过率';
                i.type = 'line';
                break;
            }
            return i;
          });
          queryDateList.forEach(function (date, idx) {
            var matchList = rows.filter(function (v) {
              return v.query_date === date;
            });
            matchList.forEach(function (v) {
              series[legend.indexOf(v.state)].data.push(v.count);
            });
            legend.filter(function (v) {
              return !matchList.map(function (v) {
                return v.state;
              }).includes(v);
            }).forEach(function (v) {
              var leg = legend.indexOf(v);
              if (v !== '整体通过率') {
                series[leg].data.push(0);
              } else {
                var total = series.slice(0, series.length - 1).map(function (v) {
                  return v.data[idx];
                }).reduce(function (pre, cur) {
                  return pre + cur;
                });
                var hit = series[legend.indexOf('命中')].data[idx];
                series[leg].data.push((total + hit) * 100 / total);
              }
            });
          });

          res.json({
            data: {
              legend: legend,
              series: series,
              xAxis: xAxis
            }
          });
          connection.release();
        }
      });
    }
  });
});

module.exports = router;
'use strict';

var bi = require('./bi');

module.exports = function (app) {
  app.use('/bi', bi);
};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');

var DashboardService = function () {
  function DashboardService() {
    _classCallCheck(this, DashboardService);
  }

  _createClass(DashboardService, [{
    key: 'getOverallByDate',
    value: function getOverallByDate(rows) {
      if (!rows.length) return {};
      var legend = ['未命中', '命中', '异常', '整体通过率'];
      var queryDateList = _.uniq(rows.map(function (v) {
        return new Date(v.query_date).toString();
      }));
      var a = rows.map(function (v) {
        return new Date(v.query_date).getFullYear() + '-' + (new Date(v.query_date).getMonth() + 1) + '-' + new Date(v.query_date).getDate();
      });
      var xAxis = _.uniq(a);
      var series = legend.map(function (v) {
        var i = {
          name: v,
          barMinHeight: 10,
          type: 'bar',
          stack: '数量',
          data: []
        };
        switch (v) {
          case '未命中':

            break;
          case '命中':

            break;
          case '异常':

            break;
          case '整体通过率':
            i.yAxisIndex = 1;
            i.stack = '通过率';
            i.type = 'line';
            break;
        }
        return i;
      });
      queryDateList.forEach(function (date, idx) {
        var matchList = rows.filter(function (v) {
          return new Date(v.query_date).toString() === date;
        });

        matchList.forEach(function (v) {
          series[legend.indexOf(v.state)].data.push(v.count);
        });
        legend.filter(function (v) {
          return !matchList.map(function (v) {
            return v.state;
          }).includes(v);
        }).forEach(function (v) {
          var leg = legend.indexOf(v);
          if (v !== '整体通过率') {
            series[leg].data.push(0);
          } else {
            var total = series.slice(0, series.length - 1).map(function (v) {
              return v.data[idx];
            }).reduce(function (pre, cur) {
              return pre + cur;
            });
            var hit = series[legend.indexOf('命中')].data[idx];
            series[leg].data.push((total + hit) * 100 / total);
          }
        });
      });
      return {
        legend: legend,
        series: series,
        xAxis: xAxis
      };
    }
  }]);

  return DashboardService;
}();

module.exports = new DashboardService();
