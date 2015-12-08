// YOUR CODE HERE:
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  chatRooms: {},
  init: function(){
    //app.fetch();
  },
  addMessage: function (message){
    
    //if message is provided
    if(message){
      //send message
      app.send(message);
      //select the div
      var $chat = $('<div></div>');
      //attaching message to the dom
      $chat.html('<a href class="username">'+ message.username + '</a>'+ " " + message.text + " " + message.roomname /*+ " " + messageTime*/ )
      //appending to id with chats
      $chat.appendTo($('#chats'));
    } else{
      var username = window.location.search.slice(10);
      var message = $('#newchat').val();
      var room = $('#roomSelect').val(); //room dropdown
      var newRoom = $('#new-room-text').val();
      //creating message base on the inouts we get from users
      var messageObj = {
        username: username,
        text: message,
        roomname: room
      }
      //check for when user doesn't input a roomname
      if(room === "add-new-room") {
        if(newRoom === '') {
          return;
        }
        messageObj.roomname = newRoom;
      }
      var $chat = $('<div></div>');
      //attaching message to the dom
      $chat.html('<a href class="username">'+ messageObj.username + '</a>'+ " " + messageObj.text + " " + messageObj.roomname /*+ " " + messageTime*/ )
      //appending to id with chats
      $chat.appendTo($('#chats'));
    }
  },
  //function to send message
  send: function(message){ 
    
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(){
    
    $.ajax({
    //  This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      //data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        for(var i = 0; i < data.results.length; i++){
          var $chat = $('<div></div>');
          var currentChat = data.results[i];
          var chatTime = moment(currentChat.createdAt).format('MMM Do YYYY, h:mm:ss a');
          var escapeText = _.escape(currentChat.text);
          var currentRoom = currentChat.roomname;
          if(!app.chatRooms[currentRoom] && currentRoom !== undefined && currentRoom !== null){
            app.chatRooms[currentRoom] = currentRoom; 
          }
          $chat.html('<a href class="username">'+currentChat.username + '</a>' + " " + escapeText + " " + currentChat.roomname + " " + chatTime);
          $chat.appendTo($('#chats'));
        }
        console.log('chatterbox: Message get');
        console.log(data);

        //build drop down list for rooms
        var $roomDropDown = $('#roomSelect');
        for(var key in app.chatRooms) {
          var $option = $('<option></option>');
          $option.html(app.chatRooms[key]);
          $option.appendTo($roomDropDown)
        }
        var $option = $('<option value="add-new-room">Add new room</option>');
        $option.appendTo($roomDropDown)

      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message');
      }
    });
  },

  clearMessages: function(){
    var $chat = $('#chats');
    $chat.html('');
  },

  addRoom: function(newRoom){
  
    var $roomDropDown = $('#roomSelect');
    var $option = $('<option></option>');
    $option.html(newRoom);
    $option.appendTo($roomDropDown)
  },

  addFriend: function() {
    console.log("add Freind")
  },

  handleSubmit: function () {
    app.addMessage()
  }

};





$(document).ready(function(){
app.init();
app.addFriend();


$('.username').on('click', app.addFriend);
//$('.submit').on('click', app.addMessage);
$('.submit').on('click', app.addMessage);
// $('.submit').submit(app.addMessage);

//$('#submit-chat').on('click', app.addMessage)
$('#clear-chat').on('click', app.clearMessages)
$('#roomSelect').on('change', function(){
  if($(this).val() === "add-new-room") {
    $('#room-input').show();
  } else {
    $('#room-input').hide();
  }
})
setInterval(app.fetch, 1000);

})


