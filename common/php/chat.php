<?php
/*
 * 涂鸦聊天
 * Copyright(C)2022 XuSiYin Allright reserved.
 * https://www.xusiyin.com
 * MIT License
 */


mb_language("uni");
mb_internal_encoding("UTF-8");
session_start();
error_reporting(0);
date_default_timezone_set('PRC');

/*
 * 管理员姓名
 */
define('ADMIN_NAME','网站管理员说');

/*
 * SQLite位置
 * 虽然是相对路径写的，但是尽量避开WEB公开目录设置
 * 请注意绝对路径指定等安全性.
 */
define('SQLITE','../../db/chat.sqlite');

/*
 * 发言限制（秒）
 * 指定的秒数不能进行下一次发言.
 */
define('write_limit',3); //0无限制


/*
 * 第一次装入的日志数
 * 因为有过去的记录功能，所以不太多，30～50比较好.
 */
define('LEN',30);

// 设置到此为止 --------------------------------------------------
require_once('chouqian.php'); //读取抽签设置文件*想更改内容时请参照





/******************************************
 * 变量定义和序列
 ******************************************/
/*
 * 确认是否POST排列
 */
if(isset($_POST) AND is_array($_POST)){
  foreach($_POST AS $key=>$str){
    $post[$key] = htmlspecialchars($str , ENT_QUOTES , "UTF-8");
  }
}else{
  return; //如果没有POST则停止
}

/*
 * 加上IP和发送日期(md5加密)
 */
  $hash = md5($_SERVER["REMOTE_ADDR"].time());
  
/*
 * 定义发言颜色
 */
  if($post['c']){
    $name_color = '#'.$post['c'];
  }else{
    $name_color = '#000000';
  }
  if($post['l']){
    $log_color = '#'.$post['l'];
  }else{
    $log_color = '#000000';
  }


