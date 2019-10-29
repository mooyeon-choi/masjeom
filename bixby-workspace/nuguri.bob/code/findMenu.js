module.exports.function = function findMenu(dateTimeExpression, schools, meal, date, month, myallergy) {
  const dates = require('dates')
  const console = require('console');
  const http = require('http');
  console.log(schools)
  // 발화에 학교 이름이 있으면 FindSchool 모델에서 학교 정보을 가지고 와서 급식 정보 api 요청
  if (schools) {
    // 저장된 내 정보가 없으면 등록하는 서버로 보냄
    if (schools.info[0]) {
      return {
        info: schools.info
      }
    }
    // 내 정보에 알레르기 정보가 있으면 저장,
    if (schools.myallergy) {
      var myallergy = schools.myallergy
    }
    // 내 정보에 알레르기 정보가 없거나 발화에 학교 이름이 있으면 빈 리스트 저장
    else {
      var myallergy = []
    }
    // api를 불러오는 데 필요한 변수 저장
    var schoolcode = schools.code[0]
    var schooltype = schools.type[0]
    // 현재 월, 날짜를 초기값으로 지정
    if (!month) {
      var month = dates.ZonedDateTime.now().getMonth()
    }
    if (date) {
      var day = date
    }
    else {
      var day = dates.ZonedDateTime.now().getDay()
    }
    // meal 발화 값을 이용하여 api key값 설정
    if (meal && meal.indexOf('아침') != -1) {
      meal = '아침'
      var key_meal = 'breakfast'
    }
    else if (meal && meal.indexOf('저녁') != -1) {
      meal = '저녁'
      var key_meal = 'dinner'
    }
    else {
      meal = '점심'
      var key_meal = 'lunch'
    }
    if (dateTimeExpression) {
      // dateTimeExpression이 기간으로 들어올때
      if (dateTimeExpression.dateInterval) {
        var result = new Array();
        var startmonth = dateTimeExpression.dateInterval.start.month
        var endmonth = dateTimeExpression.dateInterval.end.month
        var day = dateTimeExpression.dateInterval.end.day
        if (startmonth == endmonth) {
          try {
            var response = http.getUrl('https://schoolmenukr.ml/api/' + schooltype + '/' + schoolcode + '?hideAllergy=true&month=' + startmonth, { format: "json", cacheTime: 0});
            result = response['menu'].slice(day - 7, day - 2);
          }
          catch (error) {
            result = []
          }
        }
        else {
          try {
            var response = http.getUrl('https://schoolmenukr.ml/api/' + schooltype + '/' + schoolcode + '?hideAllergy=true&month=' + startmonth, { format: "json", cacheTime: 0});
            result = response['menu'].slice(day - 7);
            var response = http.getUrl('https://schoolmenukr.ml/api/' + schooltype + '/' + schoolcode + '?hideAllergy=true&month=' + endmonth, { format: "json", cacheTime: 0});
            result = result.concat(response['menu'].slice(0, day - 2));
          }
          catch (error) {
            result = []
          }
        }
        if (result) {
          for (var i = 0; i < result.length; i++) {
            if (result[i]['date'] == '1') {
              startmonth = endmonth
            }
            result[i] = {
              month: startmonth,
              date: result[i]['date'],
              menuName: result[i][key_meal]
            }
          }
        }
        return {
          weekly: {
            schools: schools,
            meal: meal,
            result: result,
            myallergy: myallergy
          }
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
    var menus = [];
    var allergies = {}
    var arllerchk = false
    
    try {
      var response = http.getUrl('https://schoolmenukr.ml/api/' + schooltype + '/' + schoolcode + '?hideAllergy=true&month=' + month, { format: "json", cacheTime: 0});
      var allergy = http.getUrl('https://schoolmenukr.ml/api/' + schooltype + '/' + schoolcode + '?month=' + month, { format: "json", cacheTime: 0});
    }
    catch (error) {
      return {
        daily: {
          date: day,
          schools: schools,
          menus: [],
          meal: meal
        }
      }
    }
    allergy = allergy['menu'][day - 1][key_meal];
    for (var i = 0; i < allergy.length; i++) {
      for (var j = allergy.length; j >= 0; --j) {
        if (allergy[i][j] == /[^0-9\.]/) {
          var idk = j;
          break
        }
      }
      allergyList[i] = allergy[i].slice(idk).replace(/[^0-9\.]/g, "").split('.').slice(0, -1);
      for (var k = 0; k < myallergy.length; k++) {
        if (allergyList[i].length > 0 && allergyList[i].indexOf(String(myallergy[k])) != -1) {
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
        key = allergyList[i][j]
        allergyList[i][j] = {
          'allergyname': allergyName[allergyList[i][j]],
          'allergychk': false
        }
        for (var k = 0; k < myallergy.length; k++) {
          if (key == myallergy[k]) {
            allergyList[i][j]['allergychk'] = true
          }
        }
      }
    }
    for (var i = 0; i < response['menu'][day - 1][key_meal].length; i++) {
      menus.push({
        menuName: response['menu'][day - 1][key_meal][i],
        allergy: allergyList[i],
        myAllergy: myAllergy[i]
      })
    }
    return {
      daily: {
        date: day,
        schools: schools,
        menus: menus,
        meal: meal
      }
    }
  }
}



