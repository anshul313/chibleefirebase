/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// [START imports]
var firebase = require('firebase');
// [END imports]
var nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var Promise = require('promise');
var escape = require('escape-html');
var path = require('path');
var express = require('express');
var app = express();
var GeoFire = require('geofire');
var _ = require('lodash');
var async = require('async');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());
// Add the cookie parser and flash middleware
app.use(cookieParser());
app.use(flash());

firebase.initializeApp({
  // databaseURL: 'https://qykly-df70e.firebaseio.com',
  databaseURL: 'https://chiblee-app-c2f87.firebaseio.com/',
  serviceAccount: './../service_account.json'
});
var db = firebase.database();
// var ref = db.ref("Category");


app.get('/auth', function(req, res) {
  // var provider = firebase.auth.GoogleAuthProvider();
  // firebase.auth().signInWithPopup().then(function(result) {
  //   console.log('result : ', result);
  // }).catch(function(error) {
  //   console.log('error is : ', error);
  // });
  firebase.auth().signInWithEmailAndPassword('anshul@loudshout.in',
      'anshul@1212313')
    .catch(
      function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
});

app.get('/', function(req, res) {

  var usersRef = ref.child("users");
  usersRef.set({
    alanisawesome: {
      date_of_birth: "June 23, 1912",
      full_name: "Alan Turing"
    },
    gracehop: {
      date_of_birth: "December 9, 1906",
      full_name: "Grace Hopper"
    }
  }, function() {
    console.log('successfully inserted');
    res.send('successfully inserted');
  });
});

app.get('/api3/update', function(req, res) {
  var usersRef = ref.child("users");
  var hopperRef = usersRef.child("gracehop");
  hopperRef.update({
    "nickname": "Amazing Grace"
  }, function() {
    console.log('successfully updated');
    res.send('successfully updated');
  });
});

app.get('/api3/push', function(req, res) {
  var postsRef = ref.child("posts");

  postsRef.child('Anshul').push([{
    author: "gracehop",
    title: "Announcing COBOL, a New Programming Language",
    location: [28.123456, 77.231456]
  }, {
    author: "gracehop",
    title: "Announcing COBOL, a New Programming Language",
    location: [48.643521, 77.231546]
  }, {
    author: "Anshul Sharma",
    title: "Announcing COBOL, a New Programming Language",
    location: [48.643521, 77.231546]
  }], function() {
    console.log('successfully inserted');
    res.send('successfully insetred');
  });
  // postsRef.push().set({
  //   author: "alanisawesome",
  //   title: "The Turing Machine"
  // }, function() {
  //   console.log('successfully inserted');
  //   res.send('successfully insetred');
  // });
});

app.get('/api3/get', function(req, res) {
  var ref = db.ref("Chiblee/posts");
  ref.on("value", function(snapshot) {
    var result = snapshot.val();
    console.log(result);
    // console.log(result[0].location);
    // console.log(result[0].location[0]);
    res.send(snapshot.val());
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
    res.send(errorObject.code);
  });
});

var server = app.listen(9999, function() {
  console.log(" Express is running on port 9999 !!!!!");
});

app.get('/api3/insert', function(req, res) {
  var i = 0;
  var count = 1;
  var fs = require('fs');
  var JSONStream = require('JSONStream');
  var es = require('event-stream');

  for (var k = 311; k <= 400; k++) {
    console.log('K : ', k);
    var fileStream = fs.createReadStream(
      './../atm/atm_(' + k.toString() + ').json', {
        encoding: 'utf8'
      });
    fileStream.pipe(JSONStream.parse('*')).pipe(es.through(function(
      data) {
      // console.log('printing one customer object read from file ::');
      // console.log(data, "   : ", ++i);
      this.pause();
      processOneCustomer(data, this);
      return data;
    }), function end() {
      console.log('stream reading ended');
      this.emit('end');
    });

    function processOneCustomer(data, es) {
      console.log(data.length);
      for (i = 0; i < data.length; i++) {
        if (data[i].results.length > 0) {
          // console.log("lat", data[i].results[0].geometry.location.lat);
          // console.log("lng", data[i].results[0].geometry.location.lng);
          for (var j = 0; j < data[i].results.length; j++) {

            var vicinityArea = data[i].results[j].vicinity.split(",");
            if (vicinityArea.length > 2) {
              var area = vicinityArea[vicinityArea.length - 2];
            } else {
              var area = data[i].results[j].vicinity;
            }

            // console.log("Area : ", area);

            var firebaseData = new Object({
              "latitude": data[i].results[j].geometry.location.lat,
              "longitude": data[i].results[j].geometry.location.lng,
              "placeId": data[i].results[j].place_id,
              "area": area,
              "category": "Owl",
              "subCategory": "ATM",
              "name": data[i].results[j].name,
              "homeDelivery": "No",
              "remarks": "-",
              "open": "24x7",
              "close": "-",
              "multipleTiming": "NA",
              "contactNo": "-",
              "address": data[i].results[j].vicinity,
              "tag": ["ATM"],
              "image": data[i].results[j].icon,
              "type": data[i].results[j].types,
              "time": Date.now(),
              "uploadtime": Date.now(),
              "status": "live",
              "username": data[i].results[j].scope
            });
            var ref1 = db.ref('Chiblee').child(firebaseData['category']).child(
              firebaseData['subCategory']);
            var geoRef = new GeoFire(ref1);

            var key = data[i].results[
              j].place_id;
            console.log('Key 1 : ', key);
            geoRef.set(firebaseData['category'] + '*' +
              firebaseData['subCategory'] + '*' + key, [
                firebaseData['latitude'], firebaseData[
                  'longitude']
              ]);

            // .then(
            //   function() {
            //     console.log(key);
            //     console.log("Provided key has been added to GeoFire");
            //
            //   },
            //   function(error) {
            //     console.log("Error: " + error);
            //   });

            var postsRef = db.ref('Chiblee').child(firebaseData['category']);
            postsRef.child(firebaseData['subCategory']).child(data[i].results[
              j].place_id).set(
              firebaseData,
              function() {
                console.log('successfully inserted : ', count++);
              });
          }
        }
      }
    }
    // res.send('successfully insetred');
  }
});


app.post('/api3/getgeodata', function(req, res) {
  var finalresult = [];
  var asyncTasks = [];
  var ref1 = db.ref('Chiblee').child(req.body.category).child(req.body.subcategory);
  var geoRef = new GeoFire(ref1);
  var radius = 2;
  if(req.body.radius) {
    radius = req.body.radius;
  }
  var geoQuery = geoRef.query({
    center: [req.body.lat, req.body.lng],
    radius: radius //kilometers
  });
  var arr = [];
  var keysEntered = false;
  geoQuery.on("key_entered", function(key, location, distance) {
    var data = new Object({
      'key': key,
      'location': location,
      'distance': distance
    });
    arr.push(data);
    var keysEntered = true;
    // console.log('array : ', arr)
  });
  geoQuery.on("ready", function() {
    var myObjects = _.sortBy(arr, 'distance');
    // console.log(myObjects);
    _.forEach(myObjects, function(result) {
      asyncTasks.push(function(callback) {
        var res = result.key.split("*")
          // console.log('result key : ', res[2]);
        var ref = db.ref(
          'Chiblee/' + req.body.category + '/' + req.body.subcategory +
          '/' + res[2]
        );
        // ref = ref.child('gas_station').child(
        //   'gas_station' + 'ChIJcT4M7MerDTkR88tbnlV8Cd4');
        ref.on("value", function(snapshot) {
          var obj = snapshot.val();
          obj.distance = result.distance;
          // console.log(result);
          callback(null, obj);
        }, function(errorObject) {
          console.log("The read failed: " + errorObject.code);
          callback(err, true);
        });
      });
    });
    async.parallel(asyncTasks, function(err, result) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      var start = req.body.page * 10;
      var end = start + 10;
      if(start > result.length-10) {
        res.json({
          result : [],
          message: 'NO_MORE_DATA'
        });
      }else {
        if(end > result.length) {
          end = result.length;
        }
        for(var i = start;i<end;i++)
          finalresult.push(result[i]);
        // _.forEach(result, function(vendors) {
        //   finalresult.push(vendors);
        // });
        if (!keysEntered) {
          res.json({
            result: finalresult,
            message: 'OK'
          });
        }
      }
    });
  });
});


