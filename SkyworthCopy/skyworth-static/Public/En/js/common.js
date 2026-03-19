$(function () {
    new WOW().init(); // wow初始化
    ys.phNavInit(4);// 移动端导航
    ys.navSlide();// pc端导航默认下拉
    ys.yxlenis();
    navFixed();
    ys.screenh();  // 移动端屏幕高度
    // 语言下拉
    $(".ys-phnav3-lang-hd").click(function() {
        $(this).toggleClass("on");
        $(".ys-phnav3-lang-bd").stop().slideToggle();
    });
    $('.ys-phnav3-lang-hd a').click(function(e) {
        e.stopPropagation();
    });
});
if($('.ys-page-wrap').hasClass('inside-main')){
    $('.ys-hd-ph').addClass('ishover2')
}
$('.ys-phnav-menubtn').click(function(){
    $('.ys-hd-ph').toggleClass('ishover3')
})
// 导航不在顶部时加类名isfixed
function navFixed(){
    ys.isFixed(".ys-hd-pc");
    ys.isFixed(".ys-hd-ph");
    // 导航hover时加类名ishover
    $('.ys-hd-pc').hover(function(){
        $(this).addClass('ishover');
    },function(){
        $(this).removeClass('ishover');
    });
    $('.ys-hd-pc').mousemove(function(){
        $(this).addClass('ishover');
    });
}
// 右下角help
$('.mod-help').on('click','.help-pop-close',function(){
    $(this).parents('.mod-help').addClass('help-close');
});
$('.help-btn').hover(function(){
    $(this).parents('.mod-help').removeClass('help-close');
});
help_pop();
$(window).on("scroll", help_pop);
$(window).on("load", help_pop);
$(window).on("resize", help_pop);
function help_pop(){
    let jian1 = parseFloat($('.mod-help').css('bottom'));
    if($('.ys-nybanner').length>0){
        let zhi = $('.ys-nybanner').height()-$(window).height()+jian1;
        if($(window).scrollTop()>zhi){
           $('.mod-help').addClass('act');
        }else{
            $('.mod-help').removeClass('act');
        }
    }else if($('.ys-banner').length>0){
        let zhi = $('.ys-banner').height()-$(window).height()+jian1;
        if($(window).scrollTop()>zhi){
           $('.mod-help').addClass('act');
        }else{
            $('.mod-help').removeClass('act');
        }
    }else{
        $('.mod-help').addClass('act');
    }
}

// 内页banner描述文字
if($('.ys-nyban-title').length > 0){
    var text = $('.ys-nyban-title p').text(); // 获取p标签的文本内容
    if (text === '') {
        $('.ys-nyban-title p').hide(); // 如果文本为空，则隐藏元素
    } else {
        $('.ys-nyban-title p').show(); // 如果文本不为空，则显示元素
    }
}

// 搜索
$(".yx-search3-btn").click(function (e) {
    e.stopPropagation();
    if($(this).hasClass('on')){
        $(this).stop().removeClass('on');
        $(this).parents(".head1-search").find(".yx-search3xlbox").stop().slideUp();
    }else{
        $(this).stop().addClass('on');
        $(this).parents(".head1-search").find(".yx-search3xlbox").stop().slideDown();
    }
});
$('.head1-search').click(function (e){
    e.stopPropagation();
});
$('body,html').click(function(){
    $('.yx-search3-btn').stop().removeClass('on');
    $('.yx-search3-btn').stop().parents(".head1-search").find(".yx-search3xlbox").stop().slideUp();
});

// 语言
$('.head1-language-top').click(function(){
    $(this).siblings('.head1-language-bot').stop().slideToggle();
    $(this).parents('.head1-language').toggleClass('on');
});

// 导航
// Resources & Suppor--二级
$('.hptu-li').hover(function(){
   $(this).addClass('yxnav-active2').siblings().removeClass('yxnav-active2'); 
},function(){
    $(this).removeClass('yxnav-active2')
    $('.hptu-li.act').addClass('yxnav-active2')
})

// 三级
$('.hpfl-item').hover(function(){
    $(this).addClass('yxnav-active3').siblings().removeClass('yxnav-active3'); 
 },function(){
     $(this).removeClass('yxnav-active3')
     $('.hpfl-item.act').addClass('yxnav-active3')
})

// 产品下拉 - 修复：只在当前下拉菜单范围内操作
$('.head-pull-second-cont').each(function() {
    var $container = $(this);
    var $leftItems = $container.find('.head-pull-second-le .hpsl-list-item');
    var $rightItems = $container.find('.head-pull-second-ri .hpsr-list-item');

    // 初始化：如果左侧有 act 项，显示对应右侧
    $leftItems.each(function() {
        if ($(this).hasClass('act')) {
            var idx = $(this).index();
            $rightItems.eq(idx).show().siblings().hide();
        }
    });

    // Hover 事件：只在当前下拉菜单内操作
    $leftItems.hover(function(){
        var idx = $(this).index();
        $(this).addClass('yxnav-active2').siblings().removeClass('yxnav-active2');
        $rightItems.eq(idx).show().siblings().hide();
    });
});

// 右侧滚动条
ys.mCustomScrollbarInit(".head-pull-second-ri");
var screenWidth1 = $(window).width();
var contentWidth1 = $(".ys-cont1600").width();
var leftDist = (screenWidth1 - contentWidth1) / 2 + 'px';
// console.log(screenWidth1,contentWidth1, leftDist)
$(".head-pull-second").css("--left",leftDist)
       
// 页面上滑，导航出现
if($(window).width()>1199){
    navfix();
} 
function navfix(){
    var step = 0;
    $(window).mousewheel(function (e) {
        if (e.originalEvent.deltaY > 0) {
            // 向下
            $('.ys-hd-pc').stop().addClass('act');
            step = 0;
        } else {
            // 向上
            $('.ys-hd-pc').stop().removeClass('act');
        }
    })
}

// swipe轮播
function swipeplay(box, swipe1) {
    var heightb = $(window).scrollTop();
    if ($(box).length > 0) {
        if (heightb > $(box).offset().top - 500) {
            swipe1.autoplay.start();
        }
        if (heightb > $(box).offset().top + 350) {
            swipe1.autoplay.stop();
        }
    }
}
// swiper自动轮播
function rotaplay(box,swiper1){
    var heightb = $(window).scrollTop();
    if($(box).length>0){
        if(heightb > $(box).offset().top - 500){
            swiper1.autoplay.start();
        }
        if(heightb > $(box).offset().top + 350){
            swiper1.autoplay.stop();
        }
    }
}

// 图片大小
$(function(){
    if (typeof(closeWeb)=='undefined') {
        showImgSize();
        window.onload = showImgSize;
        function showImgSize() {
            $("img").each(function () {
                var w = this.naturalWidth;
                var h = this.naturalHeight;
                $(this).attr('data-size', w + "*" + h);
            });
        }
    }
})
// c2
if($('.prodet-page').length > 0){
    $(this).addClass('act inside-main')
}