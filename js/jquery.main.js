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

    nav_drop_item.each(function() {
      var that = $(this);

      if ( !that.hasClass('open') ) {
        that.find('ul').hide();
      }
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

ms.init = function() {
  ms.promo.init();
  ms.nav();
  $('.mask-phone').mask('+7 999 999 99 99');
};

$(ms.init);
