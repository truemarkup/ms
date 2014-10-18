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

    if ( !nav.hasClass('static') ) {
      $(document).on('click', function(e) {
        var target = $(e.target);

        if ( !target.hasClass('nav-opener') && target.parents('div.nav-opener').length === 0 ) {
          nav.removeClass('open');
          nav_drop.fadeOut(250);
        }
      });
    }
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

ms.filter = function() {
  $('div.filter').each(function() {
    var filter = $(this),
        filter_panel = $('div.filter-panel', filter);

    filter_panel.each(function() {
      var fpane = $(this),
          fslide = $('div.filter-slide', fpane),
          fopen = $('a.filter-opener', fpane);

      if ( !fpane.hasClass('open') ) {
        fslide.hide();
      }

      fopen.on('click', function() {
        if ( fpane.hasClass('open') ) {
          fpane.removeClass('open');
          fslide.slideUp(400);
        } else {
          fpane.addClass('open');
          fslide.slideDown(400);
        }
        return false;
      });
    });
  });

  var slider = $('#slider'),
      slider_1 = $('#slider_1'),
      slider_2 = $('#slider_2'),
      handle,
      slider_v_1, slider_v_2;

  slider.slider({
    range: true,
    min: 0,
    max: 45000,
    step: 100,
    values: [ 5000, 20000 ],
    slide: function( event, ui ) {
      slider_v_1 = ui.values[0].toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1.');
      slider_v_2 = ui.values[1].toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1.');
      slider_1.val( slider_v_1 );
      slider_2.val( slider_v_2 );
      handle.eq(0).attr('data-value', slider_v_1);
      handle.eq(1).attr('data-value', slider_v_2);
    }
  });

  handle = $('.ui-slider-handle', slider);

  slider_v_1 = slider.slider('values', 0).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1.');
  slider_v_2 = slider.slider('values', 1).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1.');

  slider_1.val( slider_v_1 );
  slider_2.val( slider_v_2 );
  handle.eq(0).attr('data-value', slider_v_1);
  handle.eq(1).attr('data-value', slider_v_2);
};

ms.popups = {
  main: $('html'),
  overlay: $('#popup_overlay'),
  show: function(popup, callback) {
    var popupId = popup.attr('id');
    ms.popups.main.addClass('popup-shown');

    ms.popups.overlay.fadeIn(200, function() {
      popup
        .css({
          opacity: 0
        })
        .addClass('visible')
        .animate({
          opacity: 1
        }, {
          duration: 250,
          complete: function() {
            $('a.popup-caller').filter('[href=#' + popupId + ']').addClass('open');

            if ( $.isFunction(callback) ) {
              callback.apply(this);
            }
          }
        });
    });
  },
  hideAll: function() {
    $('div.popup').filter('.visible').each(function() {
      var that = $(this),
          thatId = that.attr('id');

      ms.popups.hide(that);

      $('a.popup-caller').filter('[href=#' + thatId + ']').removeClass('open');
    });
  },
  hide: function(popup, callback) {
    ms.popups.main.removeClass('popup-shown');

    var popupId = popup.attr('id');

    ms.popups.overlay.fadeOut(200);

    popup
      .animate({
        opacity: 0
      }, {
        duration: 250,
        complete: function() {
          popup.removeClass('visible');

          $('a.popup-caller').filter('[href=#' + popupId + ']').removeClass('open');

          if ( $.isFunction(callback) ) {
            callback.apply(this);
          }
        }
      });
  },
  alert: function(title, content) {
    $('#popup_alert_title').html(title);
    $('#popup_alert_content').html(content);
    ms.popups.show( $('#popup_alert') );
  },
  init: function(el, settings) {
    var options = settings || {},
        popup_callers = $(el);

    if (ms.popups.overlay.length === 0) {
      ms.popups.overlay = $('<div id="popup_overlay"></div>').appendTo( $('body') );
    }

    ms.popups.overlay.css('opacity', .8);

    $(el).each(function() {
      var popup_link = $(this),
          popup = popup_link.attr('href');

      popup = $(popup.substr(popup.indexOf("#")));

      if ( popup.length === 0 ) {
        return;
      }

      popup_link.on('click' + ms.cfg.ns, function() {
        if ( !popup.hasClass('visible') ) {
          ms.popups.hideAll();
          ms.popups.show( popup );
        }

        return false;
      });
    });

    var popup_alert = $('#popup_alert');

    if (popup_alert.length === 0) {
      $('<div id="popup_alert" class="popup"><div class="popup-tab"><div class="popup-cell"><div class="popup-container popup-code popup-alert"><div class="popup-code-inner">'+
        '<div id="popup_alert_title" class="popup-header"></div>'+
        '<div id="popup_alert_content" class="popup-content"></div>'+
      '</div><a href="#" class="popup-close popup-x">x</a></div></div></div></div>').appendTo( $('body') );
    }

    $('a.popup-close, a.popup-x').on('click' + ms.cfg.ns, function() {
      ms.popups.hide( $(this).closest('div.popup') );
      return false;
    });

    $(document).on('click' + ms.cfg.ns + '.pop', function(e) {
      var target = $(e.target);

      if ( !target.hasClass('popup-container') && target.parents('div.popup-container').length === 0 ) {
        ms.popups.hideAll();
      }
    });
  }
};

