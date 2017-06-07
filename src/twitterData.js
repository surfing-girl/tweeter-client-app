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
  this.followersData = [];
  this.authUserData = [];
  this.friendsDirectMsg = [];
  this.authDirectMsg = [];

  console.log("start", this.friendsDirectMsg);
}

TwitterData.prototype.getFollowersData = function () {
  return new Promise((resolve, reject) => {
    this.T.get('followers/list', { screen_name: 'JoannaDemecka' }, (err, data, response) => {
      if (err) {
        console.log(err);
      } else {
        data.users.forEach((user) => {
          let followersDataItem = {}
          followersDataItem.screen_name = user.screen_name;
          followersDataItem.name = user.name;
          followersDataItem.profile_image_url = user.profile_image_url;
          this.followersData.push(followersDataItem)
        });
        resolve(this.followersData);
      }
    });
  });
}

TwitterData.prototype.getAuthUserData = function () {
  return new Promise((resolve, reject) => {
    this.T.get('statuses/user_timeline', { screen_name: 'JoannaDemecka', count: 5 }, (err, data, response) => {
      if (err) {
        console.log(err);
      } else {
        data.forEach((d) => {
          let authUserDataItem = {};
          authUserDataItem.userTwits = d.text;
          authUserDataItem.userRetweetCount = d.retweet_count;
          authUserDataItem.userFavoriteCount = d.favorite_count;
          authUserDataItem.userTwitTimestamp = d.created_at;
          authUserDataItem.userAvatar = d.user.profile_image_url;
          authUserDataItem.userName = d.user.name;
          authUserDataItem.userScreenName = d.user.screen_name;
          this.authUserData.push(authUserDataItem);
        });
        resolve(this.authUserData);
      }
    });
  });
}

TwitterData.prototype.getFriendsDirectMessages = function () {
  this.T.get('direct_messages', { count: 5 }, (err, data, response) => {
    if (err) {
      console.log(err);
    } else {
      data.forEach((d) => {
        this.friendsDirectMsg.text = d.text;
        this.friendsDirectMsg.name = d.sender.name;
        this.friendsDirectMsg.screen_name = d.sender.screen_name;
        this.friendsDirectMsg.profile_image_url = d.sender.profile_image_url;
        this.friendsDirectMsg.date = d.created_at;
        //console.log(this.friendsDirectMsg);
      });
      //callback(this.friendsDirectMsg);
    }
  });
}

TwitterData.prototype.getAuthUserDirectMessages = function () {
  this.T.get('direct_messages/sent', { count: 5 }, (err, data, response) => {
    if (err) {
      console.log(err);
    } else {
      data.forEach((d) => {
        this.authDirectMsg.text = d.text;
        this.authDirectMsg.date = d.created_at;
      });
    }
  });
}

TwitterData.prototype.createFinalData = function (callback) {
  let promises = [];
  promises.push(this.getFollowersData());
  promises.push(this.getAuthUserData());
  Promise.all(promises).then(values => {
    let finalData = {};
    finalData.followers = values[0];
    finalData.timeline = values[1];
    callback(finalData);
  }, function(err) {

  });
};

module.exports = TwitterData;
