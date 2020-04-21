$(function(){
  function buildHTML(message){
    // 「もしメッセージに画像が含まれていたら」という条件式
    if (message.image) {
      //data-idが反映されるようにしている
      var html = //メッセージに画像が含まれる場合のHTMLを作る
       `<div class = "message" data-message-id=${message.id}>
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
      //同様にdata-idが反映されるようにしている
      var html = //メッセージに画像が含まれない場合のHTMLを作る
       `<div class = "message" data-message-id=${message.id}>
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
    })
    .fail(function(message){
      alert('メッセージ送信に失敗しました');
    })
  });

  var reloadMessages = function() {
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    var last_message_id = $('.message:last').data("message-id");
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'GET',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        //追加するHTMLの入れ物を作る
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        //メッセージが入ったHTMLに、入れ物ごと追加
        $('.main-messages').append(insertHTML);
        $('.main-messages').animate({ scrollTop: $('.main-messages')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  };
  //$(function(){});の閉じタグの直上(処理の最後)に以下のように追記
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    //$(function(){});の閉じタグの直上(処理の最後)に以下のように追記
    setInterval(reloadMessages, 7000);
  }
});