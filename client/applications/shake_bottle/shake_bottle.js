/**
 *  配置 shake.js 基础信息
 */
Session.setDefault('counts',0);
/**
 * 监听摇晃成功后回调
 * without debounce, every actual user shake will fire the callback twice right away
 * @type {Function}
 */
onShake = function onShake() {
    /**
     * 如果晃动监听未关闭,每晃动一次,晃动次数加一.
     * 如果监听已关闭，直接返回.
     */
    Session.set('counts',Session.get('counts')+1);
    if(Session.get('watching')){
        Session.set('shakesCount', Session.get('shakesCount') + 1);
    }else {
      return false;
    }
    // 如果正在发奖，直接返回
    if(Session.get('getPrize')) return;

    /**
     * 设置温度计高度
     * 获取当前高度 - 3，然后重新设置高度。
     * @param  {[type]} 'temperature' [description]
     * @return {number}               当前温度
     */
    function temperature(){
        var TH = Session.get('temperature') - 0.03;
            Session.set('temperature', TH);
        var THRem = TH + "rem";
        $('.temperature').css('height',THRem);
        console.log('TH', TH);
        return TH;
    }
    // 如果到达40度，发开始发奖
    if(temperature() <= 3.66){
      getPrize(Session.get('watching'));
        document.getElementById("dingSound").play();
        // $("body").append('<audio id="dingSound" src="/audio/ding.mp3" autoplay="autoplay"></audio>');
        shake.stopWatch();//停止监听摇晃
    }
    /**
     * 获取奖品
     * 设置获取奖品加载中状态
     * 拼接发送参数
     * 调用 shakeBbottle 接口
     * @return {[type]} [description]
     */
    function getPrize(start){
        Session.set('getPrize', true);
        var time = new Date().getTime() - start,
            post = {time: time, activity: Session.get('activeId')},
            sign = Sign.create(post);

        post.sign = sign;
        Meteor.call('shakeBbottle', post, function (error, result) {
            // 如果发生错误,显示错误信息
            if(error){
                console.error('shakeBbottle error', error);
                shareModal('<p>'+ error.reason +'</p>', true);
                return ;
            }
            console.log('result', result);
            // 显示奖品结果
            var user = Meteor.user(),
                nickname = user.profile.wechat.nickname, //昵称
                timeEnd = (time/1000).toFixed(2), // 摇晃时间
                prize = result.name; // 奖品名称
            // 显示奖品窗口
            $('#shake-result-modal .content').html('<p>恭喜您'+ nickname +'</p><p>本次摇奶瓶耗时为 '+ timeEnd +' 秒</p><p>得到'+ prize +'</p>');
            $("#shake-result-modal").css('display','block');
            setTimeout(function () {
                $("#shake-result-modal .center-square").removeClass("zoom");
            },10);

            // 重置所有状态，马上开始下一次摇奖
            initStates();

        });
    }

};
// onShake = _.debounce(function onShake() {
//     Session.set('shakesCount', Session.get('shakesCount') + 1);
// }, 750, true);  // fire the shake as soon as it occurs, but not again if less than 750ms have passed; 500 was too little

/**
 * 程序测试用代码,暂时请勿删除,用来调试晃动灵敏度
 */
// Template.shakeBottle.helpers({
//     shakes: function () {
//         return Session.get('shakesCount');
//     },
//     shakeCount: function () {
//         return Session.get('counts');
//     },
//     watching: function () {
//         return Session.get('watching').toString();
//     },
//     sens: function () {
//         return Session.get('sensitivity').toString();
//     }
// });

