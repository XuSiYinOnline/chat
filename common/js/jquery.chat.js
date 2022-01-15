/*
 * 涂鸦聊天
 * Copyright(C)2022 XuSiYin Allright reserved.
 * https://www.xusiyin.com
 * MIT License
 */


/*
 * Loading
 */
jQuery.event.add(window,"load",function() { 
    jQuery("#fade").css("height", '100%').delay(900).fadeOut(800);
    jQuery("#loader").delay(600).fadeOut(300);
    jQuery("#container").css("display", "block");
});


(function($){
  $.fn.jqueryChat = function(options) {
    var opt = $.extend( {
        'reload'     : 10000,
        'readlog'    : true,
        'delcookie'  : false,
        'log_login'  : true,
        'log_logof'  : true,
        'bt_name'    : '输入你的名字',
        'bt_chat'    : '发送',
        'mes_logout' : '确认退出?',
        'err_name'   : '请写下你的名字!',
        'err_upload' : '上传失败!',
        'err_write'  : '写下你想说的,开始我们的对话!',
        'err_wnig'   : '发生未知错误!',
        'login'      : '  欢迎您的到来!',
        'logout'     : '  好像离开了!',
        'cmdmes'     : '错误命令!',
        'flaggmap'   : false,
        'gmap'       : '发送信息内容时你的地理位置信息可能会被对方知道!',
        'background' : '#FFE1A3',
        'fontcolor'  : '#000000',
        'headerbg'   : '#393939'
    }, options);
    
    
    
/*****************************************************
 * 插入HTML
 *****************************************************/

  /* 涂鸦菜单
   *------------------------------------*/
      var html  = '';
          html += '<div id="loader"><img src="common/images/loader.gif" /></div><div id="fade"></div>'; 
          html += '<div id="oekaki">';
          html += '  <div id="draw">';
          html += '    <ul>';
          html += '      <li class="save"><a href="#"><img src="common/images/save.png" title="发送" /></a></li>';
          html += '      <li class="brush cbg" id="brush1"><a href="#"><img id="15" src="common/images/pen_big.png" title="粗线" /></a></li>';
          html += '      <li class="brush cbg" id="brush2"><a href="#"><img id="7" src="common/images/pen_mid.png" title="中线" /></a></li>';
          html += '      <li class="brush cbg" id="brush3"><a href="#"><img id="3" src="common/images/pen_small.png" title="细线" /></a></li>';
          html += '      <li class="setColor"><a href="#"><img src="common/images/color.png" title="颜色" /></a></li>';
          html += '      <li class="eraser cbg" id="gom"><a href="#"><img src="common/images/kesu.png" title="橡皮擦" /></a></li>';
          html += '      <li class="clear"><a href="#"><img src="common/images/batu.png" title="全部擦除" /></a></li>';
          html += '    </ul>';
          html += '  </div>';
          html += '  <div id="canvasContainer"><div id="ColorPalet"></div><canvas id="Canvas"></canvas></div>';
          html += '</div>';
          $(this).after(html);
          
      var html  = '';
          html += '   <div id="lg_right">';
          html += '     <a id="hig" href="javascript:void(0);" onclick="hig();" ondblclick="stopCrazy();"> <img src="common/images/music.png" /></a>';
          html += '     <a href="#" id="drawpalet"><img src="common/images/graffiti.png" /></a>';
          html += '     <a href="#" id="map"><img src="common/images/map.png" /></a>';
          html += '     <a href="#" id="stump"><img src="common/images/smile.png" /></a> ';
          html += '     <a href="#" id="custom"><img src="common/images/color.png" /></a>';
          html += '     <a href="#" id="setup"><img src="common/images/log.png" /></a>';
          html += '     <a href="#" id="logof"><img src="common/images/exit.png" /></a>';
          html += '    </div>';
          html += '  </div>';
          
          $("#logo").append(html);
          

  /* 日志设置扩展
   *------------------------------------*/
      var html  = '';
          html += '  <div id="sys_setting" class="pc">';
          html += '    <div id="sys_row">';
          html += '      <div id="sys_th">聊天日志</div>';
          html += '      <div id="sys_td">';
          html += '        <select id="log_len">';
          html += '          <option value="10">10</option>';
          html += '          <option value="50">50</option>';
          html += '          <option value="100">100</option>';
          html += '          <option value="150">150</option>';
          html += '          <option value="200">200</option>';
          html += '          <option value="250">250</option>';
          html += '          <option value="300">300</option>';
          html += '          <option value="350">350</option>';
          html += '          <option value="400">400</option>';
          html += '        </select>';
          html += '      </div>';
          html += '    </div>';
          html += '  </div>';
          $(this).after(html);


  /* 调色板
   *------------------------------------*/
     // var color = opt.color.split(",");
      var html  = '';
          html += '<div id="setting" class="pc">';
          
          html += '<ul>';
          for(var i=0; i<webcolor.length; i++){
            html += '<li style="background:'+webcolor[i]+'" class="n" title="'+webcolor[i]+'">&nbsp;</li>';
          }
          html += '</ul>';
          html += '</div>';
          $(this).after(html);
          
  /* 表情
   *------------------------------------*/
          $(this).after('<div id="stump_wrap" class="pc"></div>'); 
          
  /* 消息
   *------------------------------------*/
          $(this).after('<div id="message" class="pc"></div>');

  /* 照相机
   *------------------------------------*/
      var html = '';
          html +='<div id="camera" class="pc">';
          html +='  <div id="per"></div>';
          html +='  <div class="pbar" id="pbar" style="background: red"></div>';
          html +='  <form id="upform" name="upform">';
          html +='    <input type="file" name="files_field" id="files_field">';
          html +='    <input id="fupload" type="button" value="开始上传" ';
          html +='  </form>';
          html +='</div>';
          $(this).after(html);

  /* 日志移动位置
   *------------------------------------*/
          $(this).after('<div id="end"></div>');

  /* 发送
   *------------------------------------*/
      var html  = '';
          html += '<div id="chat" class="pc">';
          html += '  <form id="form" name="form">';
          html += '    <input name="c" id="c"  type="hidden" value="">';
          html += '    <input name="l" id="l"  type="hidden" value="">';
          html += '    <input name="var" type="text" id="var" maxlength="8">';
          html += '    <a href="#" id="button"></a>';

          html += '    <div id="camera_icon"><img src="common/images/camera.png" width="35" height="35" /></div>';
          
          html += '  </form>';
          html += '</div>';
          $(this).after(html);
          
  /* 加载戳记
   *------------------------------------*/
    $("#stump_wrap").html('');
          $.ajax({ type: "POST",url: "common/php/chat.php",data: "mode=stump",
              success: function(xml){
                $(xml).find("item").each(function(){
                  var stp = $(this).find("stp").text();
                  $('#stump_wrap').append('<img src="smile/thumbnail/'+stp+'" id="'+stp+'" class="stmp" />');
                });
              }
          });
          
    
    
    

/*
 * 主题名称
 * 聊天ID
 */
    var jquery_chat_name   = 'jquery_chat_name'+opt.room_id;
    var jquery_chat_unique = 'jquery_chat_unique'+opt.room_id;
    
  /*
   * 绘画设置
   */
    Oekaki(opt.room_id,jquery_chat_name);
    
    
/*****************************************************
 * 更改背景颜色或文字颜色
 *****************************************************/
     $("body").css({'background-color':opt.background , 'color':opt.fontcolor});
     $("#logo").css({'background-color':opt.headerbg});


/*****************************************************
 * 初次加载时确认数据库连接
 *****************************************************/
    $.ajax({ type: "POST",url: "common/php/chat.php",data: "mode=db_check&room="+opt.room_id,
        success: function(xml){
          var error = $(xml).find("error").text();
          if(error){
            $("#log").html('<span style="color:red;font-size:90%">数据库连接错误!<br />'+error+'</span>');
          }
        }
    });

  
/*****************************************************
 * 设置中更改显示/隐藏
 *****************************************************/
  /* 地理位置功能
   *------------------------------------*/
    if(opt.flaggmap == true){
			if (!navigator.geolocation) {
				$("#map").hide();
			}
    }else{
      $("#map").hide();
    }
  /* 第一次日志显示
   *------------------------------------*/
    if( opt.readlog === true ){
      readLog(false,'');
    }
  /* 第一次取消cookie?
   *------------------------------------*/
    if( opt.delcookie === true ){
      $.removeCookie(jquery_chat_name);
      $.removeCookie(jquery_chat_unique);
    }
    
    
/*****************************************************
 * HTML插入完
 * 根据窗口大小调整宽度
 *****************************************************/
      width_change($(window).width());
      $(window).resize(function(){
        width_change($(window).width());
      });

  /* 将画面移动到底部
   * 加载时稍微延迟，缓慢移动
   *------------------------------------*/
      setTimeout(function(){
           var pos = $("#end").offset().top; 
           $("html, body").animate({ 
              scrollTop:pos 
           }, 1000, "swing");
      },3000);


  /* COOKIE是否有名字
   *------------------------------------*/
      var name = $.cookie(jquery_chat_name);
      if(!name){
        $("#form a").text(opt.bt_name);
      }else{
        $("#form a").text(opt.bt_chat);
        $("#var").attr("maxlength","500");
      }
      
      
/*****************************************************
 * 更改按钮日志
 * @len_change_button -> 修改显示数量（浏览过去的日志）
 *****************************************************/
      $(document).on('change','#log_len',function(e){
        var len = $("#log_len").val();
        
        $("#log").data("slide",'off'); //关闭幻灯片功能
        readLog('',len); //通过修改全部日志来显示指定件数，并在下一段中追加，但下一段不滑动，下一次发言中幻灯片打开
        
        $("#sys_setting").hide();
        $("#header").hide();
        e.preventDefault();
      });
      
      

/*****************************************************
 * 退出
 *****************************************************/
      $(document).on('click','#logof',function(e){
        if($.cookie(jquery_chat_name)){
          var logof = confirm(opt.mes_logout);
          if(logof == true){
            logWrite(null,true);
          }
        }
        e.preventDefault();
      });
      
      
      
/*****************************************************
 * 地理位置
 *****************************************************/

  /* 点击获取当前位置
   *------------------------------------*/
      $(document).on('click','#map img',function(e){
        if($.cookie(jquery_chat_name)){
          var conf = confirm(opt.gmap);
          if(conf == true){
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
          }
        }
        e.preventDefault();
      });
      

  /* [日志记录处理]Geolocation API
   *------------------------------------*/
        function successCallback(position) {
          var lon = position.coords.latitude;
          var lat = position.coords.longitude;
          
          if(lon && lat){
            var val = lon+','+lat;
              $.ajax({ type: "POST",url: "common/php/chat.php",data: "mode=gmap&room="+opt.room_id+"&val="+val,
                  success: function(xml){
                    readLog(true,'');
                    cs_top();
                  }
              });
          }
          
        }
        function errorCallback(error) {
          switch(error.code) {
            case 1:
              $("#message").slideDown(200).text('不允许获取位置信息');
              break;
            case 2:
              $("#message").slideDown(200).text('获取位置信息失败');
              break;
            case 3:
              $("#message").slideDown(200).text('获取位置信息超时');
              break;
          }
        }

/*****************************************************
 * 设置开关 
 *****************************************************/
      $("#system").click(function (e) {
        $("#stump_wrap").slideUp();
        $("#setting").slideUp();
        $("#sys_setting").hide();
        $("#oekaki").hide();
        
        if($.cookie(jquery_chat_name)){
          $("#header").slideToggle();
        }
        e.preventDefault();
      });
      
      
/*****************************************************
 * 设置样式
 *****************************************************/
      $("#setup").click(function (e) {
        $("#stump_wrap").slideUp();
        $("#setting").slideUp();
        $("#oekaki").hide();
        
        if($.cookie(jquery_chat_name)){
          $("#sys_setting").slideToggle();
        }
        
        e.preventDefault();
      });

/*****************************************************
 * 颜色自定义
 *****************************************************/
      $("#custom").click(function (e) {
        $("#stump_wrap").hide();
        $("#sys_setting").hide();
        $("#oekaki").hide();
        
        if($.cookie(jquery_chat_name)){
          $("#setting").slideToggle();
        }
        e.preventDefault();
      });

      $(document).on('click','.n',function(e){
        $("#c").val( $(this).attr('title') );
        $("#setting").slideUp();
        $("#header").slideUp();
        e.preventDefault();
      });



/*****************************************************
 * 贴图框
 *****************************************************/
      $("#stump").click(function (e) {
        $("#setting").hide();
        $("#sys_setting").hide();
        $("#oekaki").hide();
        if($.cookie(jquery_chat_name)){
          $("#stump_wrap").slideToggle();
        }
        e.preventDefault();
      });

  /* [日志记录处理]发送戳记
   *------------------------------------*/
      $(document).on('click','.stmp',function(e){
        var img = $(this).attr("id");
        $("#stump_wrap").slideUp();
        $("#header").slideUp();
        
          $.ajax({ type: "POST",url: "common/php/chat.php",data: "mode=gostump&room="+opt.room_id+"&stump="+img,
              success: function(xml){
                var limit = $(xml).find("limit").text();
                if(!limit){
                  readLog(true,'');
                  cs_top();
                }else{
                  $("#message").slideDown(200).text(limit);
                }
              }
          });
          
      });


/*****************************************************
 * 照相机
 * 未进入情况下锁定
 *****************************************************/
      $("#camera_icon img").click(function (e) {
        $("#message").hide();
        if($.cookie(jquery_chat_name)){
          $("#camera").slideToggle();
          e.preventDefault();
        }
      });

/*****************************************************
 * 没有写信息部分点击删除
 *****************************************************/

      $(document).on('click','#message',function(e){
        $(this).slideUp();
      });


/*****************************************************
 * 发送数据传输失败
 *****************************************************/
      $(document).on('click','#button',function(e){
        clearTimeout(timer_id);
        $("#message").hide();
        var val = $("#var").val();
            val = $.trim(val); //不能发空消息
            val = sanitize( val ); //发送的值

  /* 进入时
   *------------------------------------*/
        if($(this).text() === opt.bt_name){

          if( val ){
            $.cookie(jquery_chat_name, val, { expires: 7 }); //cookie中记录名字
            $("#var").val(''); //input空值
            $("#form a").text(opt.bt_chat); //更改按钮
            $("#var").attr("maxlength","500"); //最大长度
            if(opt.log_login === true) logWrite(val,null);
          }else{
            $("#var").val('');
            $("#message").slideDown(200).text(opt.err_name);//空时出错
          }

        }
  /* 聊天传输失败
   *------------------------------------*/
        else{
          if( val ){
            if( $.cookie(jquery_chat_name) ){
              logWrite(null,null);
            }else{
              $("#message").slideDown(200).text(opt.err_wnig); //进入房间将日志设为空的情况等
              setTimeout(function(){
                location.href=location.href;
              },3000);
            }

          }else{
            $("#var").val('');
            $("#message").slideDown(200).text(opt.err_write);//空时出错
          }
        }
        e.preventDefault();
      });





/*****************************************************
 * 写入日志
 *****************************************************/
    function logWrite(name,logout){
      
      

    /* [消息日志记录]
     * 发送名字时，请输入信息
     *------------------------------------*/
      if(name){

       //COOKIE记录客人信息
          var unique = Math.round( Math.random()*10000 )+'_'+$.now();
          $.cookie(jquery_chat_unique, unique, { expires: 7 });

          $.ajax({ type: "POST",url: "common/php/chat.php",data: "mode=login&room="+opt.room_id+"&mes="+opt.login+"&str="+name,
              success: function(xml){
                readLog(true,'');
              }
          });

      }

    /* [日志记录处理]
     * 退出注销
     *------------------------------------*/
      else if(logout){
        if(opt.log_logof === true) {
          $.ajax({ type: "POST",url: "common/php/chat.php",data: "mode=logout&room="+opt.room_id+"&name="+$.cookie(jquery_chat_name)+"&mes="+opt.logout,
              success: function(xml){
                readLog(true,'');
                cs_top();
                $.removeCookie(jquery_chat_name);
                $.removeCookie(jquery_chat_unique);
                location.href=location.href;
              }
          });
        }else{
            $.removeCookie(jquery_chat_name);
            $.removeCookie(jquery_chat_unique);
            location.href=location.href;
        }
      }

    /* 
     * 聊天
     *------------------------------------*/
      else{
          var val    = $("#var").val();
          $("#log").data("slide",'on'); //发言后打开幻灯片

       //命令处理
       //=========================================
            
            if(val === '属性'){
              var str  = '<li class="li3" id="setumei">';
               //   str += '[设置]<br />随机修改背景颜色<br />';
                  str += '[抽签]<br />可以抽签<br />';
                  str += '[健康]<br />占卜健康运<br />';
                  str += '[恋爱]<br />占卜恋爱运<br />';
                  str += '</li>';
                  $('#log ul').append( str );
                  cs_top();
                  $("#var").val('');
                  return ;
            }
            var kuzi = '';
            if(val === '抽签' || val === '健康' || val === '恋爱'){
              kuzi = val;
            }
              
        
          $.ajax({ type: "POST",url: "common/php/chat.php",data: "mode=send&room="+opt.room_id+"&str="+val+'&c='+$("#c").val()+'&l='+$("#l").val()+"&kuzi="+kuzi,
              success: function(xml){
                var limit = $(xml).find("limit").text();
                if(!limit){
                  readLog(true,'');
                  cs_top();
                }else{
                  $("#message").slideDown(200).text(limit);
                }
                
              }
          });
          $("#var").val(''); //input空值
      }
    }



/*****************************************************
 *日志排列
 *****************************************************/
    function logRow(xml){
       var cls  = $(xml).find("cls").text();
       var name = $(xml).find("name").text();
       var log  = $(xml).find("log").text();
       var date = $(xml).find("date").text();
       var col1 = $(xml).find("col1").text();
       var col2 = $(xml).find("col2").text();
       var img  = $(xml).find("img").text();
       var hash = $(xml).find("hash").text();
       
       col1 = col1.replace("#", ""); //变更删除 
       
       log = sanitize( log ); 
       
       log = getLink(log);
       var dstyle = '';
         if(cls === 'li3'){
           return html = '<li class="li3" id="'+hash+'">'+name+':'+log+'</li>';
         }
         else if(cls === 'li4'){
           return html = '<li class="li4" id="'+hash+'">'+log+'</li>';
         }
         else{
           
             if(cls == 'li1'){

             }else{
               dstyle = ' style="text-align:right"';
             }
           
           if(img === 'IMG'){
             var log = '<a href="upload/o_'+log+'" target="_blank"><img src="upload/t_'+log+'" /></a>';
             return html = '<li class="'+cls+'" id="'+hash+'"><p class="name" style="color:'+col1+'">'+name+'</p><p class="log">'+log+'<span'+dstyle+'>'+date+'</span></p></li>';
           }
           else if(img === 'DRAW'){
             var log = '<span class="draw_image"><img src="upload/'+log+'" /></span>';
             return html = '<li class="'+cls+'" id="'+hash+'"><p class="name" style="color:'+col1+'">'+name+'</p><p class="log" style="background:none">'+log+'<span'+dstyle+'>'+date+'</span></p></li>';
           }
           
           else if(img === 'STUMP'){
             var log = '<img src="smile/img/'+log+'" />';
             
             if(cls == 'li1'){
               cls = 'li5';
             }else{
               cls = 'li6';
               
             }
             return html = '<li class="'+cls+'" id="'+hash+'"><p class="name" style="color:'+col1+'">'+name+'</p><p class="log">'+log+'<span'+dstyle+'>'+date+'</span></p></li>';
           }
           else if(img === 'GMAP'){
             var log = '<a href="https://map.baidu.com/@'+log+'" target="_blank">地理位置</a>';
             return html = '<li class="'+cls+'" id="'+hash+'"><p class="name" style="color:'+col1+'">'+name+'</p><p class="log">'+log+'<span'+dstyle+'>'+date+'</span></p></li>';
           }
           else{
             return html = '<li class="'+cls+'" id="'+hash+'"><p class="name" style="color:'+col1+'">'+name+'</p><p class="log">'+log+'<span'+dstyle+'>'+date+'</span></p></li>';
           }
         }
    }


/*****************************************************
 * 日志重写和添加
 *****************************************************/
    function readLog(append,len){
      if(!len) len = '';

      if(append == true){
        append = 1;
      }else{
        append = '';
      }
      
    /* 
     * 全部日志修改的情况下全部删除
     *------------------------------------*/
      if(append == ''){
        $('#log ul li').remove();
      }
      
      
      
      var lasthash = $("#log").data('lasthash'); //最后看到的ID

      $.ajax({ type: "POST",async:false,url: "common/php/chat.php",data: "mode=readLog&room="+opt.room_id+"&append="+append+"&lasthash="+lasthash+"&len="+len,
          success: function(xml){
            if( $(xml).find("item").length > 0 ){
               $(xml).find("item").each(function(){ 
                 $('#log ul').append( logRow($(this)) );
               });
            }
             

           //未进入情况下,不重载日志.
             if( $.cookie(jquery_chat_name) ) {
                 log_reload();
             }
          }
          
      });
      
      
    /* 
     *获得最后ID
     *获取该ID日志
     *只添加最新日志
     *------------------------------------*/
      var id=null;
      $("#log li").each(function(){
        id= $(this).attr("id");
      });
      $("#log").data('lasthash',id);
      
      
    }


/*****************************************************
 * 日志重载
 *****************************************************/
    var timer_id;
    function log_reload(){
      clearTimeout(timer_id); //setTimeout初始化
      var slide = $("#log").data("slide");

    /* 
     * 最新消息
     *------------------------------------*/
      $.ajax({ type: "POST",async:false,url: "common/php/chat.php",data: "mode=reload&room="+opt.room_id,
          success: function(xml){
            var flag  = $(xml).find("flag").text()|0;
            if(flag === 1) {
              readLog(true,'');
              if(slide === 'on') cs_top();
            }
          }
      });
      
    /* 
     * 在指定时间重复处理
     *------------------------------------*/
      timer_id = setTimeout(function(){
        log_reload();
      },opt.reload);

    }


/*****************************************************
 * 回车键控制
 * 只在发送信息时写入
 *****************************************************/
      $("#form").keypress(function(ev) {
        if ((ev.which && ev.which === 13) || (ev.keyCode && ev.keyCode === 13)) {
          $("#message").hide();
          if($.cookie(jquery_chat_name)) logWrite(null,null); 
          return false;
        }
      });



/*****************************************************
 * 链接式文字
 * 邮件地址用颜文字等可能会出现问题，请通过
 *****************************************************/
    function getLink(s){
      if(!s){
        return '';
      }
      var re_url = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
      //var re_mail = /((?:\w+\.?)*\w+@(?:\w+\.)+\w+)/gi;
      s = s.replace( re_url, '<a href="$1" target="_blank">$1</a>' );
      //s = s.replace( re_mail, '<a href="mailto:$1">$1</a>');
      return s;
    }


/*****************************************************
 * 电脑的话，框的宽度要350px
 *****************************************************/
    function width_change(w){
      var camera = $("#container").width()-45;
      $("#form a").css({"width":camera+'px'});

      if(w > 959){
        $(".pc").css({"width":'350px'});
      }else{
        $(".pc").css({"width":'100%'});
      }
    }


/*****************************************************
 * 向下滑动
 *****************************************************/
    function cs_top(){
         var pos = $("#end").offset().top; 
         $("html, body").animate({ 
            scrollTop:pos 
         }, 0, "swing");
    }
    
    

/*****************************************************
 *上传文件
 *****************************************************/
      $(document).on('click','#fupload',function(e){
        start_upload();
      });
      var start_upload = function(){
          var FormId = $("#upform");  
          var fd     = new FormData(FormId[0]);

          jQuery.ajax({
              async: true,
              xhr : function(){
                  var XHR = $.ajaxSettings.xhr();
                  if(XHR.upload){
                      XHR.upload.addEventListener('progress',function(e){
                          progre = parseInt(e.loaded/e.total*10000)/100 ;
                          $("#pbar").width(parseInt(progre/100*300*100)/100+"px");
                          $("#pbar").height("5px");
                          $("#per").html(progre+"%");
                      }, false); 
                  }
                  return XHR;
              },
              url:  "common/php/upload.php",
              type: "post",
              data:fd,
              contentType: false,
              processData: false

          }).done(function( xml ) { 
            var file = $(xml).find("file").text();
            var flag = $(xml).find("flag").text();

            if(flag != 1){
              $("#message").slideDown(200).text(opt.err_upload);//空时出错
            }else{
              $("#per").html("100.00%");
              
    /* 
     * 记录图像
     *------------------------------------*/
              $.ajax({ type: "POST",url: "common/php/chat.php",data: "mode=file&room="+opt.room_id+"&file="+file,
                  success: function(xml){
                    readLog(true,'');
                    cs_top();
                  }
              });
            }
          });

          setTimeout(function(){
            $("#camera").slideUp();
            $("#pbar").height("0px");
            $("#per").html("");
          },3000);

          $("#files_field").val('');
      };

  };

  
 
    function sanitize(val){
      return $('<div />').text(val).html();
    }
    
    
  /*
   * 房间名
   */
  function Oekaki(roomId,jquery_chat_name){

      var Data = {
        drawFlag : false,
        defX : 0,
        defY : 0,
        defaultColor : 'rgba(0,0,0,1)',
        defaultBrush : 3,
        CanvasWidth  : 0,
        CanvasHeight : 0,
        marginLeft   : 0,
        marginTop    : 106
      };


      //var selecter = this.selector;
      var Canvas = document.getElementById("Canvas");
      var canvasContainer = document.getElementById("canvasContainer");
      var context = Canvas.getContext("2d");
      
/*****************************************************
 * 打开/关闭画板
 *****************************************************/
      $("#drawpalet").click(function (e) {
        
        if( $.cookie(jquery_chat_name) ) {
          $("#oekaki").slideToggle(10);
          var Canvas = document.getElementById("Canvas");
          var Width = $(window).width();
          //Canvas.width  = Width;
          Canvas.width  = canvasContainer.offsetWidth;
          Canvas.height = canvasContainer.offsetHeight; 
          Data.CanvasWidth = Canvas.width;
          Data.CanvasHeight = Canvas.height;
        }

        e.preventDefault();
      });


  /*
   * 更改画布的大小
   */
      var Width = $(window).width();
      //Canvas.width  = Width;
      Canvas.width  = canvasContainer.offsetWidth;
      Canvas.height = canvasContainer.offsetHeight; 
      Data.CanvasWidth = Canvas.width;
      Data.CanvasHeight = Canvas.height;
      //$("#image").css({'padding-top':Data.CanvasHeight+50});

  /*
   * 橡皮擦
   */
      $(document).on('click','.eraser img',function(e){
        context.globalCompositeOperation = 'destination-out';
        cbgChange($(this).parents("li").attr('id'));
        e.preventDefault();
      });

  /*
   * 画笔大小
   */
      $(document).on('click','.brush img',function(e){
        context.globalCompositeOperation = 'source-over';
        var size = $(this).attr('id');
        Data.defaultBrush = size;
        cbgChange($(this).parents("li").attr('id'));
        e.preventDefault();
      });

  /*
   * 打开调色板
   */
      $(document).on('click','.setColor img',function(e){
        $('#ColorPalet ul').remove(); 
        $('#ColorPalet').html('<ul></ul>'); 
        for(var i=0; i<rgba.length; i++){
          $("<li style='background:"+rgba[i]+"' id='"+rgba[i]+"' class='changeCcolor'></li>").html('').appendTo("#ColorPalet ul");
        }
        $("#ColorPalet").fadeIn();
        e.preventDefault();
      });

  /*
   * 颜色选择
   */ 
      $(document).on('click','.changeCcolor',function(e){
        
        context.globalCompositeOperation = 'source-over';
        var color = $(this).attr('id');
        $(".setColor").css({'background-color':color})
        $("#ColorPalet").fadeOut();
        Data.defaultColor = color;
        e.preventDefault();
      });

  /*
   * 全部消失
   */
      $(document).on('click','.clear img',function(e){
        $('#image').html('');
          context.clearRect(0, 0, Data.CanvasWidth, Data.CanvasHeight); //x,y,width,heigth
          e.preventDefault();
      });
      
      function cbgChange(id){
        $(".cbg").css({"background-color":"none"});
        $('#'+id).css({"background-color":"#EDCCDB"});
      }
      
  /*
   * 保存
   */
      $(document).on('click','.save img',function(e){
          var canvas     = Canvas.toDataURL("image/png");
          var base64Data = canvas.split(',')[1];
          var data       = window.atob(base64Data);
          var buff       = new ArrayBuffer(data.length);
          var arr        = new Uint8Array(buff);
          
          for( var i = 0, dataLen = data.length; i < dataLen; i++){
            arr[i] = data.charCodeAt(i);
          }
          try {
              var blob = new Blob([arr], {type: 'image/png'});
              UploadImage(blob);
          }
          catch (e) {
            alert('您的浏览器不支持'); //Safari
            $("#oekaki").hide();
          }

          e.preventDefault();
      });

        var UploadImage = function(blob) {
          var formData = new FormData();
            formData.append('files_field', blob);
            formData.append('draw', 1);
              $.ajax({
                  type: 'POST',
                  url: 'common/php/upload.php',
                  data: formData,
                  contentType: false,
                  processData: false,
                  async: true,
                  success:function(xml){
                    var file = $(xml).find("file").text();
                    var flag = $(xml).find("flag").text();
                    context.clearRect(0, 0, Data.CanvasWidth, Data.CanvasHeight); //擦除

                      $.ajax({ type: "POST",url: "common/php/chat.php",data: "mode=draw&room="+roomId+"&file="+file,
                          success: function(xml){
                            $("#oekaki").hide();
                            //readLog(true,'');
                             var pos = $("#end").offset().top; 
                             $("html, body").animate({ 
                                scrollTop:pos 
                             }, 0, "swing");
                          }
                      });
                  }
              });
        };

        Canvas.addEventListener("mouseup", touchHandler, true);
        Canvas.addEventListener("mousedown", touchHandler, true);
        Canvas.addEventListener("mousemove", touchHandler, true);
        Canvas.addEventListener("touchstart", touchHandler, true);
        Canvas.addEventListener("touchend", touchHandler, true);
        Canvas.addEventListener("touchmove", touchHandler, true);

        function touchHandler(e) {
          e.preventDefault();
          /*
           * 支持触摸屏
           * 坐标取得方法
           */
            var supportTouch = 'ontouchend' in document;
            if(supportTouch == true){
              var x = Math.floor( e.touches[0].clientX )-Data.marginLeft;
              var y = Math.floor( e.touches[0].clientY )-Data.marginTop;
            }else{
              var x = e.clientX-Data.marginLeft;
              var y = e.clientY-Data.marginTop;
            }

            switch (e.type) {
              case "mousedown" :
              case "touchstart" :
                Data.drawFlag = true;
                Data.defX = x;
                Data.defY = y;
              break;
              case "mouseup" :
              case "touchend" :
                Data.drawFlag = false;
              break;
              case "mousemove" :
              case "touchmove" :
                  if (!Data.drawFlag) return;
                  var Canvas = document.getElementById("Canvas");

                  context.strokeStyle = Data.defaultColor;
                  context.lineWidth   = Data.defaultBrush;
                  context.lineJoin    = "round";
                  context.lineCap     = "round";
                  context.beginPath();
                  context.moveTo(Data.defX, Data.defY);
                  context.lineTo(x, y);
                  context.stroke();
                  context.closePath();
                  Data.defX = x;
                  Data.defY = y;
              break;
            }
        }

  }
    


})(jQuery);



