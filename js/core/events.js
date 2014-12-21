Genoverse.core.events = {
  on: function (events, obj, fn, once) {
    var browser  = this;
    var eventMap = {};
    var i, j, f, fnString, event;

    function makeEventMap(types, handler) {
      types = types.split(' ');

      for (var j = 0; j < types.length; j++) {
        eventMap[types[j]] = (eventMap[types[j]] || []).concat(handler);
      }
    }

    function makeFnString(func) {
      return func.toString();
    }

    function compare(func) {
      f = func.toString();

      for (j = 0; j < fnString.length; j++) {
        if (f === fnString[j]) {
          return true;
        }
      }
    }

    if (typeof events === 'object') {
      for (i in events) {
        makeEventMap(i, events[i]);
      }

      obj = obj || this;
    } else {
      if (typeof fn === 'undefined') {
        fn  = obj;
        obj = this;
      }

      makeEventMap(events, fn);
    }

    var type = obj instanceof Genoverse.Track || obj === 'tracks' ? 'tracks' : 'browser';

    for (i in eventMap) {
      event = i + (once ? '.once' : '');

      browser.events[type][event] = browser.events[type][event] || [];
      fnString = $.map(eventMap[i], makeFnString);

      if (!$.grep(browser.events[type][event], compare).length) {
        browser.events[type][event].push.apply(browser.events[type][event], eventMap[i]);
      }
    }
  },

  once: function (events, obj, fn) {
    this.on(events, obj, fn, true);
  }
};

Genoverse.addEvents = function (obj) {
  obj.functions = obj.functions || {};

  for (var key in obj) {
    if (typeof obj[key] === 'function' && typeof obj[key].ancestor !== 'function' && !obj.functions[key] && !key.match(/^(base|extend|constructor|on|once|prop|before|after$)/)) {
      Genoverse.eventWrapper(key, obj);
    }
  }
};

Genoverse.eventWrapper = function (key, obj) {
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
