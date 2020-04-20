$(function(){

  function buildHTML(message){
    // 「もしメッセージに画像が含まれていたら」という条件式
    if (message.image) {
      var html = //メッセージに画像が含まれる場合のHTMLを作る
       `<div class = "message">
          <div class = "message__info">
            <div class = "message__info__talker">
              ${message.user_name}
            </div>
            <div class = "message__info__date">
              ${message.created_at}
            </div>
          </div>
          <div class = "message__text">
            <p class = "message__text__content">
              ${message.content}
            </p>
          </div>
          <img src = ${message.image}>
        </div>`
      return html;
    } else {
      var html = //メッセージに画像が含まれない場合のHTMLを作る
       `<div class = "message">
          <div class = "message__info">
            <div class = "message__info__talker">
              ${message.user_name}
            </div>
            <div class = "message__info__date">
              ${message.created_at}
            </div>
          </div>
          <div class = "message__text">
            <p class = "message__text__content">
              ${message.content}
            </p>
          </div>
        </div>`
      return html;
    };
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.main-messages').append(html);
      $('form')[0].reset();
      $('.main-messages').animate({scrollTop: $('.main-messages')[0].scrollHeight});
      $('.submit-btn').prop('disabled', false);
      // $('new-message__text').val('');
      // $('new-messages__submit-btn').prop('disabled', false);
    })
    .fail(function(message){
      alert('メッセージ送信に失敗しました');
    })
  });
});