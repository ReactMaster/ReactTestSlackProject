var Message = require('../models/Message');
var bodyparser = require('body-parser');

module.exports = function(router) {
  router.use(bodyparser.json());

  // query DB for ALL messages
  router.get('/messages', function(req, res) {
    Message.find({}, {id: 1, channelID: 1, text: 1, user: 1, time: 1, _id: 0}, function(err, data) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json(data);
    });
  });

  // query DB for messages for a specific channel
  router.get('/messages/:channel', function(req, res) {
    Message.find({channelID: req.params.channel}, {id: 1, channelID: 1, text: 1, user: 1, time: 1, _id: 0}, function(err, data) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json(data);
    });
  })

  //post a new message to db
  router.post('/newmessage', function(req, res) {
    var newmsg = req.body.text;

    console.log('body data', req.body.user);
    if(newmsg.indexOf('/sticker') !== -1) {
     Message.
      find({
        channelID: req.body.channelID,
      }).
      select({id: 1, channelID: 1, text: 1, user: 1, time: 1, _id: 1}).
      exec(function(err, data) {
       if(err) {
         console.log(err)
         return res.status(500).json({msg: 'internal server error'});
       }

       data.map((item) => {
         if(item.text.indexOf('sticker') !== -1) {
           item.text = item.text.replace('sticker', '');
           console.log(item);
           Message.find({_id: item._id}).update({ $set: {text: item.text}}).exec();
         }
       });

       res.json(data);
     });

    }else {
      var newMessage = new Message(req.body);
      newMessage.save(function (err, data) {
        if(err) {
          console.log(err);
          return res.status(500).json({msg: 'internal server error'});
        }
        res.json(data);
      });
    }
  });
}
