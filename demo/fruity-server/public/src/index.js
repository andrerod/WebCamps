(function() {
  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
  } else {
    function displayError(message) {
      // create unique id for div
      var dialog_id = "error_dialog_" + new Date().getTime();

      // append html to body
      $("body").append("<div id=\"" + dialog_id + "\">" + message + "</div>");

      // display the error dialog
      $("#" + dialog_id).dialog({
        modal: true,
        resizable: false,
        height: 175,
        width: 400,
        title: "Oops, something went wrong!",
        buttons: {
          Ok: function() {
            $(this).dialog("close");

            initGame();
          }
        },
        beforeClose: function(event, ui) {
          // remove dialog div from document
          $("#" + dialog_id).remove();
        }
      });
    }

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
        $("#kinect").click(function() {
          game.initKinectController();
        });

        game.renderLoop();
      });
    }

    // Start game by prompting for user
    $("#username-dialog").dialog({
      modal: true,
      resizable: false,
      buttons: {
        "Ok": function() {
          $.get('/game/get_username_score?username=' + $('#username').val(), function (data) {
            $('#max_score').text(data.max_score);
            $('#username-dialog').dialog("close");

            if (data.error) {
              displayError(data.error);
            } else {
              initGame();
            }
          });
        }
      }
    });
  }
})();