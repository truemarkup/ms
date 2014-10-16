var ms = window.ms || {};

ms.cfg = ms.cfg || {
  ns: '.ms'
};

ms.log = function(msg) {
  if (typeof window.console !== 'undefined') {
    window.console.log(msg);
  }
};

ms.promo = {
  preload: function(id, src1, src2, callback ) {
    var img1 = new Image(),
        img2 = new Image();

    $(img1)
      .on('load.prm', function() {
        $(img2)
          .on('load.prm', function() {
            callback.apply(this);
          })
          .attr({
            src: src2
          });
      })
      .attr({
        id: id,
        src: src1
      });
  },
  init: function() {
    $('div.promo-js').each(function() {
      var promo = $(this),
          promo_bg = $('div.bg-img img'),
          promo_img = $('div.promo-img img'),
          promo_thumb = $('div.promo-thumbs a', promo),
          promo_thumb_len = promo_thumb.length,
          promo_current = promo_thumb.index( promo_thumb.filter('.current').eq(0) ),
          promo_prev = $('a.promo-prev', promo),
          promo_next = $('a.promo-next', promo),
          promo_dt;

      if ( promo_current < 0 ) {
        promo_current = 0;
      }

      if ( promo_bg.length === 0 ) {
        promo_bg = $('<div class="bg-img"><img alt=""></div>');
        promo_bg.appendTo( $('div.bone') );
        promo_bg = $('img', promo_bg);
      }

      promo_dt = '#promo_img_' + +new Date();

      // load
      function _promoLoad() {
        promo.addClass('loading');

        ms.promo.preload(promo_dt, promo_thumb.eq(promo_current).attr('data-img'), promo_thumb.eq(promo_current).attr('data-bg'), function() {
          promo_img.attr('src', promo_thumb.eq(promo_current).attr('data-img'));
          promo_bg.attr('src', promo_thumb.eq(promo_current).attr('data-bg'));

          promo_thumb.removeClass('current');
          promo_thumb.eq(promo_current).addClass('current');

          if ( promo_current === 0 ) {
            promo_prev.addClass('disabled');
          } else {
            promo_prev.removeClass('disabled');
          }

          if ( promo_current === promo_thumb_len - 1 ) {
            promo_next.addClass('disabled');
          } else {
            promo_next.removeClass('disabled');
          }

          promo.removeClass('loading');
        });
      }
      _promoLoad();

      // click thumb
      promo_thumb.on('click.prm', function() {
        promo_current = promo_thumb.index(this);
        _promoLoad();
        return false;
      });

      // click arrow
      promo_prev.on('click.prm', function() {
        if ( promo_current > 0 ) {
          promo_current--;
        }

        _promoLoad();

        return false;
      });

      promo_next.on('click.prm', function() {
        if ( promo_current < promo_thumb_len - 1 ) {
          promo_current++;
        }

        _promoLoad();

        return false;
      });
    });
  }
};

ms.nav = function() {
  $('div.nav-opener').each(function() {
    var nav = $(this),
        nav_drop = $('div.nav-drop', nav),
        nav_opener = $('> a', nav),
        nav_drop_list = $('> ul', nav_drop),
        nav_drop_item = $('> li', nav_drop_list);

    nav_drop_item.each(function() {
      var that = $(this);

      if ( !that.hasClass('open') && !that.hasClass('active') ) {
        that.find('ul').hide();
      }
    });

    function _resetAside() {
      if ( nav.hasClass('static') ) {
        $('div.aside').css({
          paddingTop: nav_drop.height()
        });
        return;
      }
    }

    _resetAside();

    $(window).on('load.nvg', function() {
      _resetAside()
    });

    nav_opener.on('click.nav', function() {
      if ( nav.hasClass('open') ) {
        nav.removeClass('open');
        nav_drop.fadeOut(250);
      } else {
        nav.addClass('open');
        nav_drop.fadeIn(250);
      }
      return false;
    });

    $('> a', nav_drop_item).on('click.drop', function() {
      var that = $(this).parent();

      if ( that.hasClass('open') ) {
        $('ul', that).slideUp(250, function() {
          that.removeClass('open');
        });
      } else {
        that.addClass('open');
        $('ul', that).slideDown(250);
      }

      return false;
    });

    $(document).on('click', function(e) {
      var target = $(e.target);

      if ( !target.hasClass('nav-opener') && target.parents('div.nav-opener').length === 0 ) {
        nav.removeClass('open');
        nav_drop.fadeOut(250);
      }
    });
  });
};

ms.news = function() {
  function onAfterNews(curr, next, opts) {
    var index = opts.currSlide;

    if ( index === 0 ) {
      $('#news_prev').addClass('disabled');
    } else {
      $('#news_prev').removeClass('disabled');
    }

    if ( index === opts.slideCount - 1 ) {
      $('#news_next').addClass('disabled');
    } else {
      $('#news_next').removeClass('disabled');
    }
  }

  $('#news_carousel').cycle({
    fx:     'fade',
    slides: "> div.cycle-item",
    prev:   '#news_prev',
    next:   '#news_next',
    after:   onAfterNews,
    timeout: 0
  });
};

ms.customForm = function() {
  $('div.custom-inputs').urInputs({
    replaceCheckboxes: true,
    replaceRadios: true
  });
};

ms.order = function() {
  var order_form = $('div.order-form');
  order_form.hide();

  $('a.l-order-open').on('click.ord', function() {
    order_form
      .toggleClass('open')
      .slideToggle(400);
    return false;
  });

  $('a.l-open-more').on('click', function() {
    $(this).closest('tr').addClass('open-order');
    return false;
  });

  $(document).on('click', function(e) {
    var target = $(e.target);

    if ( !target.hasClass('open-order') && target.parents('tr.open-order').length === 0 ) {
      $('tr.open-order').removeClass('open-order');
    }
  });

  $('a.l-cart-rem').on('click', function() {
    $(this).parents('tr.open-order').removeClass('open-order');
    return false;
  });
};

ms.init = function() {
  ms.promo.init();
  ms.nav();
  ms.news();
  ms.customForm();
  ms.order();

  $('.mask-phone').mask('+7 999 999 99 99');
};

$(ms.init);
