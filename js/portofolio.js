$(function(){
    var pages = $('.pages').children();
    var grabs = false; // Gonna work on this, one day

    pages.each(function(i) {
    var page = $(this);
        if (i % 2 === 0) {
            page.css('z-index', (pages.length - i)); 
        }
    });

    $(window).load(function() {
    
    $('.page').click(function() {
        var page = $(this);
        var page_num = pages.index(page) + 1;
        if (page_num % 2 === 0) {
        page.removeClass('flipped');
        page.prev().removeClass('flipped');
        } else {
        page.addClass('flipped');
        page.next().addClass('flipped');
        }
    });

    if(grabs) {
        $('.page').on('mousedown', function(e) {
        var page = $(this);
        var page_num = pages.index(page) + 1;
        var page_w = page.outerWidth();
        var page_l = page.offset().left;
        var grabbed = '';
        var mouseX = e.pageX;
        if (page_num % 2 === 0) {
            grabbed = 'verso';
            var other_page = page.prev();
            var centerX = (page_l + page_w);
        } else {
            grabbed = 'recto';
            var other_page = page.next();
            var centerX = page_l;
        }

        var leaf = page.add(other_page);

        var from_spine = mouseX - centerX;

        if (grabbed === 'recto') {
            var deg = (90 * -(1 - (from_spine/page_w)));
            page.css('transform', 'rotateY(' + deg + 'deg)');

        } else {
            var deg = (90 * (1 + (from_spine/page_w)));
            page.css('transform', 'rotateY(' + deg + 'deg)');
        }

        leaf.addClass('grabbing');

        $(window).on('mousemove', function(e) {
            mouseX = e.pageX;
            if (grabbed === 'recto') {
            centerX = page_l;
            from_spine = mouseX - centerX;
            var deg = (90 * -(1 - (from_spine/page_w)));
            page.css('transform', 'rotateY(' + deg + 'deg)');
            other_page.css('transform', 'rotateY(' + (180 + deg) + 'deg)');
            } else {
            centerX = (page_l + page_w);
            from_spine = mouseX - centerX;
            var deg = (90 * (1 + (from_spine/page_w)));
            page.css('transform', 'rotateY(' + deg + 'deg)');
            other_page.css('transform', 'rotateY(' + (deg - 180) + 'deg)');
            }

            console.log(deg, (180 + deg) );
        });


        $(window).on('mouseup', function(e) {
            leaf
            .removeClass('grabbing')
            .css('transform', '');

            $(window).off('mousemove');
        });
        });
    }
    
    $('.book').addClass('bound');
    });
});

