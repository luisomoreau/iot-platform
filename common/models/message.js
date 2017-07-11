'use strict';
var request = require('request');
var app = require('../../server/server.js');
var Twitter = require('twitter');

module.exports = function (Message) {

  Message.afterRemote('upsert', function (context, message, next) {
    var Device = app.models.Device;
    console.log('> Message.beforeRemote triggered');
    console.log(message);

    var device = {
      id: message.deviceId,
      creation: message.time
    };
    console.log(device);

    Device.findOrCreate(
      {where: {id: message.deviceId}}, // find
      device, // create
      function (err, createdItem, created) {
        if (err) {
          console.error('error creating device', err);
        }
        (created) ? console.log('created device', createdItem.id)
          : console.log('found device', createdItem.id);
      });

    message.save(function (err, instance) {
      if (err) {
        console.log(err);
      } else {
        //console.log(instance);
        parsePayload(message);
      }
    });

    next();
  });
};


//Private functions

function getBinaryFrame(frameHex) {
//  console.log('getFrameBinary', frameHex);
  var bytes = frameHex.match(/.{1,2}/g);
  // if (bytes.length !== 12) {
  //   console.log('Invalid frame, got %s bytes', bytes.length);
  //   return null;
  // }
  var binaryString = '';
  bytes.forEach(function (byte) {
    binaryString += getBinaryFromHex(byte);

  });
  if (!binaryString.match(/^([0-9]*)$/)) {
    console.log('Unable to parse frame %s : %s', frameHex, binaryString);
    return null;
  }

  return binaryString;

}
function getBinaryFromHex(byte) {
  var num = Number(parseInt(byte, 16));
  if (isNaN(num)) {
    console.log('Invalid byte %s', byte);
    return null;
  }
  var binary = num.toString(2);

  //Fill the byte with zeros
  while (binary.length < 8) {
    binary = '0' + binary;
  }

  return binary;
}

function getDecimalCoord(sigfoxFrame) {
  var degrees = Math.floor(sigfoxFrame);
  var minutes = sigfoxFrame % 1 / 60 * 100;
  minutes = Math.round(minutes * 10000) / 10000;
  return degrees + minutes;

}

function twit(message){
  console.log("ready to twit");
  //Use the environment variables in production
  var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  });

  var status = "";

  var type = message.parsedData.filter(function( obj ) {
    return obj.key == "type";
  });

  var mode = message.parsedData.filter(function( obj ) {
    return obj.key == "mode";
  });


  var temp = message.parsedData.filter(function( obj ) {
    return obj.key == "temp";
  });

  if(type[0].value == "new mode"){
    status = "Oh I just changed my sensor mode. I'm now in " + mode[0].value + " mode !";
  }

  if(type[0].value == "button call"){
    status = "Someone just pushed my button. I'm still in " + mode[0].value + " mode and it's " + Number((temp[0].value).toFixed(2)) + "°C ";
  }

  if(type[0].value == "alert" && mode[0].value == "move"){
    status = "I've been waken up, someone just touched me!";
  }

  if(type[0].value == "alert" && mode[0].value == "door"){
    status = "Who just opened the door?";
  }

  if(type[0].value == "regular"){
    status = "It's " + Number((temp[0].value).toFixed(2)) + "°C ";
  }

  if(status != ""){
    status = status + "#SpeakingBird " + new Date().getHours() + "h" + new Date().getMinutes();
    client.post('statuses/update', {status: status},  function(error, tweet, response){
      if(error) console.log(error);
      console.log("tweet:",tweet);  // Tweet body.
      //console.log(response);  // Raw response object.
    });
  }



}

function parsePayload(message){

  var Device = app.models.Device;

  Device.findOne({where: {id: message.deviceId}},
    function (err, device) {
      if(device){
        //console.log(device.parser.name);
        if(device.parser){
          message.parser = device.parser.name;

        switch (device.parser.name){
          case "Sensit":
            message = decodeSensit(message, device.tweet);
            break;
          case "Tuto GPS":
            message = decodeTutoGPS(message);
            break;
          case "Geoloc Wifi":
            message = decodeGeolocWifi(message);
            break;
          case "Talking Plant":
            message = decodeTalkingPlant(message);
            break;
          case "Fire Forest Alarm":
            message = decodeFireAlarm(message);
            break;
        }
      }else{
        return message;
      }
      saveMessage(message);
  }});
}