/******************************************
 * mode分支处理
 ******************************************/
  switch($post['mode']){
    case 'db_check':
      $db_error = null;
      $db = dbClass::connect();
      if($db === 'error'){
        $db_error = '无法连接到数据库!';
      }else{
        try { 
          $stmt = $db->prepare("SELECT COUNT(*) AS count FROM sqlite_master WHERE TYPE='table' AND name='chat_log'");
          $stmt->execute();
          $check = $stmt->fetch(PDO::FETCH_ASSOC); 
          if(!$check['count']){
              $sql = "CREATE TABLE 'chat_log' ( 'id' INTEGER NOT NULL PRIMARY KEY, 'room_id' TEXT , 'chat_unique' TEXT, 'hash' TEXT, 'time' TEXT, 'chat_name' TEXT, 'str' TEXT, 'remoote_addr' TEXT, 'name_color' TEXT, 'log_color' TEXT, 'chat_type' TEXT, 'log_sort' TEXT, 'created' DATE );";
              $sql .= "CREATE INDEX chat_log_room_id ON 'chat_log'('room_id'); ";
              $stmt = $db->prepare($sql); 
              $stmt->execute();
          }
          $stmt = $db->prepare("SELECT COUNT(*) AS count FROM chat_log WHERE room_id=:room_id "); //确认房间日志数
          $stmt->execute(array(':room_id'=>$post['room']));
          $row = $stmt->fetch(PDO::FETCH_ASSOC);
          $row['count'] = $row['count']*1;

        } catch (PDOException $err) { 
          $db_error = '数据库表格无效!';
        }
      } 

      if($db_error !== null){

       header("Content-type: application/xml");
       echo '<?xml version="1.0" encoding="UTF-8" ?> ' . "\n";

       echo '<xml>'."\n"; 
       echo '      <error>'.$db_error.'</error>'."\n"; 
       echo '</xml>'."\n"; 
       exit;
       
      }else{
        
        /*
         * 确认完数据库连接和表格后，确认这个房间的日志数
         * 日志为0时，请输入初始设置OK日志
         * 如果不进行该处理，则异步→重载有可能陷入无限循环
         * *log_write()不使用
         */
          if($row['count'] < 1){
              $data = array(
                   ':room_id'      => $post['room']
                  ,':chat_unique'  => 'ADMIN'
                  ,':hash'         => $hash
                  ,':time'         => time()
                  ,':chat_name'    => '系统 '
                  ,':str'          => '  聊天已启用'
                  ,':log_sort'     => 'li3'
                  ,':created'      => date('Y-m-d H:i:s')
              );
              
              $sql = "INSERT INTO 'chat_log' ( 'id' , 'room_id' , 'chat_unique' , 'hash' , 'time' , 'chat_name' , 'str' ,'log_sort' , 'created' )
              VALUES ( NULL , :room_id , :chat_unique , :hash , :time , :chat_name , :str ,:log_sort , :created ) ";
              try { 
                $stmt = $db->prepare($sql);
                $stmt->execute($data);
              } catch (PDOException $err) {
                //return $err->getMessage();
              }
          }
      }
    break;
    
/*
 * 登录
 */
    case 'login':
      
      $log_str = $post['str'].$post['mes'];
      $data = array(
           ':room_id'      => $post['room']
          ,':chat_unique'  => 'ADMIN'
          ,':hash'         => $hash
          ,':time'         => time()
          ,':chat_name'    => ADMIN_NAME
          ,':str'          => $log_str
          ,':remoote_addr' => $_SERVER["REMOTE_ADDR"]
          ,':name_color'   => $name_color
          ,':log_color'    => $log_color
          ,':chat_type'    => ''
          ,':created'      => date('Y-m-d H:i:s')
      );
      
        log_write($data,$post['room']);
    break;
/*
 * 发言
 */
    case 'send':
    //发言限制的时间
      if(!$_SESSION['write_limit']) $_SESSION['write_limit'] = time();
      if(time() < $_SESSION['write_limit']){
        write_stop();
        return ;
      }
      $_SESSION['write_limit'] = mktime(date('H'),date('i'),date('s')+write_limit,date('m'),date('d'),date('Y'));
      
      $log_str = $post['str'];
      $data = array(
           ':room_id'      => $post['room']
          ,':chat_unique'  => $_COOKIE['jquery_chat_unique'.$post['room']]
          ,':hash'         => $hash
          ,':time'         => time()
          ,':chat_name'    => $_COOKIE['jquery_chat_name'.$post['room']]
          ,':str'          => $log_str
          ,':remoote_addr' => $_SERVER["REMOTE_ADDR"]
          ,':name_color'   => $name_color
          ,':log_color'    => $log_color
          ,':chat_type'    => ''
          ,':created'      => date('Y-m-d')
      );
      
      
    /*
     * 抽签
     */
      if($post['kuzi']){
        $data['kuzi'] = 'kuzi';
        $omikuzi = new Omikuzu;
        
        switch($log_str){
          case '抽签':
            $data[':str']  = '['.$_COOKIE['jquery_chat_name'.$post['room']].'] ';
            $data[':str'] .= $omikuzi->Nomal();
          break;
          case '健康':
            $data[':str']  = '['.$_COOKIE['jquery_chat_name'.$post['room']].'] ';
            $data[':str'] .= $omikuzi->Kenko();
          break;
          case '恋爱':
            $data[':str']  = '['.$_COOKIE['jquery_chat_name'.$post['room']].'] ';
            $data[':str'] .= $omikuzi->Renai();
          break;
        }
        
      }
      
    //如果发言不是空话
      if($post['str']){
        log_write($data,$post['room']);
      }
    break; 
    case 'readLog':
      readLog($post['room'],$post['append'],$post['lasthash'],$post['len']);
    break; 
  
/*
 * 注销
 */
    case 'logout':
      $log_str = $post['name'].$post['mes'];
      $data = array(
           ':room_id'      => $post['room']
          ,':chat_unique'  => 'LOGOUT'
          ,':hash'         => $hash
          ,':time'         => time()
          ,':chat_name'    => ADMIN_NAME
          ,':str'          => $log_str
          ,':remoote_addr' => $_SERVER["REMOTE_ADDR"]
          ,':name_color'   => ''
          ,':log_color'    => ''
          ,':chat_type'    => ''
          ,':created'      => date('Y-m-d H:i:s')
      );
      
      
        log_write($data,$post['room']);
    break; 
/*
 * 贴图
 */
    case 'gostump':
    //发言限制时间
      if(!$_SESSION['write_limit']) $_SESSION['write_limit'] = time();
      if(time() < $_SESSION['write_limit']){
        write_stop();
        return ;
      }
      $_SESSION['write_limit'] = mktime(date('H'),date('i'),date('s')+write_limit,date('m'),date('d'),date('Y'));
      
      $data = array(
           ':room_id'      => $post['room']
          ,':chat_unique'  => $_COOKIE['jquery_chat_unique'.$post['room']]
          ,':hash'         => $hash
          ,':time'         => time()
          ,':chat_name'    => $_COOKIE['jquery_chat_name'.$post['room']]
          ,':str'          => $post['stump']
          ,':remoote_addr' => $_SERVER["REMOTE_ADDR"]
          ,':name_color'   => $name_color
          ,':log_color'    => $log_color
          ,':chat_type'    => 'STUMP'
          ,':created'      => date('Y-m-d H:i:s')
      );
      
        log_write($data,$post['room']);
    break; 
/*
 * 位置地图
 */
    case 'gmap':
      $data = array(
           ':room_id'      => $post['room']
          ,':chat_unique'  => $_COOKIE['jquery_chat_unique'.$post['room']]
          ,':hash'         => $hash
          ,':time'         => time()
          ,':chat_name'    => $_COOKIE['jquery_chat_name'.$post['room']]
          ,':str'          => $post['val']
          ,':remoote_addr' => $_SERVER["REMOTE_ADDR"]
          ,':name_color'   => $name_color
          ,':log_color'    => $log_color
          ,':chat_type'    => 'GMAP'
          ,':created'      => date('Y-m-d H:i:s')
      );

        log_write($data,$post['room']);
    break; 
/*
 * 图像文件
 */
    case 'file':
      if($post['file']):
        
        $data = array(
             ':room_id'      => $post['room']
            ,':chat_unique'  => $_COOKIE['jquery_chat_unique'.$post['room']]
            ,':hash'         => $hash
            ,':time'         => time()
            ,':chat_name'    => $_COOKIE['jquery_chat_name'.$post['room']]
            ,':str'          => $post['file']
            ,':remoote_addr' => $_SERVER["REMOTE_ADDR"]
            ,':name_color'   => $name_color
            ,':log_color'    => $log_color
            ,':chat_type'    => 'IMG'
            ,':created'      => date('Y-m-d H:i:s')
        );

        log_write($data,$post['room']);
      endif;
    break; 
    
    

    case 'draw':
      if($post['file']):
        
        $data = array(
             ':room_id'      => $post['room']
            ,':chat_unique'  => $_COOKIE['jquery_chat_unique'.$post['room']]
            ,':hash'         => $hash
            ,':time'         => time()
            ,':chat_name'    => $_COOKIE['jquery_chat_name'.$post['room']]
            ,':str'          => $post['file']
            ,':remoote_addr' => $_SERVER["REMOTE_ADDR"]
            ,':name_color'   => $name_color
            ,':log_color'    => $log_color
            ,':chat_type'    => 'DRAW'
            ,':created'      => date('Y-m-d H:i:s')
        );

        log_write($data,$post['room']);
      endif;
    break; 
    
    
    
    case 'newLog':
      newLog();
    break; 
/*
 * 表情缩略图
 */
    case 'stump':
      header("Content-type: application/xml");
      echo '<?xml version="1.0" encoding="UTF-8" ?> ' . "\n";
      echo '  <xml>'."\n"; 
      $res_dir = opendir('../../smile/thumbnail/');
        while( $file_name = readdir( $res_dir ) ){
          if($file_name != '.' AND $file_name != '..'){
           echo '  <item>'."\n"; 
           echo '      <stp>'.$file_name.'</stp>'."\n"; 
           echo '  </item>'."\n"; 
          }
        }
        closedir( $res_dir );
        echo '  </xml>'."\n"; 
    break; 
/*
 *重载
 */
    case 'reload':
      $db = dbClass::connect();
      $reload[':room_id'] = $post['room'];
      $sql = "SELECT 
               MAX(id) AS id  
              ,hash
              ,chat_unique
              FROM chat_log WHERE room_id=:room_id ";
      try { 
        $stmt =  $db->prepare($sql);
        $stmt -> execute($reload);
        $row  =  $stmt->fetch(PDO::FETCH_ASSOC);
      } catch (PDOException $err) {
        //return $err->getMessage();
      }
      
      $flag = false;
      if($_SESSION['new_v_sqlite'] != $row['hash']){
        $flag = true;
      }
      

 header("Content-type: application/xml");
 echo '<?xml version="1.0" encoding="UTF-8" ?> ' . "\n";
 echo '  <xml>'."\n"; 
 echo '      <flag>'.$flag.'</flag>'."\n"; 
 echo '  </xml>'."\n"; 

    break; 
  }

  
