<?php
/*
 * 涂鸦聊天
 * Copyright(C)2022 XuSiYin Allright reserved.
 * https://www.xusiyin.com
 * MIT License
 */

error_reporting(0);

$flag = false;
$path = '../../upload/';
$files_field = 'files_field';

$max  = 2048000; //最大文件上传


$ufile_oname = $_FILES[$files_field]['name'];
$ufile_mine  = $_FILES[$files_field]['type'];
$ufile_size  = $_FILES[$files_field]['size'];
$ufile_tmp   = $_FILES[$files_field]['tmp_name'];
$size        = getimagesize("$ufile_tmp");
$img_w = $size[0];
$img_h = $size[1];

$ext = substr($ufile_oname,-3);
$ext = strtolower($ext);

if(isset($_POST['draw']) AND $_POST['draw'] == 1){
  $ext = 'png';
}

$flag = false;

if(!empty($ufile_tmp)){
  
  
/*
 * 绘画开始的话就不调整尺寸
 */
  if(isset($_POST['draw']) AND $_POST['draw'] == 1){
    header("Content-type: application/xml");
    echo '<?xml version="1.0" encoding="UTF-8" ?> ' . "\n";
    $ext = 'png';
    $rial_file = md5( mt_rand().time() ).".png";
    $fileName = $path.$rial_file;
    if (move_uploaded_file($_FILES[$files_field]["tmp_name"], $fileName)) {
      $flag = true;
    }
?>
<xml>
      <file><?php echo $rial_file ; ?></file>
      <flag><?php echo $flag; ?></flag>
      <mes><?php echo $mes; ?></mes>
</xml>
<?php
    exit;
  }
  
  
  
  if($ufile_size <  $max AND ($ext=='jpg' OR $ext=='png' OR $ext=='gif' )){
    
    //按纵向或横向分类
      if($size[0] > $size[1]){ 
        $img_Type = 1; 
      }else{ 
        $img_Type = 2; 
      }

      $Size_0 = $size[0]; //原始大小　横
      $Size_1 = $size[1]; //原始大小　纵
      
      $fileN = time().'_'.mt_rand(5, 15);
      
      $new_upload_file  = $path . "o_" . $fileN . "." . $ext; //大
      $thum_upload_file = $path . "t_" . $fileN . "." . $ext; //中
      
      $rial_file = $fileN.'.'.$ext;
      move_uploaded_file($ufile_tmp,$new_upload_file);

      $image1 = imagecreatefromstring( file_get_contents($new_upload_file) );
      $image2 = imagecreatefromstring( file_get_contents($new_upload_file) );
      
    /*  普通图像大小  */
      $imgSize   = RatioCalculation($img_Type,500,500,$Size_0,$Size_1);
      $newwidth  = $imgSize['W'];
      $newheight = $imgSize['H'];

    /* 生成缩小后的画布 */
      $newimage1        = imagecreatetruecolor($newwidth, $newheight);
      $resize_image1    = imagecopyresampled($newimage1, $image1, 0, 0, 0, 0, $newwidth, $newheight, $img_w, $img_h);
      imagejpeg($newimage1, $new_upload_file);


     /*  中等图像大小  */
      $imgSize   = RatioCalculation($img_Type,125,125,$Size_0,$Size_1);
      $newwidth  = $imgSize['W'];
      $newheight = $imgSize['H'];

    /* 生成缩小后的画布 */
      $newimage2        = imagecreatetruecolor($newwidth, $newheight);
      $resize_image2    = imagecopyresampled($newimage2, $image2, 0, 0, 0, 0, $newwidth, $newheight, $img_w, $img_h);
      imagejpeg($newimage2, $thum_upload_file);
      
      $check_file_1 = $path.'t_'.$rial_file;
      
      if (!file_exists($check_file_1)) {
        $flag = false;
        $mes  = '上传错误';
      }else{
        $flag = true;
      }
    
  }else{
    $flag = false;
    $mes  = '超出限制文件大小或文件扩展名';
  }
  
}else{
  $mes  = '无';
}

function RatioCalculation($type,$new_width,$new_height,$old_width,$old_height ) {

   switch($type){
      case 1:
         $newwidth  = $new_width;
         $Ritu      = $new_width/$old_width; 
         $newheight = $old_height*$Ritu;
         break;
      case 2:
         $newheight = $new_height;
         $Ritu      = $new_height/$old_height;
         $newwidth  = $old_width*$Ritu;
         break;
   }

       $newwidth = $newwidth*100;
       $newwidth = round($newwidth);
       $newwidth = $newwidth/100;

       $newheight = $newheight*100;
       $newheight = round($newheight);
       $newheight = $newheight/100;

       $img['W'] = ceil($newwidth);
       $img['H'] = ceil($newheight);
       
       return $img;
       
}

header("Content-type: application/xml");
echo '<?xml version="1.0" encoding="UTF-8" ?> ' . "\n";
?>
<xml>
      <file><?php echo $rial_file ; ?></file>
      <flag><?php echo $flag; ?></flag>
      <mes><?php echo $mes; ?></mes>
</xml>
	 