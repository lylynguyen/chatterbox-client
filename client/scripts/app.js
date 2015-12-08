// YOUR CODE HERE:
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  chatRooms: {},
  init: function(){
    app.fetch();

  },
  addMessage: function (){
    var username = window.location.search.slice(10);
    var message = $('#newchat').val();
    var room = $('#roomSelect').val();
    var messageObj = {
      username: username,
      text: message,
      roomname: room
    }
    console.log(messageObj);
    app.send(messageObj);
    $('#newchats').val('');
  },
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
    // return "test";
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
          $chat.html(currentChat.username+ " " + escapeText + " " + currentChat.roomname + " " + chatTime);
          $chat.appendTo($('#chats'));
        }
        console.log('chatterbox: Message get');
        console.log(data);
        var $roomDropDown = $('#roomSelect');
    
        for(var key in app.chatRooms) {
          var $option = $('<option></option>');
          $option.html(app.chatRooms[key]);
          $option.appendTo($roomDropDown)
          //console.log(key);
        }

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
    var roomname = $('#room').val();
    app.send(roomname);
    $('#newchats').val('');
  }

};


//app.fetch();

$(document).ready(function(){

app.init();
//app.fetch();
$('#submit-chat').on('click', app.addMessage)
$('#clear-chat').on('click', app.clearMessages)

})

