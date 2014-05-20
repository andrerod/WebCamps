var fs = require('fs');

var azure = require('azure');

var express = require('express');
var router = express.Router();

router.get('/background', function (req, res) {
  function sendLocal() {
    // use local copy
    console.log('sending local file');
    fs.createReadStream('./public/images/background.jpg').pipe(res);
  }

  try {
    var blobService = azure.createBlobService();
    blobService.listBlobs('azure', function (err, blobs) {
      if (!err && blobs.length > 0) {
        blobService.getBlob('azure', blobs[0].name).pipe(res);
      } else {
        sendLocal();
      }
    });
  } catch (e) {
    sendLocal();
  }
});

router.get('/get_username_score', function (req, res) {
  var username = req.query.username;

  try {
    var tableService = azure.createTableService();
    tableService.createTableIfNotExists('users', function () {
      tableService.queryEntity ('users', 'user', username, function (err, user) {
        if (!err && user) {
          res.json({ max_score: user.max_score });
        } else {
          res.json({ max_score: 0 });
        }
      });
    });
  } catch (e) {
    res.json({
      error: 'Data store connection could not be established. Your results will not be saved.',
      exception: e,
      max_score: 0
    });
  }
});

router.post('/update_username_score', function (req, res) {
  var username = req.body.username;
  var score = req.body.score;

  try {
    var tableService = azure.createTableService();
    tableService.queryEntity ('users', 'user', username, function (err, user) {
      if (!err && user && score > user.max_score) {
        user.max_score = score;

        tableService.updateEntity ('users', user, function () {
          console.log('updating user ' + username + ' with score ' + score);
          res.json({ max_score: score });
        });
      } else {
        tableService.insertEntity ('users', { PartitionKey: 'user', RowKey: username, max_score: score }, function () {
          console.log('inserted user ' + username + ' with score ' + score);
          res.json({ max_score: score });
        });
      }
    });
  } catch (e) {
    res.json({
      error: 'Data store connection could not be established. Your results will not be saved.',
      exception: e,
      max_score: score
    });
  }
});

module.exports = router;