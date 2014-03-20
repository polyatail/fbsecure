function showMessages (str)
{
  console.log(str);
}

openpgp.init();

/*
$.get(chrome.extension.getURL("pub.key"),
function (x)
{
  $(document).data("pubkey", openpgp.read_publicKey(x));
});
*/

setInterval(function () {
  doc_url = $(document)[0].URL;
  stored_url = $(document).data("stored_url");

  console.log(doc_url + ", " + stored_url);

  // have we changed pages?
  if (doc_url != stored_url)
  {
    $(document).data("posts_examined", 0);
    $(document).data("stored_url", doc_url);
  } else {
    // find text content within posts
    var fbsPostText = $('div.mbs._5pbx.userContent');
  
    if (fbsPostText.length == 0)
    {
      var timeline = $('div._4_7u')[0];
      var fbsPostText = $('div.userContentWrapper', timeline);
    }
  
    // has new content been loaded?
    console.log($(document).data("posts_examined") + ", " + fbsPostText.length);
  
    if ($(document).data("posts_examined") < fbsPostText.length)
    {
      $('<link rel="stylesheet" type="text/css" href="'+chrome.extension.getURL("fbsecure.css")+'" >').appendTo("head");
  
      // search for PGP encrypted text
      for (i = $(document).data("posts_examined"); i < fbsPostText.length; i++)
      {
        $(document).data("posts_examined", fbsPostText.length);
    
        if (fbsPostText[i].innerText.substring(0, 27) == "-----BEGIN PGP MESSAGE-----")
        {
          exposed_root = $('div.text_exposed_root', fbsPostText[i]);
          exposed_show = $('span.text_exposed_show', fbsPostText[i]);
    
          exposed_root = exposed_root[0].innerText;
          exposed_root = exposed_root.replace("...\nSee More\n", "").replace("...See More", "");
    
          exposed_show = exposed_show[0].innerText;
          exposed_show = exposed_show.replace(/\n /g, "\n");
    
          pgpmsg = exposed_root + exposed_show;
    
          console.log(i + ":" + pgpmsg);
          decodedMessage = openpgp.read_message(pgpmsg);
    
          var totalMessage = "";
     
          if (decodedMessage)
          { 
            for (j = 0; j < decodedMessage.length; j++)
            {
              totalMessage += decodedMessage[j].text;
            }
    
            $(fbsPostText[i]).html("<div class='for_whose_eyes'><b>Visible Only To You</b></div>" + totalMessage);
          }
        }
      }
    }
  }
}, 1000);
