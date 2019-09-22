module.exports.function = function findMenu (month,date) {
  // const request = require('request');
  const console = require('console');
  var response = http.getUrl('https://schoolmenukr.ml/api/high/N100000260?year=2019&month='+month,{format:'json'})
  // request(url, (err, res, body) => {
  //   var json = JSON.parse(body);
  response = response['menu'][date-1]['lunch']
    for (var i = 0;i< response.length;i++){
      console.log(response[i]);
    }
  
  return {
    result:response
  }
}