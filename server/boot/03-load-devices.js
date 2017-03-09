'use strict';

var log = require('debug')('boot:03-load-devices');

module.exports = function (app) {

    if (app.dataSources.db.name !== 'Memory' && !process.env.INITDB) {
        return;
    }

    log('Creating Devices');

    var Device = app.models.Device;

    var devices = [

    ]

    devices.forEach(function (device) {
        Device.findOrCreate(
            {where: {id: device.id}}, // find
            device, // create
            function (err, createdItem, created) {
                if (err) {
                    console.error('error creating device', err);
                }
                (created) ? log('created device', createdItem.id)
                    : log('found device', createdItem.id);
            });
    });





};