$(function(){
    var stage = $('#container'),
    stageBase = $('.stageBase'),
    scrollSpeed = 1000,
    scrollEasing = 'swing',
    // slideSpeed = 500,
    // slideEasing = 'linear',
    downBtn = 'show', // 'show' or 'hide'
    urlHash = 'on', // 'on' or 'off'
    setHash = '!page';
 
 
    stage.append('<nav id="pageNav"><ul></ul></nav>');
    stageBase.each(function(i){
        $('#pageNav ul').append('<li class="pagePn"><a href="javascript:void(0);"></a></li>');
    });
 
    if(downBtn == 'show'){
        stage.append('<div id="pageDown"><a href="javascript:void(0);"></a></div>');
    }
 
    var nav = $('#pageNav'),
    navUl = nav.find('ul'),
    navList = navUl.find('li'),
    navLength = navList.length;
    navUl.find('li:first').addClass('activeStage');
    $('body').attr('data-page','1');
 
    $(window).load(function(){
        // StageHeight
        $(window).resize(function(){
            var wdHeight = $(window).height();
            stageBase.css({height:wdHeight});
 
            var resizeContTop = parseInt(stage.css('top'));
 
            if(resizeContTop === 0){
                stage.css({top:'0'});
            } else {
                var activeStagePos = navUl.find('li.activeStage');
                activeStagePos.each(function(){
                    var posIndex = navList.index(this);
                    stage.css({top:-(wdHeight*posIndex)});
                });
            }
 
            nav.each(function(){
                var navHeight = $(this).height();
                $(this).css({top:((wdHeight)-(navHeight))/2});
            });
        }).resize();
 
 
        // MouseWheelEvent
        var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
        $(document).on(mousewheelevent,function(e){
            if(!(stage.is(':animated'))){
                e.preventDefault();
                var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
                if (delta < 0){
                    motionDown();
                } else {
                    motionUp();
                }
            }
        });
 
        // KeyEvent
        $('html').keydown(function(e){
            if(stage.is(':animated') || stage.find('*').is(':animated')){
                e.preventDefault();
            } else {
                switch(e.which){
                    case 33: // Key[PgUp]
                    e.preventDefault();
                    motionUp();
                    break;
 
                    case 34: // Key[PgDn]
                    e.preventDefault();
                    motionDown();
                    break;
 
                    case 38: // Key[↑]
                    e.preventDefault();
                    motionUp();
                    break;
 
                    case 40: // Key[↓]
                    e.preventDefault();
                    motionDown();
                    break;
 
                    // case 37: // Key[←]
                    // e.preventDefault();
                    // var dsChkP = $('#stage' + acvStgSwP + ' .sdPrev').css('display');
                    // if (!(dsChkP == 'none')){
                    //     $('#stage' + acvStgSwP + ' .sdPrev').click();
                    // }
                    // break;
 
                    // case 39: // Key[→]
                    // e.preventDefault();
                    // var dsChkN = $('#stage' + acvStgSwP + ' .sdNext').css('display');
                    // if (!(dsChkN == 'none')){
                    //     $('#stage' + acvStgSwP + ' .sdNext').click();
                    // }
                    // break;
                }
            }
        });
 
        // touchEvent スマホ・タブレット対応
        var isTouch = ('ontouchstart' in window);
        stage.on(
            {'touchstart': function(e){
                if(stage.is(':animated')){
                    e.preventDefault();
                } else {
                    this.pageY = (isTouch ? event.changedTouches[0].pageY : e.pageY);
                    this.topBegin = parseInt($(this).css('top'));
                    this.top = parseInt($(this).css('top'));
                    this.touched = true;
                }
            },'touchmove': function(e){
                if(!this.touched){return;}
                e.preventDefault();
                this.top = this.top - (this.pageY - (isTouch ? event.changedTouches[0].pageY : e.pageY));
                this.pageY = (isTouch ? event.changedTouches[0].pageY : e.pageY);
            },'touchend': function(e){
                if (!this.touched) {return;}
                this.touched = false;
 
                if(((this.topBegin)-30) > this.top){
                    motionDown();
                } else if(((this.topBegin)+30) < this.top){
                    motionUp();
                }
            }
        });
 
        // ScrollUpEvent
        function motionUp(){
            var stageHeightU = stageBase.height(), //画面の高さ
            contTopUp = parseInt(stage.css('top')), 
            moveTopUp = contTopUp + stageHeightU;
            $('input,textarea').blur();
            if(!(contTopUp === 0)){
                stage.stop().animate({top:moveTopUp},scrollSpeed,scrollEasing);
                navUl.find('li.activeStage').removeClass('activeStage').prev().addClass('activeStage');
 
                var acvStageP = parseInt($('body').attr('data-page')),
                setPrev = acvStageP-1;
                $('body').attr('data-page',setPrev);
                if(downBtn == 'show'){
                    pagePos();
                }
            }
            if(urlHash == 'on'){
                replaceHash();
            }
        }
 
        // ScrollDownEvent
        function motionDown(){
            var stageHeightD = stageBase.height(),
            contTopDown = parseInt(stage.css('top')),
            moveTopDown = contTopDown - stageHeightD;
            $('input,textarea').blur();
 
            var contHeight = stage.height(),
            maxHeightAdj = -(contHeight - stageHeightD);
 
            if(!(contTopDown == maxHeightAdj)){
                stage.stop().animate({top:moveTopDown},scrollSpeed,scrollEasing);
                navUl.find('li.activeStage').removeClass('activeStage').next().addClass('activeStage');
 
                var acvStageN = parseInt($('body').attr('data-page')),
                setNext = acvStageN+1;
                $('body').attr('data-page',setNext);
                if(downBtn == 'show'){
                    pagePos();
                }
            }
            if(urlHash == 'on'){
                replaceHash();
            }
        }
 
        // SideNaviClick
        navList.click(function(){
            if(!(stage.is(':animated'))){
                var crtIndex = navList.index(this),
                crtHeight = $(window).height();
                stage.stop().animate({top:-(crtHeight*crtIndex)},scrollSpeed,scrollEasing);
                navUl.find('li.activeStage').removeClass('activeStage');
                $(this).addClass('activeStage');
 
                $('body').attr('data-page',crtIndex+1);
 
                if(downBtn == 'show'){
                    pagePos();
                }
                if(urlHash == 'on'){
                    replaceHash();
                }
            }
        });
 
        // PageDownBtnClick
        $('#pageDown a').click(function(){
            if(!(stage.is(':animated'))){
                var navActive = navUl.find('li.activeStage');
                navActive.each(function(){
                    var navIndex = navList.index(this),
                    navUl = navIndex+1;
                    if(!(navUl == navLength)){
                        $(this).next().click();
                    }
                });
                if(urlHash == 'on'){
                    replaceHash();
                }
            }
        });
        function pagePos(){
            var pnAcv = nav.find('li.activeStage');
            pnAcv.each(function(){
                var pnIndexN = navList.index(this),
                pnCountN = pnIndexN+1;
                if(pnCountN == navLength){
                    $('#pageDown').css({display:'none'});
                } else {
                    $('#pageDown').css({display:'block'});
                }
            });
        }
 
        // HashReplace
        function replaceHash(){
            var pnAcv = nav.find('li.activeStage');
            pnAcv.each(function(){
                var pnIndexN = navList.index(this),
                pnCountN = pnIndexN+1;
                location.hash = setHash + pnCountN;
            });
        }
        if(urlHash == 'on'){
            replaceHash();
        }
 
        // OpeningFade
        stage.css({visibility:'visible',opacity:'0'}).animate({opacity:'1'},2000);
 
        // LoadPageMove
        if(url.indexOf(setHash) !== -1){
            var numSplit = ((url.split(setHash)[1])-1);
            navList.eq(numSplit).click();
        }
    });
 
    // HashChangeEvent
    if(urlHash == 'on'){
        $(window).on('hashchange',function(){
            var stateUrl = document.URL,
            hashSplit = ((stateUrl.split(setHash)[1])-1);
            navList.eq(hashSplit).click();
        });
    }
});


// 〜 point 〜
/* 
今回はスライドショーみたいに固定した画面の中で動かしているわけではなく
それぞれのpageで動いてるので、page動かすにしても　クリックしたページだけでなく、その次のページ　OR　前のページも同時にrotateで回転させなければ
両面の記事にすることができない
*/