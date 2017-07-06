const Twit = require('twit');
const config = require('./config.js');


//setting up authentication
function TwitterData() {
  this.T = new Twit(config);
  this.followersData = [];
  this.authUserData = [];
  this.friendsDirectMsg = [];
  this.authDirectMsg = [];
}

//Function getting followers screen name, name, profile image URL and pushes data to followersData
TwitterData.prototype.getFollowersData = function () {
  return new Promise((resolve, reject) => {
    this.T.get('followers/list', { screen_name: 'JoannaDemecka', count: 5 }, (err, data, response) => {
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


//Function gets authorisied user's twits, retweets and favorite count, profile image, name and screen name
//It returns error if there is no such a user
TwitterData.prototype.getAuthUserData = function () {
  return new Promise((resolve, reject) => {
    this.T.get('statuses/home_timeline', { screen_name: 'JoannaDemecka', count: 5 }, (err, data, response) => {
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


//Function gets 5 direct messages from friends with message info
TwitterData.prototype.getFriendsDirectMessages = function () {
  return new Promise((resolve, reject) => {
    this.T.get('direct_messages', { count: 5 }, (err, data, response) => {
      if (err) {
        console.log(err);
      } else {
        data.forEach((d) => {
          let friendsDirectMsgItem = {};
          friendsDirectMsgItem.text = d.text;
          friendsDirectMsgItem.name = d.sender.name;
          friendsDirectMsgItem.screen_name = d.sender.screen_name;
          friendsDirectMsgItem.profile_image_url = d.sender.profile_image_url;
          friendsDirectMsgItem.date = d.created_at;
          this.friendsDirectMsg.push(friendsDirectMsgItem);
        });
        resolve(this.friendsDirectMsg);
      }
    });
  });
}


//Function gets last 5 messages written by authorised user, in case I will use it in the future
TwitterData.prototype.getAuthUserDirectMessages = function () {
  return new Promise((resolve, reject) => {
    this.T.get('direct_messages/sent', { count: 5 }, (err, data, response) => {
      if (err) {
        console.log(err);
      } else {
        data.forEach((d) => {
          let authUserMessages = {};
          authUserMessages.text = d.text;
          authUserMessages.date = d.created_at;
          authUserMessages.name = d.sender.name;
          authUserMessages.screen_name = d.sender.screen_name;
          authUserMessages.profile_image_url = d.sender.profile_image_url;
          authUserMessages.profile_banner_url = d.sender.profile_banner_url;
          this.authDirectMsg.push(authUserMessages);
        });
        resolve(this.authDirectMsg);
      }
    });
  });
}

//Function creates final data, which is used in jade template
TwitterData.prototype.createFinalData = function (callback) {
  let promises = [];
  promises.push(this.getFollowersData());
  promises.push(this.getAuthUserData());
  promises.push(this.getFriendsDirectMessages());
  promises.push(this.getAuthUserDirectMessages());
  Promise.all(promises).then(values => {
    let finalData = {};
    finalData.followers = values[0];
    finalData.timeline = values[1];
    finalData.friends_direct_messages = values[2];
    finalData.user_direct_messages = values[3];
    callback(finalData);
  }, function(err) {

  });
}


//Function for sending twits
TwitterData.prototype.sendTwit = function (twitText) {
  this.T.post('statuses/update', { status: twitText }, (err, data, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data.text + ' was tweeted');
    }
  });
}


//Funnction for create tweets data and streaming using twit and socket.io
TwitterData.prototype.streamData = function (io) {
  let stream = this.T.stream('user', { screen_name: 'JoannaDemecka' });
  stream.on('tweet', (data) => {
    let tweet = {
      "text" : data.text,
      "screen_name" : data.user.screen_name,
      "name": data.user.screen_name ,
      "imageURL": data.user.profile_image_url,
      "retweet_count": data.retweet_count,
      "likes": data.favorite_count,
      "date": data.created_at
    }
    io.sockets.emit('twitter-stream', tweet);
  });
}

module.exports = TwitterData;