Template.shakeBottle.events({
    /**
     * 用 click 事件模拟手机摇动时的奶瓶及温度计动画
     * 在温度到达40度时为用户发奖品
     */
    // 'click .animation-square': function () {
    //   onShake();
    // },
    // 'click .animation-square': function () {
    //     /**
    //      * 如果晃动监听未关闭,每晃动一次,晃动次数加一.
    //      * 如果监听已关闭，直接返回.
    //      */
    //     if(Session.get('watching')){
    //         Session.set('shakesCount', Session.get('shakesCount') + 1);
    //     }else {
    //         return false;
    //     }
    //     // 如果正在发奖，直接返回
    //     if(Session.get('getPrize')) return;
    //
    //     /**
    //      * 设置温度计高度
    //      * 获取当前高度 - 3，然后重新设置高度。
    //      * @param  {[type]} 'temperature' [description]
    //      * @return {number}               当前温度
    //      */
    //     function temperature(){
    //         var TH = Session.get('temperature') - 0.3;
    //         Session.set('temperature', TH);
    //         var THRem = TH + "rem";
    //         $('.temperature').css('height',THRem);
    //         console.log('TH', TH);
    //         return TH;
    //     }
    //     // 如果到达40度，发开始发奖
    //     if(temperature() <= 3.66){
    //         getPrize(Session.get('watching'));
    //         document.getElementById("dingSound").play();
    //         // $("body").append('<audio id="dingSound" src="/audio/ding.mp3" autoplay="autoplay"></audio>');
    //         // shake.stopWatch();//停止监听摇晃
    //     }
    //     /**
    //      * 获取奖品
    //      * 设置获取奖品加载中状态
    //      * 拼接发送参数
    //      * 调用 shakeBbottle 接口
    //      * @return {[type]} [description]
    //      */
    //     function getPrize(start){
    //         Session.set('getPrize', true);
    //         var time = new Date().getTime() - start,
    //             post = {time: time, activity: Session.get('activeId')},
    //             sign = Sign.create(post);
    //
    //         post.sign = sign;
    //         Meteor.call('shakeBbottle', post, function (error, result) {
    //             // 如果发生错误,显示错误信息
    //             if(error){
    //                 console.error('shakeBbottle error', error);
    //                 shareModal('<p>'+ error.reason +'</p>', true);
    //                 return ;
    //             }
    //             console.log('result', result);
    //             // 显示奖品结果
    //             var user = Meteor.user(),
    //                 nickname = user.profile.wechat.nickname, //昵称
    //                 timeEnd = (time/1000).toFixed(2), // 摇晃时间
    //                 prize = result.name; // 奖品名称
    //             // 显示奖品窗口
    //             $('#shake-result-modal .content').html('<p>恭喜您'+ nickname +'</p><p>本次摇奶瓶耗时为 '+ timeEnd +' 秒</p><p>得到'+ prize +'</p>');
    //             $("#shake-result-modal").css('display','block');
    //             setTimeout(function () {
    //                 $("#shake-result-modal .center-square").removeClass("zoom");
    //             },10);
    //
    //             // 重置所有状态，马上开始下一次摇奖
    //             initStates();
    //
    //         });
    //     }
    //
    // },
    /**
     * 点击'摇奖品'按钮后模拟摇奶瓶结果出现效果
     */
    'click #start': function () {

        console.log('tap #start');
        if(Session.get('unStart')){
          return shareModal('<p>活动未开始</p>', true);
        }else if(Session.get('isEndding')){
          return shareModal('<p>活动已结束</p>', true);

        }else if(Session.get('isNone') && Session.get('playCount') === 1){
          return shareModal('<p>您已参与过一次啦!</p><p>分享到朋友圈</p><p>可增加一次机会呦</p>');
        }else if(Session.get('isNone')){
          return shareModal('<p>您已玩过</p>', true);
        }

        // 正在摇奖中,或者发奖中
        if(Session.get('watching') || Session.get('getPrize')){
          return;
        };


        //显示摇奶瓶开始倒计时

        //设置定时器
        function myTimer(time, len, count, startGame) {
            var start = 0;
            $("#count-down").css("display","block");
            // console.log(arguments);
            var fn = setInterval(function () {
                start++;
                if(start >= len){
                    clearInterval(fn);
                    startGame();
                }else{
                    count(start-1);
                }

            }, time);
        };

        var imgDisplay = ['/img/two.png','/img/one.png'];
        myTimer(1000, 3, function (index) {
            $("#count-down-img").attr('src',imgDisplay[index]);
            if(index == 0){
                document.getElementById("ready-go").play();
                // $("body").append('<audio id="ready-go" src="/audio/ready-go.mp3" autoplay="autoplay"></audio>');
            }
        }, function () {
            $("#count-down-img").attr('src',"/img/go.png");

            setTimeout(function () {
                $("#count-down").hide();
            },1000);
            Session.set('watching', new Date().getTime());
            $("#start").css('pointer-events','none');
            if (Session.get('watching')){
                console.log("开始摇动");
                shake.startWatch(onShake, {
                    threshold: Session.get('sensitivity'),
                    timeout: 0
                });
            } else {
                console.log("停止摇动");
                shake.stopWatch();
            }
        });

    },
    /**
     * 点击弹层周边空白区域关闭弹层
     */

    // 'click .modal': function () {
    //     $(".modal .center-square").addClass("zoom");
    //     setTimeout(function () {
    //         $(".modal").css('display','none');
    //     },200);
    //     // $(".modal").css('display','none').find(".center-square").addClass("zoom");
    // },

    'click #close-share-modal-button': function () {
        $(".modal .center-square").addClass("zoom");
        setTimeout(function () {
            $(".modal").css('display','none');
        },200);
        // $(".modal").css('display','none').find(".center-square").addClass("zoom");
    },

    /**
     * 点击不满足继续摇后模拟分享界面弹出效果
     * 返回的 false 值目的是阻止事件冒泡
     * @returns {boolean}
     */
    'click #continue-shake': function () {
        // 隐藏摇奶瓶结果界面
        $("#shake-result-modal .center-square").addClass("zoom");
        shareModal('<p>您已参与过一次啦!</p><p>分享到朋友圈</p><p>可增加一次机会呦</p>');
        setTimeout(function () {
            $("#shake-result-modal").css('display','none');
        },200);
        // 显示分享提示
        setTimeout(function () {
            $("#share-modal").css('display','block');
            setTimeout(function () {
                $("#share-modal .center-square").removeClass("zoom");
            },10);
        },100);
        return false;
    }
    // 'click .center-square': function () {
    //     return false;
    // },
    // 'click .center-square': function () {
    //     return false;
    // }
});