function decodeSensit(message, tweet){

  //Datasheet: https://api.sensit.io/resources/pdf/V2_uplink.pdf

  message.parsedData = [];
  var obj = {};

  var framePattern = /(.{1})(.{2})(.{2})(.{3})(.{4})(.{4})/;
  var binaryFrame = getBinaryFrame(message.data);
  var frame = framePattern.exec(binaryFrame);

  console.log(frame);

  var type = parseInt(frame[2],2);
  obj.key = "type";
  switch (type){
    case 0:
      obj.value = "regular";
      break;
    case 1:
      obj.value = "button call";
      break;
    case 2:
      obj.value = "alert";
      break;
    case 3:
      obj.value = "new mode";
      break;
  }
  message.parsedData.push(obj);
  obj = {};


  var timeframe = parseInt(frame[3],2);
  obj.key = "timeframe";
  switch (timeframe){
    case 0:
      obj.value = "10 min";
      break;
    case 1:
      obj.value = "1 hour";
      break;
    case 2:
      obj.value = "6 hours";
      break;
    case 3:
      obj.value = "24 hours";
      break;
  }
  message.parsedData.push(obj);
  obj = {};


  var mode = parseInt(frame[4], 2);
  obj.key = "mode";
  switch (mode){
    case 0:
      obj.value = "button";
      break;
    case 1:
      obj.value = "temperature and humidity";
      break;
    case 2:
      obj.value = "light";
      break;
    case 3:
      obj.value = "door";
      break;
    case 4:
      obj.value = "move";
      break;
    case 5:
      obj.value = "magnet";
      break;
  }
  message.parsedData.push(obj);
  obj = {};

  var temp = parseInt(frame[5],2);
  obj.key = "temp";
  obj.value = (temp * 6.4) - 20;
  message.parsedData.push(obj);
  console.log(obj.value);
  obj = {};

  if(tweet){
    twit(message);
  }

  return message;


}

function decodeTutoGPS(message) {

  //console.log(message.data.length);

  message.parsedData = [];
  var obj = {};

  if (message.data.length == 24) {
    obj.key = "message_type";
    obj.value = 'Normal';
    message.parsedData.push(obj);
    obj = {};

    var framePattern = /(.{1})(.{31})(.{1})(.{31})(.{2})(.{2})(.{4})(.{4})(.{4})(.{8})(.{8})/;
    var binaryFrame = getBinaryFrame(message.data);
    var frame = framePattern.exec(binaryFrame);


    var lat = (frame[1] === "1" ? -1 : 1) * getDecimalCoord(parseInt(frame[2], 2) / Math.pow(10, 6));
    //console.log('lat:', lat);

    obj.key = "lat";
    obj.value = lat;
    message.parsedData.push(obj);
    obj = {};

    var lng = (frame[3] === "1" ? -1 : 1) * getDecimalCoord(parseInt(frame[4], 2) / Math.pow(10, 6));
    //console.log('long:', lng);

    obj.key = "long";
    obj.value = lng;
    message.parsedData.push(obj);
    obj = {};

    message.geoloc = {
      gps:{
        lat: lat,
        long: lng
      }
    };

    var hdop = parseInt(frame[5], 2);
    //console.log('hdop:', frame[5]);
    //console.log('hdop:', hdop);
    obj.key = "hdop";
    switch (hdop) {
      case 3:
        obj.value = 600;
        break;
      case 2:
        obj.value = 200;
        break;
      case 1:
        obj.value =  100;
        break;
      case 0:
        obj.value =  0;
        break;
    }
    message.parsedData.push(obj);
    obj = {};


    var sat = parseInt(frame[6], 2);
    //console.log('nbSat:', frame[6]);
    //console.log('nbSat:', sat);
    obj.key = "sat";
    obj.value = sat * 2 + 2;
    message.parsedData.push(obj);
    obj = {};

    var gps_acq = parseInt(frame[8], 2);
    //console.log('gps_acq:', frame[8]);
    //console.log('gps_acq:', gps_acq);
    obj.key = "gps_acq";
    obj.value = gps_acq * 5;
    message.parsedData.push(obj);
    obj = {};

    var speed = parseInt(frame[9], 2);
    //console.log('speed:', frame[9]);
    //console.log('speed:', speed);
    obj.key = "speed";
    obj.value = speed * 5;
    message.parsedData.push(obj);
    obj = {};

    var battery = parseInt(frame[10], 2);
    //console.log('battery', frame[10]);
    //console.log('battery', battery);
    obj.key = "battery";
    obj.value = battery * 15 / 1000;
    message.parsedData.push(obj);
    obj = {};


    var alert = parseInt(frame[11], 2);
    //console.log('alert', frame[11]);
    //console.log('alert', alert);
    obj.key = "alert";
    obj.value = alert;
    message.parsedData.push(obj);
    obj = {};

    return message;

  }

  if (message.data.length == 2 || message.data.length == 4) {
    obj.key = "message_type";
    obj.value = "Timeout";
    message.parsedData.push(obj);
    obj = {};
    if(message.data.length == 4){
      var battery = parseInt(message.data.substring(0,2), 16);
    }else{
      var battery = parseInt(message.data, 16);
    }
    //console.log('battery', message.data);
    //console.log('battery', battery);
    obj.key = "battery";
    obj.value = battery * 15 / 1000;
    message.parsedData.push(obj);

    //console.log(message.parsedData);

    return message;
  }
}

