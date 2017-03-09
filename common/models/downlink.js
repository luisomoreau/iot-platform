'use strict';

module.exports = function (Downlink) {

  Downlink.remoteMethod(
    'payload',
    {
      accepts: {arg: 'deviceId', type: 'String', required: true},
      http: {path: '/:deviceId/payload', verb: 'get'},
      returns: {arg: 'deviceId', type: 'Object', root: true}
    }
  );

  Downlink.payload = function (deviceId, cb) {
    Downlink.findOne({where: {deviceId: deviceId}}, function (err, downlink) {
      if(downlink){
        var results = {
          [deviceId]:{
            downlinkData: downlink.payload
          }
        }
      }else{
          var results = {
            [deviceId]:{
              noData: true
            }
        }

      }
      cb(null, results);
    });

  }

};
