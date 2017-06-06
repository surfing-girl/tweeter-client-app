const Twit = require('twit');
const config = require('./config.js');

const T = new Twit({
  consumer_key:         config.consumer_key,
  consumer_secret:      config.consumer_secret,
  access_token:         config.access_token,
  access_token_secret:  config.access_token_secret,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

let followersData = {};

T.get('followers/list', { screen_name: 'JoannaDemecka' },  function (err, data, response) {
  if (err) {
    console.log(err);
  } else {
    data.users.forEach((user) => {
      followersData.screen_name = user.screen_name;
      followersData.name = user.name;
      followersData.profile_image_url = user.profile_image_url;
    });
  }
});

let authUserData = {};

T.get('statuses/user_timeline', { screen_name: 'JoannaDemecka', count: 5 },  function (err, data, response) {
  if (err) {
    console.log(err);
  } else {
    data.forEach((d) => {
      authUserData.userTwits = d.text;
      authUserData.userRetweetCount = d.retweet_count;
      authUserData.userFavoriteCount = d.favorite_count;
      authUserData.userTwitTimestamp = d.created_at;
      authUserData.userAvatar = d.user.profile_image_url;
      authUserData.userName = d.user.name;
      authUserData.userScreenName = d.user.screen_name;
    });
  }
});

let friendsDirectMsg = {};

T.get('direct_messages', { count: 5 },  function (err, data, response) {
  if (err) {
    console.log(err);
  } else {
    data.forEach((d) => {
      friendsDirectMsg.text = d.text;
      friendsDirectMsg.name = d.sender.name;
      friendsDirectMsg.screen_name = d.sender.screen_name;
      friendsDirectMsg.profile_image_url = d.sender.profile_image_url;
      friendsDirectMsg.date = d.created_at;
    });
  }
});

let authDirectMsg = {};

T.get('direct_messages/sent', { count: 5 },  function (err, data, response) {
  if (err) {
    console.log(err);
  } else {
    data.forEach((d) => {
      authDirectMsg.text = d.text;
      authDirectMsg.date = d.created_at;
    });
    //console.log(authDirectMsg);
  }
});