app.post('/api3/testdata', function(req, res) {
  console.log(req.body.lat);
  console.log(req.body.lng);
  var finalresult = [];
  var asyncTasks = [];
  var ref1 = db.ref('Chiblee').child('gas_station').child('gas_station');
  var geoRef = new GeoFire(ref1);
  var geoQuery = geoRef.query({
    center: [req.body.lat, req.body.lng],
    radius: 5 //kilometers
  });
  var arr = [];
  var keysEntered = false;
  geoQuery.on("key_entered", function(key, location, distance) {
    console.log('key  : ', key);
    console.log('key  : ', location);
    console.log('distance  : ', distance);
    var data = new Object({
      'key': key,
      'location': location,
      'distance': distance
    });
    arr.push(data);
    // console.log('array : ', arr)
  });
});
// console.log(path.isAbsolute('./../service_account.json'));

// TODO(DEVELOPER): Configure your email transport.
// Configure the email transport using the default SMTP transport and a GMail account.
// See: https://nodemailer.com/
// For other types of transports (Amazon SES, Sendgrid...) see https://nodemailer.com/2-0-0-beta/setup-transporter/
// var mailTransport = nodemailer.createTransport(
//   'smtps://<user>%40gmail.com:<password>@smtp.gmail.com');

// TODO(DEVELOPER): Change the two placeholders below.
// [START initialize]
// Initialize the app with a service account, granting admin privileges
// firebase.initializeApp({
//   databaseURL: 'https://qykly-df70e.firebaseio.com',
//   serviceAccount: './../service_account.json'
// });
// [END initialize]