/******************************************
 * 定义函数
 ******************************************/
function write_stop(){
  $message = '下面的发言'.write_limit.'不能秒计算完成';
  header("Content-type: application/xml");
  echo '<?xml version="1.0" encoding="UTF-8" ?> ' . "\n";
  echo '<xml>'."\n"; 
  echo '      <limit>'.$message.'</limit>'."\n"; 
  echo '</xml>'."\n";
  exit;
}
  
  
/*
 * 获取全部信息
 */
function all_Log($roomid,$len=null){

  $db = dbClass::connect();
  $data[':room_id'] = $roomid;

  if($len == null){
    $data[':limit']   = LEN;
  }else{
    $data[':limit']   = $len;
  }
  
  $sql = "SELECT * FROM chat_log WHERE room_id=:room_id ORDER BY id DESC LIMIT 0,:limit";
  try { 
    $stmt =  $db->prepare($sql);
    $stmt -> execute($data);
    return  $stmt->fetchAll(PDO::FETCH_ASSOC);
  } catch (PDOException $err) {
    //return $err->getMessage();
  }
}

/*
 *只获取最新日志
 */
function new_Log($roomid,$lasthash){

  $db = dbClass::connect();
  
 // $sql ="SELECT * FROM  chat_log WHERE  room_id = '001' AND  id > '18' ORDER BY id DESC";
  $data[':hash']    = $lasthash;
  $data[':room_id'] = $roomid;
  $sql ="SELECT * FROM  chat_log
          WHERE 
            room_id = :room_id
            AND  id > (SELECT id FROM chat_log WHERE hash = :hash )
             ORDER BY id DESC ";
  try { 
    $stmt =  $db->prepare($sql);
    $stmt -> execute($data);
    return  $stmt->fetchAll(PDO::FETCH_ASSOC);
  } catch (PDOException $err) {
    //return $err->getMessage();
  }
  
  
}


