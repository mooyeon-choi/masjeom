module.exports.function = function findMenu(dateTimeExpression, schools, meal, date, schoolname) {
  var dates = require('dates')
  const console = require('console');
  const http = require('http');
  var month = dates.ZonedDateTime.now().getMonth()
  var day = dates.ZonedDateTime.now().getDay()
  var MEAL = 'lunch'
  var my_allergy = ['2', '9']
  if (meal == '아침') {
    MEAL = 'breakfast'
  }
  else if (meal == '저녁') {
    MEAL = 'dinner'
  }

  if (date) {
    day = date
  }
  if (schools) {
    var schoolcode = schools.code[0]
    var schooltype = schools.type[0]
    if (dateTimeExpression) {
      // dateTimeExpression이 기간으로 들어올때
      if (dateTimeExpression.dateInterval) {
        var result = new Array();
        var startmonth = dateTimeExpression.dateInterval.start.month
        var endmonth = dateTimeExpression.dateInterval.end.month
        var day = dateTimeExpression.dateInterval.end.day
        if (startmonth == endmonth) {
          try {
            var response = http.getUrl('https://schoolmenukr.ml/api/' + schooltype + '/' + schoolcode + '?hideAllergy=true&month=' + startmonth, { format: 'json' });
            result = response['menu'].slice(day - 7, day - 2);
          }
          catch (error) {
            result = []
          }
        }
        else {
          try {
            var response = http.getUrl('https://schoolmenukr.ml/api/' + schooltype + '/' + schoolcode + '?hideAllergy=true&month=' + startmonth, { format: 'json' });
            result = response['menu'].slice(day - 7);
            var response = http.getUrl('https://schoolmenukr.ml/api/' + schooltype + '/' + schoolcode + '?hideAllergy=true&month=' + endmonth, { format: 'json' });
            result = result.concat(response['menu'].slice(0, day - 2));
          }
          catch (error) {
            result = []
          }
        }
        console.log(MEAL)
        if (result) {
          for (var i = 0; i < result.length; i++) {
            result[i] = {
              date: result[i]['date'],
              menuName: result[i][MEAL]
            }
          }
        }
        return {
          schoolname: schools.name[0],
          meal: meal,
          result: result
        }
      }
      // dateTimeExpression 특정 날짜 하루 일때
      else if (dateTimeExpression.date) {
        month = dateTimeExpression.date.month
        day = dateTimeExpression.date.day
      }
    }
    var allergyList = new Array();
    var myAllergy = new Array();
    var menus = {};
    var menu = ['menu1', 'menu2', 'menu3', 'menu4', 'menu5', 'menu6', 'menu7', 'menu8', 'menu9']
    try {
      var response = http.getUrl('https://schoolmenukr.ml/api/' + schooltype + '/' + schoolcode + '?hideAllergy=true&month=' + month, { format: 'json' });
      var allergy = http.getUrl('https://schoolmenukr.ml/api/' + schooltype + '/' + schoolcode + '?month=' + startmonth, { format: 'json' });
    }
    catch (error) {
      return {
        date: day,
        schoolname: schools.name[0],
        menus: []
      }
    }
    allergy = allergy['menu'][day - 1][MEAL];
    for (var i = 0; i < allergy.length; i++) {
      for (var j = allergy.length; j >= 0; --j) {
        if (allergy[i][j] == /[^0-9\.]/) {
          var idk = j;
          break
        }
      }
      allergyList[i] = allergy[i].slice(idk).replace(/[^0-9\.]/g, "").split('.').slice(0, -1);
      for (var k = 0; k < my_allergy.length; k++) {
        if (allergyList[i].length > 0 && allergyList[i].indexOf(my_allergy[k]) != -1) {
          myAllergy[i] = true
        }
      }
      if (!myAllergy[i]) {
        myAllergy[i] = false
      }
    }
    let db = require('data/allergy.js')
    let allergyName = db.allergy
    for (var i = 0; i < allergyList.length; i++) {
      for (var j = 0; j < allergyList[i].length; j++) {
        allergyList[i][j] = allergyName[allergyList[i][j]]
      }
    }
    for (var i = 0; i < menu.length; i++) {
      menus[menu[i]] = {
        menuName: response['menu'][day - 1][MEAL][i],
        allergy: allergyList[i],
        myAllergy: myAllergy[i]
      }
    }
    console.log(date)
    return {
      date: day,
      schoolname: schools.name[0],
      menus: menus
    }
  }
  else {
    return
  }
}



