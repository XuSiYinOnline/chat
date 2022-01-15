<?php
if(!isset($_GET['map'])) exit;

$_GET['map'] = htmlspecialchars($_GET['map'] , ENT_QUOTES , "UTF-8");
$info = explode(',',$_GET['map']);

?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0" />
<title>地理位置</title>
<style>
      html, body, #map-canvas {
        height: 100%;
        margin: 0px;
        padding: 0px
      }

</style>
<script src="//maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places"></script>
<script>
var map;
function initialize() {

//设定纬度经度
  var myLatlng = new google.maps.LatLng(<?php echo $info[0]; ?>,<?php echo $info[1]; ?>);

//设置选项
  var mapOptions = {
    zoom: 18, //放大率
    center: myLatlng //纬度经度
  };
  
//绘制谷歌地图
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions); 
  
//设置信息窗口
  var infowindow = new google.maps.InfoWindow({
      //content: '重庆市巴南区界石镇桂花村A区',
      maxWidth: 200
  });

//在纬度经度位置显示标记
  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
  });
  
  infowindow.open(map,marker); //显示窗口
  
//点击标记显示窗口
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
  
}
google.maps.event.addDomListener(window, 'load', initialize); //装入页面后显示映射
</script>
</head>

<body>
  <div id="map-canvas"></div>
</body>
</html>