function decodeGeolocWifi(message){

  message.parsedData = [];
  var obj = {};

  console.log(message.data.length);

  if(message.data.length == 24){

    var decode = message.data.match(/.{1,12}/g).map(function(net){return net.match(/.{1,2}/g).join(':');});

    obj.key = "mac_address_1";
    obj.value = decode[0];
    message.parsedData.push(obj);
    obj = {};

    obj.key = "mac_address_2";
    obj.value = decode[1];
    message.parsedData.push(obj);
    obj = {};

    var googleApiKey = "";

    if(!process.env.GOOGLE_KEY){
      var Setting = app.models.Setting;

      Setting.findOne(
        {where: {key: "googleApiKey"}}, // find
        function (err, item) {
          if (err) {
            console.log('No Google API key found in settings', err);
          }else{
            console.log(item);
            if(item){
              googleApiKey = item.value;
              console.log("Found Google API key in setting", item.value);
              askGoogle();
            };
          }
        });
    }else{
      googleApiKey = process.env.GOOGLE_KEY;
      askGoogle();
    }
  }

  function askGoogle(){
    const geolocation = require ('google-geolocation') ({
      key: googleApiKey
    });

    // Configure API parameters
    const params = {
      wifiAccessPoints: [
        {macAddress: decode[0]},
        {macAddress: decode[1]}
      ]
    };

    // Get data
    geolocation (params, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(data);

      message.geoloc = {
        wifi:{
          lat: data.location.lat,
          long: data.location.lng,
          precision: data.accuracy
        }
      };

      obj.key = "lat";
      obj.value = data.location.lat;
      message.parsedData.push(obj);
      obj = {};


      obj.key = "long";
      obj.value = data.location.lng;
      message.parsedData.push(obj);
      obj = {};


      obj.key = "precision";
      obj.value = data.accuracy;
      message.parsedData.push(obj);
      obj = {};
      saveMessage(message);

    });
  }

  return message;

}

function decodeTalkingPlant(message){

  //console.log(message.data.length);

  message.parsedData = [];
  var obj = {};

  if (message.data.length == 8) {

    var framePattern = /(.{8})(.{8})(.{8})(.{8})/;
    var binaryFrame = getBinaryFrame(message.data);
    var frame = framePattern.exec(binaryFrame);

    var hum = parseInt(frame[1], 2);
    obj.key = "humidity";
    obj.value = hum;
    message.parsedData.push(obj);
    obj = {};

    var temp = parseInt(frame[2], 2);
    obj.key = "temperature";
    obj.value = temp;
    message.parsedData.push(obj);
    obj = {};

    var brightness = parseInt(frame[2], 2);
    obj.key = "brightness";
    obj.value = brightness;
    message.parsedData.push(obj);
    obj = {};

    var alert = parseInt(frame[2], 2);
    obj.key = "alert";
    obj.value = alert;
    message.parsedData.push(obj);
    obj = {};

    return message;

  }
  return message;
}

function decodeFireAlarm(message){
  return message;
}

function saveMessage(message){
  message.save(function (err, instance) {
    if (err) {
      console.log(err);
    } else {
      //console.log(instance);
    }
  });
}