ms.product = function() {
  $('div.product-img').each(function() {
    var pimg = $(this),
        pimg_img = $('img.product-image', pimg),
        pimg_thumb = $('div.product-thumbs a', pimg);

    pimg_thumb.on('click.th', function() {
      var that = $(this);

      if ( !that.hasClass('current') ) {
        pimg_thumb.removeClass('current');
        that.addClass('current');
        pimg_img.attr('src', that.attr('href'));
      }

      return false;
    });
  });
};

ms.form = function() {
  $('form.validate').each(function() {
    var form = $(this);
    form.validate();
  });
};

ms.rate = function(settings) {
  var settings = settings || {};

  $(settings.el ? settings.el : 'div.fivestar-widget').each(function(){
    if ( !$(this).hasClass('rating-jsized') ) {
      var starsHolder = $(this);

      if ( !starsHolder.hasClass('stars-disabled') ) {
        var starsLi = $('div.star', starsHolder),
            starsInput = $('input', starsHolder);

        if (settings.title) {
          var title = $(settings.title);

          title.attr('data-number', title.text());

          starsLi
            .on('mouseenter', function() {
              var title_text = $(this).find('a').attr('title');

              if (typeof title_text !== 'undefined') {
                title.text(title_text);
              } else {
                title.text('');
              }
            })
            .on('mouseleave', function() {
              title.text( title.attr('data-number') );
            });
        }

        starsHolder
          .on('mouseover', function() {
            starsLi.each(function (_el) {
              var that = $(this);

              if ( that.hasClass('active') ) {
                starsHolder.attr('data-hover', _el);

                that.removeClass('active');
              }

              if ( that.hasClass('active') ) {
                starsHolder.attr('data-active', _el);
                that.removeClass('active');
              }
            });
          })
          .on('mouseout', function() {
            var that = $(this);

            if ( that.attr('data-hover') && !starsLi.eq( that.attr('data-hover') ).hasClass('active') && !that.attr('data-active') ) {
              starsLi.eq( that.attr('data-hover') ).addClass('active');
            }

            if ( that.attr('data-active') && !starsLi.eq( that.attr('data-active') ).hasClass('active') ) {
              starsLi.eq( that.attr('data-active') ).addClass('active');
            }

            return false;
          });

        $('a', starsLi).on('click', function () {
          var that = $(this);

          starsHolder.attr('data-active', starsLi.index(this.parentNode) );

          var vote_id = parseInt( starsHolder.attr('data-active'), 10 );

          starsLi
            .removeClass('on')
            .each(function(i) {
              if ( i <= vote_id ) {
                $(this).addClass('on');
              }
            });

          if ( starsInput.length ) {
            starsInput.val( parseInt( starsHolder.attr('data-active'), 10 ) + 1);
          }

          that.blur();

          if ( settings.parentToAddClass ) {
            starsHolder.closest(settings.parentToAddClass).addClass('voted');
          } else {
            starsHolder.parent().addClass('voted');
          }

          var title = $(settings.title);

          if ( title.length ) {
            vote_id++;
            ms.log(vote_id);
            title.attr('data-number', vote_id);
            title.text( vote_id );
          }

          return false;
        });
      }

      starsHolder.addClass('rating-jsized');
    }
  });
};


ms.init = function() {
  ms.promo.init();
  ms.nav();
  ms.news();
  ms.customForm();
  ms.order();
  ms.filter();
  ms.product();
  ms.popups.init('a.popup-caller');
  ms.form();
  ms.rate({
    el: 'div.fivestar-widget',
    parentToAddClass: 'div.popup-container'
  });

  $('.mask-phone').mask('+7 999 999 99 99');
};

$(ms.init);
