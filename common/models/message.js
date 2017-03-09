'use strict';
var request = require('request');
var app = require('../../server/server.js');

module.exports = function (Message) {

  var Device = app.models.Device;

  Message.afterRemote('create', function (context, message, next) {
    console.log('> Message.afterRemote triggered');
    console.log(message);

    message = decodeMessage(message);

    message.save(function (err, instance) {
      if (err) {
        console.log(err);
      } else {
        console.log(instance);
      }
    });

    next();
  });
};


//Private functions
function decodeMessage(message) {

  if (message.data.length == 24) {
    message.message_type = 'Normal';
    //console.log('OK');
    var framePattern = /(.{1})(.{31})(.{1})(.{31})(.{2})(.{2})(.{4})(.{4})(.{4})(.{8})(.{8})/;
    var binaryFrame = getBinaryFrame(message.data);
    var frame = framePattern.exec(binaryFrame);


    var lat = (frame[1] === "1" ? -1 : 1) * getDecimalCoord(parseInt(frame[2], 2) / Math.pow(10, 6));
    //console.log('lat:', lat);
    message.lat = lat;
    var lng = (frame[3] === "1" ? -1 : 1) * getDecimalCoord(parseInt(frame[4], 2) / Math.pow(10, 6));
    //console.log('long:', lng);
    message.long = lng;

    var hdop = parseInt(frame[5], 2);
    //console.log('hdop:', frame[5]);
    //console.log('hdop:', hdop);
    switch (hdop) {
      case 3:
        message.hdop = 600;
        break;
      case 2:
        message.hdop = 200;
        break;
      case 1:
        message.hdop = 100;
        break;
      case 0:
        message.hdop = 0;
        break;
    }


    var sat = parseInt(frame[6], 2);
    //console.log('nbSat:', frame[6]);
    //console.log('nbSat:', sat);
    message.sat = sat * 2 + 2;

    var gps_acq = parseInt(frame[8], 2);
    //console.log('gps_acq:', frame[8]);
    //console.log('gps_acq:', gps_acq);
    message.gps_acq = gps_acq * 5;

    var speed = parseInt(frame[9], 2);
    //console.log('speed:', frame[9]);
    //console.log('speed:', speed);
    message.speed = speed * 5;

    var battery = parseInt(frame[10], 2);
    //console.log('battery', frame[10]);
    //console.log('battery', battery);
    message.battery = battery * 15 / 1000;

    var alert = parseInt(frame[11], 2);
    //console.log('alert', frame[11]);
    //console.log('alert', alert);
    message.alert = alert;

    return message;

  }

  if (message.data.length == 2 || message.data.length == 4) {
    message.message_type = 'Timeout';
    if(message.data.length == 4){
      var battery = parseInt(message.data.substring(0,2), 16);
    }else{
      var battery = parseInt(message.data, 16);
    }
    //console.log('battery', message.data);
    //console.log('battery', battery);
    message.battery = battery * 15 / 1000;

    return message;
  }
}


function getBinaryFrame(frameHex) {
//  console.log('getFrameBinary', frameHex);
  var bytes = frameHex.match(/.{1,2}/g);
  if (bytes.length !== 12) {
    //console.log('Invalid frame, got %s bytes', bytes.length);
    return null;
  }
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

function backendRequest(url) {

}