/*
 * 日志到XML
 */
function readLog($roomid,$append,$lasthash,$len){
  
  $row = array();
  
// 只得到最新日志
  if($append){
    if(!$lasthash) return;
    $row = new_Log($roomid,$lasthash);
    $row = array_reverse($row);
  }
// 获得全部日志
  else{
    $row = all_Log($roomid,$len);
    $row = array_reverse($row);
  }
  
  
  
  
  /*
   * $_SESSION['last_hash']
   * 获得自己看到的最新日志以后的数据
   */
  
 header("Content-type: application/xml");
 echo '<?xml version="1.0" encoding="UTF-8" ?> ' . "\n";
 echo '<xml>'."\n"; 
 

   foreach($row AS $log){
      if(date('Ymd',$log['time']) === date('Ymd')){
        $date = date('H:i',$log['time']);
      }else{
        $date = date('Y-m-d H:i',$log['time']);
      }
         echo '  <item xml:space="preserve">'."\n"; 
         echo '      <hash>'.$log['hash'].'</hash>'."\n"; 
         echo '      <cls>'.$log['log_sort'].'</cls>'."\n"; 
         echo '      <name>'.$log['chat_name'].'</name>'."\n"; 
         echo '      <log>'.$log['str'].'</log>'."\n"; 
         echo '      <date>'.$date.'</date>'."\n"; 
         echo '      <col1>'.$log['name_color'].'</col1>'."\n"; 
         echo '      <col2>'.$log['log_color'].'</col2>'."\n"; 
         echo '      <img>'.$log['chat_type'].'</img>'."\n"; 
         echo '  </item>'."\n"; 
   }

 
 echo '</xml>'."\n"; 
 
 $db = null;
 
 $last_key = count($row)-1;
 $_SESSION['new_v_sqlite'] = $row[$last_key]['hash'];
 
}


/*
 * 写入日志
 */
function log_write($data,$roomid){
  $db = dbClass::connect();
  $all_Log = all_Log($roomid);
  
  //$_SESSION['my_hash'] = $data[':hash']; //自己的聊天
  

  // 管理员发言时
    if($data[':chat_unique'] === 'ADMIN' OR $data[':chat_unique'] === 'LOGOUT'){
      $data[':log_sort'] = 'li3';
    }else{
      
     $checkLog = array();
      foreach($all_Log AS $row){
        if($row['chat_unique'] != 'ADMIN') {
          $checkLog[] = $row;
        }
      }

      //如果除了管理员发言以外没有其他的话
        if(!$checkLog){
          $data[':log_sort'] = 'li1';
        }else{
          if($data[':chat_unique'] === $checkLog[0]['chat_unique']){ //如果之前的发言和自己的发言一样的话
            $data[':log_sort'] = $checkLog[0]['log_sort'];
          }else{
            if($checkLog[0]['log_sort'] === 'li1'){
              $data[':log_sort'] = 'li2';
            }else{
              $data[':log_sort'] = 'li1';
            }
          }
        }
    }
    
    if($data['kuzi']){
      $data[':log_sort']    = 'li4';
      $data[':chat_unique'] = 'ADMIN';
      unset($data['kuzi']);
    }
    
    
    $sql = "INSERT INTO 'chat_log' ( 'id' , 'room_id' , 'chat_unique' , 'hash' , 'time' , 'chat_name' , 'str' , 'remoote_addr' , 'name_color' , 'log_color' , 'chat_type' ,'log_sort' , 'created' )
    VALUES ( NULL , :room_id , :chat_unique , :hash , :time , :chat_name , :str , :remoote_addr , :name_color , :log_color , :chat_type , :log_sort , :created ) ";
    try { 
      $stmt = $db->prepare($sql);
      $stmt->execute($data);
    } catch (PDOException $err) {
      //return $err->getMessage();
    }

}

/******************************************
 *数据库连接
 ******************************************/
class dbClass{
    static function connect(){
        try {
            $conn = new PDO("sqlite:".SQLITE);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
          return 'error';
            //return $err->getMessage();
        }
        return $conn; 
    }
}
