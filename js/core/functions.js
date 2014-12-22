Genoverse.wrapFunctions = function (obj) {
  obj.functions = obj.functions || {};

  for (var key in obj) {
    if (typeof obj[key] === 'function' && typeof obj[key].ancestor !== 'function' && !obj.functions[key] && !key.match(/^(base|extend|constructor|on|once|prop|before|after$)/)) {
      Genoverse.functionWrapper(key, obj);
    }
  }
};

Genoverse.functionWrapper = function (key, obj) {
  var func      = key.substring(0, 1).toUpperCase() + key.substring(1);
  var isBrowser = obj instanceof Genoverse;
  var mainObj   = isBrowser || obj instanceof Genoverse.Track ? obj : obj.track;
  var events    = isBrowser ? obj.events.browser : obj.browser.events.tracks;

  obj.functions[key] = obj[key];

  obj[key] = function () {
    var args = [].slice.call(arguments);
    var rtn;

    function trigger(when) {
      var once  = events[when + func + '.once'] || [];
      var funcs = (events[when + func] || []).concat(once, typeof mainObj[when + func] === 'function' ? mainObj[when + func] : []);

      if (once.length) {
        delete events[when + func + '.once'];
      }

      for (var i = 0; i < funcs.length; i++) {
        funcs[i].apply(this, args);
      }
    }

    trigger.call(this, 'before');
    rtn = this.functions[key].apply(this, args);
    trigger.call(this, 'after');

    return rtn;
  };
};
