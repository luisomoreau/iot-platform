'use strict';

var log = require('debug')('boot:04-load-messages');

module.exports = function (app) {

  if (app.dataSources.db.name !== 'Memory' && !process.env.INITDB) {
    return;
  }

  log('Creating Messages');

  var Message = app.models.Message;

  messages.forEach(function (message) {
    Message.findOrCreate(
      {where: {time: message.time}}, // find
      message, // create
      function (err, createdItem, created) {
        if (err) {
          console.error('error creating message', err);
        }
        (created) ? log('created messaqe', createdItem.id)
          : log('found message', createdItem.id);
      });
  });

};
var messages = []
    ;
