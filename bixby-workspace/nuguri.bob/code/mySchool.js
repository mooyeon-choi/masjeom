module.exports.function = function login($vivContext, registerchk) {
  const config = require('config');
  const http = require('http');
  const baseAPIURL = config.get("baseAPIURL");
  const console = require('console');


  const url = baseAPIURL + $vivContext.accessToken
  const response = http.oauthGetUrl(url, { format: "json" });
  const result = http.getUrl('http://bixby-menu.herokuapp.com/'+ response.id + '/search/', { format: "json", cacheTime: 0});
  if (registerchk) {
    return 
  }
  if (result.response) {
    return {
      schools: {
        name: result.schoolname,
        code: result.schoolcode,
        type: result.schooltype,
        myallergy: result.allergies,
      }
    }
  }
  else {
    return {
      schools: {
        info: true
      }
    }
  }
}