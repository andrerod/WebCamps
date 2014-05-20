var express = require('express');
var router = express.Router();

var azure = require('azure');

/* GET users listing. */
router.get('/background', function(req, res) {
  try {
    var blobService = azure.createBlobService();
    blobService.listBlobs('azure', function (err, blobs) {
      if (!err && blobs.length > 0) {
        blobService.getBlob('azure', blobs[0].name).pipe(res);
      } else {
		    res.status(404).send('Not found');
      }
    });
  } catch (e) {
	  res.status(404).send('Not found');
  }
});

module.exports = router;
