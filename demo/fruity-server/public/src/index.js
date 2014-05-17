(function() {
  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
  } else {

    // Start game by prompting for user
    $("#username-dialog").dialog({
      modal: true,
      resizable: false,
      buttons: {
        "Ok": function() {
          $.get('/get_username_score?username=' + $('#username').val(), function (data) {
            // TODO: use knockout to bind this
            $('#max_score').text(data.max_score);
            $('#username-dialog').dialog("close");

            initGame();
          });
        }
      }
    });

    function initGame() {
      var width = window.innerWidth;
      var height = window.innerHeight;
      var aspect = 16 / 9;
      if (width / aspect > height) {
        width = height * aspect;
      } else {
        height = width / aspect;
      }

      var opts = {
        width: width,
        height: height,
        container: $('#container')
      };

      var game = new Game(opts);

      game.initScene(function () {
        // game.initKinectController();

        game.renderLoop();
      });
    }
  }
})();