/**
 * Send a new star notification email to the user with the given UID.
 */
// [START single_value_read]
// function sendNotificationToUser(uid, postId) {
//   // Fetch the user's email.
//   var userRef = firebase.database().ref('/users/' + uid);
//   userRef.once('value').then(function(snapshot) {
//     var email = snapshot.val().email;
//     // Send the email to the user.
//     // [START_EXCLUDE]
//     if (email) {
//       sendNotificationEmail(email).then(function() {
//         // Save the date at which we sent that notification.
//         // [START write_fan_out]
//         var update = {};
//         update['/posts/' + postId + '/lastNotificationTimestamp'] =
//           firebase.database.ServerValue.TIMESTAMP;
//         update['/user-posts/' + uid + '/' + postId +
//             '/lastNotificationTimestamp'] =
//           firebase.database.ServerValue.TIMESTAMP;
//         firebase.database().ref().update(update);
//         // [END write_fan_out]
//       });
//     }
//     // [END_EXCLUDE]
//   }).catch(function(error) {
//     console.log('Failed to send notification to user:', error);
//   });
// }
// // [END single_value_read]
//
//
// /**
//  * Send the new star notification email to the given email.
//  */
// function sendNotificationEmail(email) {
//   var mailOptions = {
//     from: 'anshulsharma.sharma997@gmail.com',
//     to: 'anshul@loudshout.in',
//     subject: 'New star!',
//     text: 'One of your posts has received a new star!'
//   };
//   return mailTransport.sendMail(mailOptions).then(function() {
//     console.log('New star email notification sent to: ' + email);
//   });
// }
//
// /**
//  * Update the star count.
//  */
// // [START post_stars_transaction]
// function updateStarCount(postRef) {
//   postRef.transaction(function(post) {
//     if (post) {
//       post.starCount = post.stars ? Object.keys(post.stars).length : 0;
//     }
//     return post;
//   });
// }
// // [END post_stars_transaction]
//
// /**
//  * Keep the likes count updated and send email notifications for new likes.
//  */
// function startListeners() {
//   firebase.database().ref('/posts').on('child_added', function(postSnapshot) {
//     var postReference = postSnapshot.ref;
//     var uid = postSnapshot.val().uid;
//     var postId = postSnapshot.key;
//     // Update the star count.
//     // [START post_value_event_listener]
//     postReference.child('stars').on('value', function(dataSnapshot) {
//       updateStarCount(postReference);
//       // [START_EXCLUDE]
//       updateStarCount(firebase.database().ref('user-posts/' + uid + '/' +
//         postId));
//       // [END_EXCLUDE]
//     }, function(error) {
//       console.log('Failed to add "value" listener at /posts/' + postId +
//         '/stars node:', error);
//     });
//     // [END post_value_event_listener]
//     // Send email to author when a new star is received.
//     // [START child_event_listener_recycler]
//     postReference.child('stars').on('child_added', function(dataSnapshot) {
//       sendNotificationToUser(uid, postId);
//     }, function(error) {
//       console.log('Failed to add "child_added" listener at /posts/' +
//         postId + '/stars node:', error);
//     });
//     // [END child_event_listener_recycler]
//   });
//   console.log('New star notifier started...');
//   console.log('Likes count updater started...');
// }
//
// /**
//  * Send an email listing the top posts every Sunday.
//  */
// function startWeeklyTopPostEmailer() {
//   // Run this job every Sunday at 2:30pm.
//   schedule.scheduleJob({
//     hour: 14,
//     minute: 30,
//     dayOfWeek: 0
//   }, function() {
//     // List the top 5 posts.
//     // [START top_posts_query]
//     var topPostsRef = firebase.database().ref('/posts').orderByChild(
//       'starCount').limitToLast(5);
//     // [END top_posts_query]
//     var allUserRef = firebase.database().ref('/users');
//     Promise.all([topPostsRef.once('value'), allUserRef.once('value')]).then(
//       function(resp) {
//         var topPosts = resp[0].val();
//         var allUsers = resp[1].val();
//         var emailText = createWeeklyTopPostsEmailHtml(topPosts);
//         sendWeeklyTopPostEmail(allUsers, emailText);
//       }).catch(function(error) {
//       console.log('Failed to start weekly top posts emailer:', error);
//     });
//   });
//   console.log('Weekly top posts emailer started...');
// }
//
// /**
//  * Sends the weekly top post email to all users in the given `users` object.
//  */
// function sendWeeklyTopPostEmail(users, emailHtml) {
//   Object.keys(users).forEach(function(uid) {
//     var user = users[uid];
//     if (user.email) {
//       var mailOptions = {
//         from: '"Firebase Database Quickstart" <noreply@firebase.com>',
//         to: user.email,
//         subject: 'This week\'s top posts!',
//         html: emailHtml
//       };
//       mailTransport.sendMail(mailOptions).then(function() {
//         console.log('Weekly top posts email sent to: ' + user.email);
//         // Save the date at which we sent the weekly email.
//         // [START basic_write]
//         return firebase.database().child('/users/' + uid +
//             '/lastSentWeeklyTimestamp')
//           .set(firebase.database.ServerValue.TIMESTAMP);
//         // [END basic_write]
//       }).catch(function(error) {
//         console.log('Failed to send weekly top posts email:', error);
//       });
//     }
//   });
// }
//
// /**
//  * Creates the text for the weekly top posts email given an Object of top posts.
//  */
// function createWeeklyTopPostsEmailHtml(topPosts) {
//   var emailHtml = '<h1>Here are this week\'s top posts:</h1>';
//   Object.keys(topPosts).forEach(function(postId) {
//     var post = topPosts[postId];
//     emailHtml += '<h2>' + escape(post.title) + '</h2><div>Author: ' +
//       escape(post.author) +
//       '</div><div>Stars: ' + escape(post.starCount) + '</div><p>' + escape(
//         post.body) + '</p>';
//   });
//   return emailHtml;
// }
//
// // Start the server.
// startListeners();
// startWeeklyTopPostEmailer();
