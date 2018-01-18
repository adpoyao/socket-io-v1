'use strict';

//Add to script
// "start": "concurrently 'npm run react' 'npm run server'",
// "react": "react-scripts start",
// "server": "nodemon src/server/index.js",

const io = require('./index.js').io;
const { VERIFY_USER, USER_CONNECTED, LOGOUT } = require('../Events');
const { createUser, createMessage, createChat } = require('../Factories');

let connectedUsers = {};

module.exports = function(socket){
  console.log('Socket Id: ' + socket.id);
  
  //Verify Username
  socket.on(VERIFY_USER, (nickname, callback) => {
    if(isUser(connectedUsers, nickname)){
      callback({ isUser:true, user: null });
    } else {
      callback({isUser: false, user: createUser({name:nickname})});
    }
  });

  //User Connects with username
  socket.on(USER_CONNECTED, (user) => {
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;
    
    io.emit(USER_CONNECTED, connectedUsers);
    console.log(connectedUsers);
  });

  //User disconnects

  //User logouts
};

/*
* Adds user to list passed in.
* @param userList {Object} Object with key value pairs of users
* @param user {User} the user to added to the list.
* @return userList {Object} Object with key value pairs of Users
*/
function addUser(userList, user) {
  let newList = Object.assign({}, userList);
  newList[user.name] = user;
  return newList;
}

/*
* Removes user from the list passed in.
* @param userList {Objecgt} Object with key value pairs of Users
* @param username {string} name of user to be removed
* @return userList {Object} Object with key vlaue pairs of Users
*/
function removeuser(userList, username) {
  let newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
}

/*
*Checks if the user is in list passed in.callback
* @param userList {Object} Object with key value pairs of Users
* @param usrname {String}
* @return userList {Object} Object with key value pairs of Users
*/
function isUser(userList, username){
  return username in userList;
}