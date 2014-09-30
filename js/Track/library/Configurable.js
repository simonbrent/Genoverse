Genoverse.Track.Controller.Configurable = Genoverse.Track.Controller.extend({
  addDomElements: function () {
    var controls      = this.prop('controls');
    var defaultConfig = this.prop('defaultConfig');
    var savedConfig   = this.browser.savedConfig ? this.browser.savedConfig[this.prop('id')] || {} : {};
    var prop;

    for (var i in controls) {
      if (typeof controls[i] === 'string') {
        controls[i] = $(controls[i]);

        // TODO: other control types
        if (controls[i].is('select')) {
          prop = controls[i].data('control');

          controls[i].find('option[value=' + (savedConfig[prop] || defaultConfig[prop]) + ']').attr('selected', true).end().change(function () {
            $(this).data('track').setConfig($(this).data('control'), this.value);
          });
        }
      }
    }

    this.base.apply(this, arguments);
  }
});

Genoverse.Track.Configurable = Genoverse.Track.extend({
  controller     : Genoverse.Track.Controller.Configurable,
  configSettings : {},
  defaultConfig  : {},
  controls       : [],

  setDefaults: function () {
    this.config = this.config || {};

    for (var i in this.defaultConfig) {
      if (typeof this.config[i] === 'undefined') {
        this.config[i] = this.defaultConfig[i];
      }
    }

    this.base();
  },

  setLengthMap: function () {
    var config         = [ true, {} ];
    var featureFilters = [];
    var lengthMap      = { 1: {} };
    var mv             = {};
    var settings, key, i;

    for (i in this.configSettings) {
      settings = $.extend(true, {}, this.getConfig(i));

      if (settings) {
        for (key in settings) { // Find all scale-map like keys
          if (!isNaN(key)) {
            //this[key] = $.extend(true, {}, settings, settings[key]);
            lengthMap[key] = $.extend(lengthMap[key] || {}, settings[key]);
            delete settings[key];
          }

          if (/^(model|view)$/.test(key)) {
            mv[key] = settings[key];
          }
        }

        config.push(settings);

        if (settings.featureFilter) {
          featureFilters.push(settings.featureFilter);
        }
      }
    }

    config = $.extend.apply($, config.concat({ featureFilters: featureFilters }, mv));

    for (i in lengthMap) {
      this[i] = $.extend({}, config, lengthMap[i]);
    }

    this.base();
  },

  setConfig: function (type, config) {
    if (this.configSettings[type][config]) {
      this.config[type] = config;

      var features = this.prop('featuresById');

      for (var i in features) {
        delete features[i].menuEl;
      }
    }

    this.reset();
    this.browser.saveConfig();
  },

  getConfig: function (type) {
    return this.configSettings[type][this.config[type]];
  },

  findFeatures: function () {
    var features = this.base.apply(this, arguments);
    var filters  = this.prop('featureFilters');

    for (var i in filters) {
      features = $.grep(features, filters[i]);
    }

    return features;
  }
});