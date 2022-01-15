<?php
/*
 * 涂鸦聊天
 * Copyright(C)2022 XuSiYin Allright reserved.
 * https://www.xusiyin.com
 * MIT License
 * 
 * 适当写几个抽签结果,请更改一下.
 * 可以自由追加.
 * 追加的话请注意逗号.
 * 
 * $array = array(
 *  '结果A'
 * ,'结果B'
 * ,'结果C'
 * );
 * 我觉得复制结果C部分,追加就好了.
 * 随机数有偏差，所以有时会得出相同的结果.
 * 
 */
class Omikuzu{
  
/*
 * 抽签
 */
  public function Nomal(){
    $array = array(
        '[大吉] 开心快乐每一天!'
       ,'[中吉] 心情一般般!'
       ,'[中吉] 还不错!'
       ,'[中吉] 将就!'
       ,'[中吉] 微笑!'
       ,'[小吉] 难受!'
       ,'[小吉] 无聊!'
       ,'[小吉] 无语!'
       ,'[凶] 想哭!'
       ,'[大凶] 大哭!'
    );
    
    $cnt = count($array) - 1;
    $rnd = mt_rand(0, $cnt );
    return $array[$rnd];
  }
/*
 * 健康运
 */
  public function Kenko(){
    $array = array(
        '注意腹痛!注意不要吃太多!'
       ,'可能会摔倒,小心受伤!'
       ,'头痛,去空气好的地方吧!'
       ,'一天都很健康!'
       ,'腰痛没关系,踮起脚来!'
       ,'肩膀酸痛好难受!'
       ,'觉得今天会过得很好!'
       ,'小心感冒!出去的时候要戴口罩!'
    );
    
    $cnt = count($array) - 1;
    $rnd = mt_rand(0, $cnt );
    return $array[$rnd];
  }
/*
 * 恋爱运
 */
  public function Renai(){
    $array = array(
        '也许会有很好的邂逅.ヽ（=´▽`=）出去看看!'
       ,'(´・ω・`)小心外遇!'
       ,'(*^_^*)试着牵手!'
       ,'(´～｀)下次带你去吃好吃的吧!'
       ,'( ﾟдﾟ)约会……有不祥的预感!'
       ,'♡最棒的恋爱运!'
       ,'( ｰ`дｰ´)脚尖是从温柔开始的!'
       ,'(｡-ω-)陪酒女郎还是算了吧!'
       ,'试着温柔地打招呼吧♡!'
       ,'试着抚摸一下头吧♡!'
       ,'试着紧紧地拥抱她吧♡!'
    );
    
    $cnt = count($array) - 1;
    $rnd = mt_rand(0, $cnt );
    return $array[$rnd];
  }
  
}
