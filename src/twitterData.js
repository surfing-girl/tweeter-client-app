const Twit = require('twit');
const config = require('./config.js');

function TwitterData() {
  this.T = new Twit({
    consumer_key:         config.consumer_key,
    consumer_secret:      config.consumer_secret,
    access_token:         config.access_token,
    access_token_secret:  config.access_token_secret,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  });
  this.followersData = {};
  this.authUserData = {};
  this.friendsDirectMsg = {};
  this.authDirectMsg = {};
  this.finalData = [];
  console.log("start", this.friendsDirectMsg);
}

TwitterData.prototype.getFollowersData = function () {
  this.T.get('followers/list', { screen_name: 'JoannaDemecka' },  function (err, data, response) {
    if (err) {
      console.log(err);
    } else {
      data.users.forEach((user) => {
        this.followersData.screen_name = user.screen_name;
        this.followersData.name = user.name;
        this.followersData.profile_image_url = user.profile_image_url;
      });
    }
  });
}

TwitterData.prototype.getAuthUserData = function () {
  this.T.get('statuses/user_timeline', { screen_name: 'JoannaDemecka', count: 5 },  function (err, data, response) {
    if (err) {
      console.log(err);
    } else {
      data.forEach((d) => {
        this.authUserData.userTwits = d.text;
        this.authUserData.userRetweetCount = d.retweet_count;
        this.authUserData.userFavoriteCount = d.favorite_count;
        this.authUserData.userTwitTimestamp = d.created_at;
        this.authUserData.userAvatar = d.user.profile_image_url;
        this.authUserData.userName = d.user.name;
        this.authUserData.userScreenName = d.user.screen_name;
      });
    }
  });
}

TwitterData.prototype.getFriendsDirectMessages = function (callback) {
  this.T.get('direct_messages', { count: 5 },  (err, data, response) => {
    if (err) {
      console.log(err);
    } else {
      data.forEach((d) => {
        this.friendsDirectMsg.text = d.text;
        this.friendsDirectMsg.name = d.sender.name;
        this.friendsDirectMsg.screen_name = d.sender.screen_name;
        this.friendsDirectMsg.profile_image_url = d.sender.profile_image_url;
        this.friendsDirectMsg.date = d.created_at;
        console.log(this.friendsDirectMsg);
      });
      callback(this.friendsDirectMsg);
    }
  });
}

TwitterData.prototype.getAuthUserDirectMessages = function () {
  this.T.get('direct_messages/sent', { count: 5 },  function (err, data, response) {
    if (err) {
      console.log(err);
    } else {
      data.forEach((d) => {
        this.authDirectMsg.text = d.text;
        this.authDirectMsg.date = d.created_at;
      });
      //console.log(this.authDirectMsg);
    }
  });
}

// TwitterData.prototype.createFinalData = function () {
//   this.getFollowersData();
//   this.getAuthUserData();
//   this.getFriendsDirectMessages();
//   this.getAuthUserDirectMessages();
//   let data = {
//     followersData: this.followersData,
//     authUserData: this.authUserData,
//     friendsDirectMsg: this.friendsDirectMsg,
//     authDirectMsg: this.authDirectMsg
//   };
//   this.finalData.push(data);
//   console.log(this.finalData);
// };

module.exports = TwitterData;
