function ScoreBoardViewModel(username, maximumScore, currentScore) {
  this.username = ko.observable(username);
  this.maximumScore = ko.observable(maximumScore);
  this.currentScore = ko.observable(currentScore);

  this.save = function() {
    ko.utils.postJson('/update_username_score', ko.toJSON(this));
  }
}