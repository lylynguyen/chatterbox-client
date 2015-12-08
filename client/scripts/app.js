// YOUR CODE HERE:
var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  init: function(){},
  addMessage: function (){
    var username = window.location.search.slice(10);
    var message = $('#newchats').val();
    app.send(message);
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
          $chat.html(currentChat.username+ " " + escapeText + " " + currentChat.roomname + " " + chatTime);
          $chat.appendTo($('#chats'));
        }
        console.log('chatterbox: Message get');
        console.log(data);
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
  }

};


//app.fetch();

$(document).ready(function(){

app.init();
app.fetch();
$('#submit-chat').on('click', app.addMessage)
$('#clear-chat').on('click', app.clearMessages)

})

