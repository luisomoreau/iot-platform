'use strict';

// to enable these logs set `DEBUG=boot:01-load-settings` or `DEBUG=boot:*`
var log = require('debug')('boot:01-load-parsers');

module.exports = function (app) {

  var Parser = app.models.Parser;

  function loadDefault() {
    console.error('Creating default parsers');

    var parsers = [
      {
        "name": "Geoloc Wifi",
        "description": "Using the 2 strongest wifi MAC addresses near the device to call Google API to get geolocalisation position"
      },
      {
        "name": "Sensit",
        "description": "Decode the sensit sent data"
      },
      {
        "name": "Tuto GPS",
        "description": "Decode the GPS data from the tutorial: https://www.instructables.com/id/Sigfox-GPS-Tracker/"
      },
      {
        "name": "Talking Plant",
        "description": "Get the plan information, first byte being humidity, second temperature and third brightness and forth alert"
      },
      {
        "name": "Forest Fire Alarm",
        "description": "First byte is the alert, second is the temperature and third humidity"
      }
    ];

    parsers.forEach(function (parser) {
      Parser.create(parser, function (err) {
        if (err) {
          console.error(err);
        }
      });
    });
  }

  function loadExisting() {
    console.error('Loading existing parsers');

    Parser.find(function (data) {
      log(data);
    });
  }


  Parser.count(function (err, result) {
    if (err) {
      console.error(err);
    }
    if (result < 1) {
      loadDefault();
    } else {
      loadExisting();
    }
  });


};
