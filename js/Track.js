Genoverse.Track = Base.extend({
  height     : 12,        // The height of the track_container div
  margin     : 2,         // The spacing between this track and the next
  resizable  : true,      // Is the track resizable - can be true, false or 'auto'. Auto means the track will automatically resize to show all features, but the user cannot resize it themselves.
  border     : true,      // Does the track have a bottom border
  unsortable : false,     // Is the track unsortable
  name       : undefined, // The name of the track, which appears in its label
  autoHeight : undefined, // Does the track automatically resize so that all the features are visible
  hideEmpty  : undefined, // If the track automatically resizes, should it be hidden when there are no features, or should an empty track still be shown

  constructor: function (config) {
    if (this.stranded || config.stranded) {
      this.controller = this.controller || Genoverse.Track.Controller.Stranded;
      this.model      = this.model      || Genoverse.Track.Model.Stranded;
    }

    this.setInterface();
    this.extend(config);
    this.setDefaults();
    this.setProperties();
    this.setEvents();

    Genoverse.wrapFunctions(this);
  },

  setInterface: function () {
    var mvc   = [ 'Controller', 'Model', 'View', 'controller', 'model', 'view' ];
    var proto = Genoverse.Track.prototype;
    var prop;

    this._functions  = { controller: {}, model: {}, view: {} };
    this._properties = { controller: {}, model: {}, view: {} };
    this._interface  = {};
    this._defaults   = {};

    for (var i = 0; i < 3; i++) {
      for (prop in Genoverse.Track[mvc[i]].prototype) {
        if (typeof proto[prop] === 'undefined') {
          this._interface[prop] = mvc[i + 3];

          if (this[prop]) {
            this[typeof this[prop] === 'function' ? '_functions' : '_properties'][this._interface[prop]][prop] = this[prop];
          }
        }
      }
    }

    for (i in this._functions) {
      this._functions[i].prop = $.proxy(this.prop, this);
    }
  },

  setDefaults: function () {
    this.order             = this.strand === -1 && this.orderReverse ? this.orderReverse : typeof this.order !== 'undefined' ? this.order : this.index;
    this.defaultHeight     = this.height;
    this.defaultAutoHeight = this.autoHeight;
    this.autoHeight        = typeof this.autoHeight !== 'undefined' ? this.autoHeight : this.browser.trackAutoHeight;
    this.hideEmpty         = typeof this.hideEmpty  !== 'undefined' ? this.hideEmpty  : this.browser.hideEmptyTracks;
    this.height           += this.margin;
    this.initialHeight     = this.height;

    if (this.resizable === 'auto') {
      this.autoHeight = true;
    }
  },

  setProperties: function () {
    var defaults   = {};
    var properties = {}
    var lengthMap  = [];
    var value, model, view, j;

    this.models = {};
    this.views  = {};

    for (var key in this) {
      if (/^(model|view|controller)$/.test(key)) {
        defaults[key] = this[key];
        delete this[key];
      } else if (!isNaN(key)) { // Find all scale-map like keys
        key   = parseInt(key, 10);
        value = this[key];
        delete this[key];

        if (value === false) {
          properties.threshold = key;
        } else {
          lengthMap.push([ key, value ]);
        }
      }
    }

    if (this.lengthMap) {
      lengthMap.push(this.lengthMap[0]); // Add the -1 defaults to the new length map
    } else {
      this.controller = this.newMVC('Controller', defaults.controller, properties);

      delete defaults.controller;

      // Ensure that there's always at least one item in the lengthMap array
      lengthMap.push([ -1, defaults ]);
    }

    lengthMap = lengthMap.sort(function (a, b) { return b[0] - a[0]; });

    for (var i = 0; i < lengthMap.length; i++) {
      model      = lengthMap[i][1].model;
      view       = lengthMap[i][1].view;
      properties = {};

      // Find properties of the length setting that are related to the view or model, and assign them accordingly so that they are used
      if (lengthMap[i][0] !== -1) {
        for (j in lengthMap[i][1]) {
          if (this._interface[j]) {
            properties[this._interface[j]]    = properties[this._interface[j]] || {};
            properties[this._interface[j]][j] = lengthMap[i][1][j];
          }
        }
      }

      // If the length setting is missing a model or view, use the next model or view found by looking at decreasing sizes of length settings
      if (!(model && view)) {
        for (j = i + 1; j < lengthMap.length; j++) {
          model = model || lengthMap[j][1].model;
          view  = view  || lengthMap[j][1].view;

          if (model && view) {
            break;
          }
        }
      }

      // FIXME: Makes new models/views when resetting, even when not necessary
      this.models[lengthMap[i][0]] = this.newMVC('Model', model, properties.model);
      this.views[lengthMap[i][0]]  = this.newMVC('View',  view,  properties.view);
    }

    this.lengthMap = lengthMap;
  },

  setEvents: $.noop,

  setLengthProperties: function () {
    var settings = this.getSettingsForLength();
    var i;

    if (settings.length) {
      this.model = this.controller.model = this.models[settings[0]];
      this.view  = this.controller.view  = this.views[settings[0]];

      for (i in settings[1]) {
        if (!this._interface[i] && !/^(model|view|controller)$/.test(i)) {
          if (typeof this._defaults[i] === 'undefined') {
            this._defaults[i] = this[i];
          }

          this[i] = settings[1][i];
        }
      }

      for (i in this._defaults) {
        if (typeof settings[1][i] === 'undefined') {
          this[i] = this._defaults[i];
        }
      }
    }
  },

  getSettingsForLength: function () {
    for (var i = 0; i < this.lengthMap.length; i++) {
      if (this.browser.length > this.lengthMap[i][0] || this.browser.length === 1 && this.lengthMap[i][0] === 1) {
        return this.lengthMap[i];
      }
    }

    return [];
  },

  newMVC: function (type, object, properties) {
    object = (object || Genoverse.Track[type]).extend(this._functions[type.toLowerCase()]);

    return new object($.extend({
      browser : this.browser,
      width   : this.width,
      index   : this.index,
      track   : this
    }, this._properties[type.toLowerCase()], properties));
  },

  prop: function (key, value) {
    var mvc = [ 'controller', 'model', 'view' ];
    var obj;

    if (this._interface[key]) {
      obj = this[this._interface[key]];
    } else {
      for (var i = 0; i < 3; i++) {
        if (this[mvc[i]] && typeof this[mvc[i]][key] !== 'undefined') {
          obj = this[mvc[i]];
          break;
        }
      }

      obj = obj || this;
    }

    if (typeof value !== 'undefined') {
      if (value === null) {
        delete obj[key];
      } else {
        obj[key] = value;
      }
    }

    return obj ? obj[key] : undefined;
  },

  setHeight: function (height, forceShow) {
    if (this.disabled || (forceShow !== true && height < this.prop('featureHeight')) || (this.prop('threshold') && !this.prop('thresholdMessage') && this.browser.length > this.prop('threshold'))) {
      height = 0;
    } else {
      height = Math.max(height, this.prop('minLabelHeight'));
    }

    this.height = height;

    return height;
  },

  resetHeight: function () {
    if (this.resizable === true) {
      var resizer = this.prop('resizer');

      this.autoHeight = !!([ this.defaultAutoHeight, this.browser.trackAutoHeight ].sort(function (a, b) {
        return (typeof a !== 'undefined' && a !== null ? 0 : 1) - (typeof b !== 'undefined' && b !== null ?  0 : 1);
      })[0]);

      this.controller.resize(this.autoHeight ? this.prop('fullVisibleHeight') : this.defaultHeight + this.margin + (resizer ? resizer.height() : 0));
      this.initialHeight = this.height;
    }
  },

  enable: function () {
    if (this.disabled === true) {
      this.disabled = false;
      this.controller.resize(this.initialHeight);
      this.reset();
    }
  },

  disable: function () {
    if (!this.disabled) {
      this.disabled = true;
      this.controller.resize(0);
    }
  },

  reset: function () {
    if (this.prop('url') !== false) {
      this.model.init(true);
    }

    this.view.init();
    this.setProperties();
    this.controller.reset.apply(this.controller, arguments);
  },

  remove: function () {
    this.browser.removeTrack(this);
  },

  destructor: function () {
    this.controller.destroy();

    var objs = [ this.view, this.model, this.controller, this ];

    for (var obj in objs) {
      for (var key in obj) {
        delete obj[key];
      }
    }
  }
});
