module.exports.function = function findSchool(schoolname, schoolKeyword) {
  var http = require('http')
  var console = require('console')
  var url = "https://www.schoolinfo.go.kr/ei/ss/Pneiss_f01_l0.do"
  var page = 0;
  var result = new Array();
  while (page == 0 || response_json.length >= 20){
    page += 1;
    if (schoolKeyword) {
      var form = {
        "SEARCH_SCHUL_NM": schoolname + schoolKeyword,
        "pageNumber": String(page),
        "callbackMode": "json",
        "schulCrseScCode": "",
        "hsKndScCode": "",
        "fondScCode": ""
      }
    }
    else {
      var form = {
        "SEARCH_SCHUL_NM": schoolname,
        "pageNumber": String(page),
        "callbackMode": "json",
        "schulCrseScCode": "",
        "hsKndScCode": "",
        "fondScCode": ""
      }
    }
    var headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
    var r = http.postUrl(url, data = form, headers = headers)
    var response_json = JSON.parse(r)

    for (var i = 0; i < response_json.length; i++) {
      if (response_json[i]["SCHUL_NM"].indexOf("부설방송통신") == -1) {
        result.push({
          "code": response_json[i]["SCHUL_CODE"],
          "name": response_json[i]["SCHUL_NM"],
          "type": {
            "02": "elementary",
            "03": "middle",
            "04": "high",
            "05": ""
          }[response_json[i]["SCHUL_CRSE_SC_CODE"]],
          "address": response_json[i]["ADDRESS"]
        })
      }
    }
  }
  console.log(result)
  return result
}