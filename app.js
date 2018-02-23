var admin = require('firebase-admin');
var serviceAccount = require('./firebaseAdmin.json');
var fs = require('fs');
var request = require('request');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'microland-one-staging',
    clientEmail: 'firebase-adminsdk-8lg41@microland-one-staging.iam.gserviceaccount.com',
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCryznhA5XO9Olz\n8ZalB4sHWDjP/7Fjt7fwCYXetmG7xlT4047gwFYlAwbH4BoRbGCHvR9NsRp3rpzV\nUPoA4Skh+tjvxS+7cdfpuxJhnQxtTN0K5Y4mOvn7i3M7dnRqhlgMCyh1hhMLb5fO\nC+THrzd1v0+gadYm8rH5i7r694jisHVgqPe4T029n+gpZNLpWBeOs5pI4W+ePVlU\neMGn6dGYcXCV+E5cqZ09C3442uKpl8RAUhYfSqmV8WIj9lt7WTLt9lgt2E7fpeK7\n7MuIdLt2kh+fiLbG2VUyUsiaTZOedu1IZ2Pr2R9rQs4IgKyoH+QX7M7UgXEuag+4\n+CQiNDgPAgMBAAECggEADOLtsIdIUYHlkSDqH+706tQfTtrrP4OkdIkCVbZwlllG\nPnQAH7PNwnD7rTqOOghbJVN2aamDRr7+XLH6Tt6U60uZwkKUVgcwHwQ9WL0jFX/S\nhOK7SvrZjZjkR+2WxfbV2/FqU4Z/Hzh7tqUFwETQcDCtlGbb/Yfu+b0VhYXT6s0a\nRZs+1NNAkqi48raXR6sLqgeeKfB/6Cfur2flwZ+pb616l4sVcZmZn8rearVnjwdI\n5vF3XrqJoazvSqdM8kKFn3nE76sWJoQssKiXFg0Aczhy007OoCQbBSYOfnBBeyFO\nHS23fVz9miC3EOnW8cW+PuVYenVXkFLF7o7byxu/QQKBgQDZRLQc/NAMTvyw/NOM\nJUujj/LdEx5/7qn510ObbzLKa5KBvoluetXbXR9HGOE7wqMo7btKHj2x+SHK/Btz\nSJVCkQPvyFZGylhbiaZsz/l8TzQpnvhDamaeD7X0qgSBkF9fDuIIrcXp3BKw6qDd\nBDTyn/KyzMDw3lQLFBhcj8jNWQKBgQDKaz1R4EHxWH2Ipgex7CEcCWneP58DO1pb\n+4LI0v2ww/HFIOAjVeZWHIMeC/zd3uRc7NDKvoD4pJe3QVdIWfQP66nl7RwUFMPi\nLgrPRemD4Yo44Qap/YeWyJI5JXeGhsK2gWSeXODayWQgXVvBtFZsv6c9KPwth/8y\nMToPH+D7pwKBgQC2G3roLRLori/o3REnj38VqisDF+phipaX3dFB7/NfbMjQzPZ+\nTqD/i88SlYz7vQlq3dA0sKI/kTS84ZDUkQriT5BAI+gEz8c9emOvIqbXhb+P/znR\nr9YxN7PoTbUXL/5wO5ZDdfvEJ3zXIuIQPl1u25feO/agLYm9+2rr8mx5iQKBgQCB\n26KPMEudxaNjUwCEyHPFRNTCXBZrQFyLviL9Kz7NdCday+h/QtBuVgRX9mDXBfOD\nGfoo12ZuHUmnqyePpwXIYOuyMhddWqUAKYGNz9ArZzoBm3tm+ttNhIcqWjr/9txb\nsU8XuYYXVjQB/2KqNkNrqNhliDGgFCtHzATvRwhS6QKBgHG5rVJ3EgvY8xHUqUdq\nX18uKtxR+FViFZeIM8TtO1FF9hQM2DnuvtQ9WMrwX4WQIzyM8Maaga7AhUg4/XLB\nevG1SSQCn61ckbJ1Xb97V+ve40bvU1eKsKiR+aMtbb5Kx/9pRBppbkqlHy+W5yg2\n2aTDCPm84MfoaGzbYO8a3mz1\n-----END PRIVATE KEY-----\n",
  }),
  databaseURL: 'https://microland-one-staging.firebaseio.com'
});

var db = admin.database();
var ref = db.ref("users");
var jsonObj = {};
var jsonArray = [];
// var url = "http://http://smartthinkdemo.southeastasia.cloudapp.azure.com:12206/gelf"
// var url = "http://localhost:12201/gelf";

var url = "http://smartthinkdemo.southeastasia.cloudapp.azure.com:12203/gelf";
ref.on("value", function(snapshot) {
  jsonObj = snapshot.val();

  for (var key in jsonObj) {
    var val = {};
    val[key] = jsonObj[key]
    jsonArray.push(val)
  }

  for(var i=0; i<3; i++){
    jsonArray[i].host = "firebase";
    jsonArray[i].message = "microland-one-staging";
    console.log(jsonArray[i])
    request({
            url: url,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: jsonArray[i]
        }, function (error, response, body) {
            console.log(response.statusCode, ":response")

            if(error){
                console.log(Error(error))
            }
            if (!error && response.statusCode === 202) {
                console.log('success');
            }
      });
  }
});
