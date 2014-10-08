var ms = window.ms || {};

ms.cfg = ms.cfg || {
  ns: '.ms'
};

ms.log = function(msg) {
  if (typeof window.console !== 'undefined') {
    window.console.log(msg);
  }
};

ms.init = function() {
  $('.mask-phone').mask('+7 999 999 99 99');
};

$(ms.init);