/**
 * View 创建之后初始化 state 码
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
Template.shakeBottle.onCreated(function(){
  Session.set('activeId', this.data._id);
  Meteor.call('readActivity', this.data._id); // 统计阅读量
  Session.set('isNone', false); //设置没有玩过
  Session.set('playCount', 0); //玩过的次数为 0
  initStates(); //初始化摇奖状态
});

/**
 * 初始化摇奖状态
 * [resetStates description]
 */
function initStates(){
  console.log('initStates');
  Session.set('watching', false);
  Session.set('shakesCount', 0);
  Session.set('sensitivity', 15);
  Session.set('getPrize', false);
  Session.set('temperature', '8.3');
    Session.set('lastConut', '0');
  // var THRem = TH + "rem";
  $('.temperature').css('height','8.3rem');
    $('#count-down-img').attr('src',"/img/three.png");
  $("#start").css('pointer-events','auto');

    // shake.stopWatch();
}


Template.shakeBottle.helpers({
    is404: function(){
      return Session.set('is404', !this.activity);
    },
    id: function(){
      return {_id: this._id};
    },
    loading: function(){
      return Session.get('getPrize') ? true : false;
    },
    /**
     * 是否已玩过
     * @return {[type]} [description]
     */
    isNone: function(){
          var user = Meteor.user(),
              share = user.profile && user.profile.share || 0,
              count = UserPrizesList.find({activeId: this._id, userId: user && user._id, isTopPrize:{$ne: true}}).count(),
              isNone = count >= (share + 1);
              Session.set('isNone', isNone);
              Session.set('playCount', count);
          return isNone;
    },
    /**
     * 活动未开始
     * 当前时间 小于 开始时间
     * @return {boolean}
     */
    unStart: function(){
      var time = Session.get('time'),
          result = new Date(time) < new Date(this.activity && this.activity.startAt);
          Session.set('unStart', result);
      return result;
    },
    /**
     * 活动已结束
     * 当前时间大于 结束时间
     * @return {boolean}
     */
    isEndding: function(){
      var time = Session.get('time'),
          result = new Date(time) > new Date(this.activity && this.activity.endAt);
          Session.set('isEndding', result);
      return result;
    }
});

/**
 * 提示框模块
 * @param {string} html 显示内容
 * @param {boolean} hideLine 是否隐藏提示线框
 * @return {[type]} [description]
 */
function shareModal(html, hideLine){
    $("#share-modal").css('display','block').find('.content').html(html);
    if(hideLine){
      $("#share-modal .point-img").hide();
    }else{
      $("#share-modal .point-img").show();
    }
    setTimeout(function () {
        $("#share-modal .center-square").removeClass("zoom");
    },10);
}


Template.shakeBottle.onRendered(function () {
    /**
     * 设置当前页面背景样式
     */
    $("body").css({"backgroundImage": "url('/img/bg.jpg')","backgroundSize": "cover","backgroundRepeat": "no-repeat"});

    /**
   * 验证活动状态，
   * 如果活动已结束，或活动未开始。
   * 显示提示框
   */
  function activityState(){
    if(Session.get('is404')){
      shareModal('<p>活动不存在</p>', true);
    }else if(Session.get('unStart')){
      shareModal('<p>活动未开始</p>', true);
    }else if(Session.get('isEndding')){
      shareModal('<p>活动已结束</p>', true);
    }else if(Session.get('isNone') && Session.get('playCount') === 1){
      // 已经玩过一次，还可以分享继续玩
      shareModal('<p>您已参与过一次啦!</p><p>分享到朋友圈</p><p>可增加一次机会呦</p>');
    }
  }
  activityState();
    /**
     * 通过检测 shakesCount (摇动次数) 值是否增加来决定奶瓶是否需要晃动
     * 获取当前晃动次数和上一次晃动次数作比较
     * 如果当前晃动次数大于上一次晃动次数,给 .bottle 添加 shake 动画
     */
    function listen(){
      setTimeout(function () {
          var currentCount = Session.get("shakesCount");
          var lastCount = Session.get('lastConut');
          console.log("执行了");
          if ( currentCount > lastCount ){
              // var audio = new Audio('/img/ready-go.mp3');
              // audio.play();
              // if( lastCount%2 > 0){
              //     document.getElementById('shake-sound').play();
              // } else{
              //     document.getElementById('shake-sound2').play();
              // };
              $(".bottle").addClass("shake");
              Session.set('lastConut', currentCount);

              // 播放声音
              document.getElementById("long-shake-sound").play();
          } else {
              // $("#shake-sound").remove();
              // document.getElementById('shake-sound2').pause();
              // document.getElementById('shake-sound').pause();
              $(".bottle").removeClass("shake");
              // 停止播放声音
              document.getElementById("long-shake-sound").pause();
          }
          listen();
      },1000);
    }
    listen();

});

/**
 * 页面创建设置该页面分享内容
 * 设置 session shareConfig 为该页面分享配置
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
Template.shakeBottle.onCreated(function(){
  WechatShare.shakeBottleConfig();
});
