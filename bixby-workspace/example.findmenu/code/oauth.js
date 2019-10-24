module.exports.function = function login ($vivContext) {
  const config = require('config');
  const http = require('http');
  const fail = require('fail');
  const baseAPIURL = config.get("baseAPIURL");
  const console = require('console');
 
 
  const url = baseAPIURL + $vivContext.accessToken
  console.log($vivContext.accessToken)
  const response = http.oauthGetUrl(url, {format:"json"});
  var result = http.getUrl('http://bixby-menu.herokuapp.com/' + response.id + '/search', {format:"json"});
  
  console.log(result)

  if (result.schoolcode) {
    return {schools : {
        name: result.schoolname,
        code: result.schoolcode,
        type: result.schooltype,
      }
    }
  }
  else {
    return 'http://bixby-menu.herokuapp.com/'+ response.id + '/school'
  }
}
