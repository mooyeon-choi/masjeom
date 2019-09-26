module.exports.function = function findMenu (schoolname, schoolkeyword ,month,date) {
  // const request = require('request');
  const console = require('console');
  console.log(schoolname);
  if (schoolkeyword){
    var response1 = http.getUrl('https://schoolcodekr.ml/api?q='+ schoolname+schoolkeyword,{format:'json'});
  }
  else{
    var response1 = http.getUrl('https://schoolcodekr.ml/api?q='+ schoolname,{format:'json'});
  }
  console.log(response1)
  var schoolcode = response1['school_infos'][0]['code']
  var schooltype = response1['school_infos'][0]['type']
  console.log(schoolcode);
  console.log(schooltype);
 

  var response2 = http.getUrl('https://schoolmenukr.ml/api/' + schooltype + '/'+ schoolcode + '?year=2019&month='+ month,{format:'json'});
  // request(url, (err, res, body) => {
  //   var json = JSON.parse(body);
  response2 = response2['menu'][date-1]['lunch']
    for (var i = 0;i< response2.length;i++){
      console.log(response2[i]);
    }
  
  return {
    result:response2
  }
}