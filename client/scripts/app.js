
  // YOUR CODE HERE:


var app = {
  server: 'https://api.parse.com/1/classes/chatterbox',
  chatRooms: {},
  dataChat: [],
  friends: {},

  init: function(){
    app.fetch();
  },
  addMessage: function (message){
   
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
      console.log(messageObj)
      app.send(messageObj);
      var $chat = $('<div></div>');
      //attaching message to the dom
      $chat.html('<a href class="username">'+ messageObj.username + '</a>'+ " " + messageObj.text + " " + messageObj.roomname /*+ " " + messageTime*/ )
      //appending to id with chats
      $chat.appendTo($('#chats'));
    //}
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

  filterByRoom: function(room){
    // dataChat = data.results;
    var $chat = $('#chats');
    $chat.html('');
    for(var i = 0; i < dataChat.length; i++){
      //getting the chat div
      var $chat = $('<div></div>');
      //accesss current chat index i
      var currentChat = dataChat[i];
      //track time of message 
      var chatTime = moment(currentChat.createdAt).format('MMM Do YYYY, h:mm:ss a');
      //remove special characters
      var escapeText = _.escape(currentChat.text);
      var currentRoom = currentChat.roomname;
      


      if(!app.chatRooms[currentRoom] && currentRoom !== undefined && currentRoom !== null){
        app.chatRooms[currentRoom] = currentRoom; 
      }
      if(room === 'allrooms'){
          var $innerSpan = $('<span></span>');
          if(currentChat.username !== undefined){
            currentChat.username = currentChat.username.replace(/%20| /g, ' ');            
          }
          $innerSpan.text(_.escape(currentChat.username));
          $innerSpan.attr('class', 'username');
          var $outerDiv = $('<div></div>');
          $outerDiv.text(escapeText + " " + _.escape(currentChat.roomname) + " " + chatTime);
          $innerSpan.prependTo($outerDiv);
          $chat.html('<span class="username">'+_.escape(currentChat.username) + '</span>' + " " + escapeText + " " + _.escape(currentChat.roomname) + " " + chatTime);
        //attach to the chats tag
        //$chat.attr('value', roomname);
        $outerDiv.appendTo($('#chats'));
      } else {
        if(currentRoom === room){
          $chat.html('<span class="username">'+currentChat.username + '</span>' + " " + escapeText + " " + currentChat.roomname + " " + chatTime);
          //attach to the chats tag
          $chat.Pre($('#chats'));
        } 
      }
    }//return html content for messsage
  },

  filterByFriends: function(friend){
        // dataChat = data.results;
    var $chat = $('#chats');
    $chat.html('');
    for(var i = 0; i < dataChat.length; i++){
      //getting the chat div
      var $chat = $('<div></div>');
      //accesss current chat index i
      var currentChat = dataChat[i];
      //track time of message 
      var chatTime = moment(currentChat.createdAt).format('MMM Do YYYY, h:mm:ss a');
      //remove special characters
      var escapeText = _.escape(currentChat.text);
      var currentRoom = currentChat.roomname;
      


      if(!app.chatRooms[currentRoom] && currentRoom !== undefined && currentRoom !== null){
        app.chatRooms[currentRoom] = currentRoom; 
      }
      if(friend === dataChat[i].username){
          var $innerSpan = $('<span></span>');
          if(currentChat.username !== undefined){
            currentChat.username = currentChat.username.replace(/%20| /g, ' ');            
          }
          $innerSpan.text(_.escape(currentChat.username));
          $innerSpan.attr('class', 'username');
          var $outerDiv = $('<div></div>');
          $outerDiv.text(escapeText + " " + _.escape(currentChat.roomname) + " " + chatTime);
          $innerSpan.prependTo($outerDiv);
          $chat.html('<span class="username">'+_.escape(currentChat.username) + '</span>' + " " + escapeText + " " + _.escape(currentChat.roomname) + " " + chatTime);
 
        $outerDiv.appendTo($('#chats'));
  
      }
    }
  },

  fetch: function(roomname){
    // var $rooms = $('#rooms');
    // $rooms.html('');
    var roomname = roomname || 'allrooms';
    $.ajax({
    //  This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      //data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        //storinf results into a new array to create friends list
        dataChat = data.results;
        app.filterByRoom(roomname);
        console.log('chatterbox: Message get');
        console.log(data);

        //build drop down list for rooms
        var $roomDropDown = $('#roomSelect');
        $roomDropDown.html('');
        if(roomname === 'allrooms'){
          var $option = $('<option value="allrooms">allrooms</option>'); 
          $option.appendTo($roomDropDown)
        } else {
          //roomname = roomname.split(' ').join('&nbsp');
          console.log(roomname);
          var $option = $('<option value=>'+roomname+'</option>')
          $option.attr('value', roomname); //sets the the value to the roomname
          $option.appendTo($roomDropDown)
        }
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

  addFriend: function(friend) {
    // console.log("add Freind")
    //function will building a list of friends
    if(!app.friends[friend]){
      app.friends[friend] = friend;
    }
    var $friends = $('#friends-div');
    $friends.html('');
    for(var key in app.friends){
     var $currentFriend = $('<div></div>');
     $currentFriend.html(app.friends[key]);
     console.log($currentFriend);
     $currentFriend.attr('class', 'my-friend');
     $currentFriend.appendTo($friends);
    }
  },

  handleSubmit: function () {
    app.addMessage();
  }, 

  refresh: function (argument) {
    console.log("refreshed!")
    var $selectedRoom = $('#roomSelect').val();
    app.fetch($selectedRoom);

  }

  

};


$(document).ready(function(){
  app.init();

  $(document).on('click', '.username', function() {app.addFriend($(this).text())})//app.addFriend);
  $('#submit-chat').on('click', app.addMessage);

  $('#clear-chat').on('click', app.clearMessages)
  
  $('#roomSelect').on('change', function(){
    //will give us the value of the dropdown menu
    if($(this).val() === "add-new-room") {
      $('#room-input').show();
    } else {
      $('#room-input').hide();
      //filterby room will be call if roomname is selected
      app.filterByRoom($(this).val());
    }
  });
  $('#refresh').on('click', function(event){
    event.stopPropagation();
    app.refresh();
  });
  $(document).on('click', '.my-friend', function() {app.filterByFriends($(this).text())});
});




