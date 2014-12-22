var $         = jQuery; // Make sure we have local $ (this is for combined script in a function)
var Genoverse = Base.extend({
  // Defaults
  urlParamTemplate   : 'r=__CHR__:__START__-__END__', // Overwrite this for your URL style
  width              : 1000,
  longestLabel       : 30,
  defaultLength      : 5000,
  defaultScrollDelta : 100,
  tracks             : [],
  plugins            : [],
  dragAction         : 'scroll',         // options are: scroll, select, off
  wheelAction        : 'off',            // options are: zoom, off
  isStatic           : false,            // if true, will stop drag, select and zoom actions occurring
  saveable           : false,            // if true, track configuration and ordering will be saved in sessionStorage/localStorage
  saveKey            : '',               // default key for sessionStorage/localStorage configuration is 'genoverse'. saveKey will be appended to this if it is set
  storageType        : 'sessionStorage', // set to localStorage for permanence
  genome             : undefined,
  useHash            : undefined,
  autoHideMessages   : true,
  trackAutoHeight    : false,

  // Default coordinates for initial view, overwrite in your config
  chr   : 1,
  start : 1,
  end   : 1000000,

  constructor: function (config) {
    var browser = this;

    for (var i in Genoverse.core) {
      $.extend(this, Genoverse.core[i]);
    }

    if (!this.supported()) {
      return this.die('Your browser does not support this functionality');
    }

    config.container = $(config.container); // Make sure container is a jquery object, jquery recognises itself automatically

    if (!(config.container && config.container.length)) {
      config.container = $('<div id="genoverse">').appendTo('body');
    }

    $.extend(this, config);

    this.events = { browser: {}, tracks: {} };

    $.when(this.loadGenome(), this.loadPlugins()).always(function () {
      Genoverse.wrapFunctions(browser);
      browser.init();
    });
  },

  loadGenome: function () {
    if (typeof this.genome === 'string') {
      var genomeName = this.genome;

      return $.ajax({
        url      : this.origin + 'js/genomes/' + genomeName + '.js',
        dataType : 'script',
        context  : this,
        success  : function () {
          try {
            this.genome = eval(genomeName);
          } catch (e) {
            console.log(e);
            this.die('Unable to load genome ' + genomeName);
          }
        }
      });
    }
  },

  loadPlugins: function () {
    var browser         = this;
    var loadPluginsTask = $.Deferred();

    function loadPlugin(plugin) {
      if (typeof Genoverse.Plugins[plugin] === 'function') {
        Genoverse.Plugins[plugin].call(browser);
        return true;
      }
    }

    function getScript(deferred, plugin) {
      $.getScript(browser.origin + 'js/plugins/' + plugin + '.js', function () {
        deferred.resolve.apply(deferred, [].slice.call(arguments).concat(plugin));
      });
    }

    // Load plugins css file
    $.when.apply($, $.map(browser.plugins, function (plugin) {
      if (loadPlugin(plugin)) {
        return undefined;
      }

      var deferred = $.Deferred();

      if ($('link[href="' + browser.origin + 'css/' + plugin + '.css"]').length) {
        getScript(deferred, plugin);
      } else {
        $('<link href="' + browser.origin + 'css/' + plugin + '.css" rel="stylesheet">').on('load', function () { getScript(deferred, plugin); }).appendTo('body');
      }

      return deferred;
    })).done(function () {
      var scripts = browser.plugins.length === 1 ? [ arguments ] : arguments;
      var plugin;

      for (var i = 0; i < scripts.length; i++) {
        plugin = scripts[i][scripts[i].length - 1];

        try {
          eval(scripts[i][0]);
          loadPlugin(plugin);
        } catch (e) {
          console.log('Error evaluating plugin script "' + plugin + ': "' + e);
          console.log(scripts[i][0]);
        }
      }
    }).always(loadPluginsTask.resolve);

    return loadPluginsTask;
  },

  init: function () {
    var width = this.width;

    this.addDomElements(width);
    this.addUserEventHandlers();

    if (this.isStatic) {
      this.dragAction       = this.wheelAction = 'off';
      this.urlParamTemplate = false;
    }

    this.tracksById       = {};
    this.prev             = {};
    this.saveKey          = this.saveKey ? 'genoverse-' + this.saveKey : 'genoverse';
    this.urlParamTemplate = this.urlParamTemplate || '';
    this.useHash          = typeof this.useHash === 'boolean' ? this.useHash : typeof window.history.pushState !== 'function';
    this.textWidth        = document.createElement('canvas').getContext('2d').measureText('W').width;
    this.labelWidth       = this.labelContainer.outerWidth(true);
    this.width           -= this.labelWidth;
    this.paramRegex       = this.urlParamTemplate ? new RegExp('([?&;])' + this.urlParamTemplate
      .replace(/(\b(\w+=)?__CHR__(.)?)/,   '$2([\\w\\.]+)$3')
      .replace(/(\b(\w+=)?__START__(.)?)/, '$2(\\d+)$3')
      .replace(/(\b(\w+=)?__END__(.)?)/,   '$2(\\d+)$3') + '([;&])'
    ) : '';

    var urlCoords = this.getURLCoords();
    var coords    = urlCoords.chr && urlCoords.start && urlCoords.end ? urlCoords : { chr: this.chr, start: this.start, end: this.end };

    this.chr = coords.chr;

    if (this.genome && !this.chromosomeSize) {
      this.chromosomeSize = this.genome[this.chr].size;
    }

    if (this.saveable) {
      this.loadConfig();
    } else {
      this.addTracks();
    }

    this.setRange(coords.start, coords.end);
  },

  reset: function () {
    this.onTracks('reset');
    this.scale = 9e99; // arbitrary value so that setScale resets track scales as well
    this.setRange(this.start, this.end);
  },

  supported: function () {
    var el = document.createElement('canvas');
    return !!(el.getContext && el.getContext('2d'));
  },

  die: function (error, el) {
    if (el && el.length) {
      el.html(error);
    } else {
      alert(error);
    }

    this.failed = true;
  },

  addDomElements: function (width) {
    var browser = this;

    this.menus          = $();
    this.labelContainer = $('<ul class="gv-label-container">').appendTo(this.container).sortable({
      items  : 'li:not(.gv-unsortable)',
      handle : '.gv-handle',
      axis   : 'y',
      helper : 'clone',
      cursor : 'move',
      update : $.proxy(this.updateTrackOrder, this),
      start  : function (e, ui) {
        ui.placeholder.css({ height: ui.item.height(), visibility: 'visible' }).html(ui.item.html());
        ui.helper.hide();
      }
    });

    this.wrapper  = $('<div class="gv-wrapper">').appendTo(this.container);
    this.selector = $('<div class="gv-selector gv-crosshair">').appendTo(this.wrapper);

    this.selectorControls = this.zoomInHighlight = this.zoomOutHighlight = $();

    this.container.addClass('gv-canvas-container').width(width);

    if (!this.isStatic) {
      this.selectorControls = $(
        '<div class="gv-selector-controls">'                +
        '  <button class="gv-zoom-here">Zoom here</button>' +
        '  <button class="gv-center">Center</button>'       +
        '  <button class="gv-cancel">Cancel</button>'       +
        '</div>'
      ).appendTo(this.selector);

      this.zoomInHighlight = $(
        '<div class="gv-canvas-zoom gv-i">' +
        '  <div class="gv-t gv-l gv-h"></div>' +
        '  <div class="gv-t gv-r gv-h"></div>' +
        '  <div class="gv-t gv-l gv-v"></div>' +
        '  <div class="gv-t gv-r gv-v"></div>' +
        '  <div class="gv-b gv-l gv-h"></div>' +
        '  <div class="gv-b gv-r gv-h"></div>' +
        '  <div class="gv-b gv-l gv-v"></div>' +
        '  <div class="gv-b gv-r gv-v"></div>' +
        '</div>'
      ).appendTo('body');

      this.zoomOutHighlight = this.zoomInHighlight.clone().toggleClass('gv-i gv-o').appendTo('body');
    }
  },

  setWidth: function (width) {
    this.width  = width;
    this.width -= this.labelWidth;

    this.container.width(width);
    this.onTracks('setWidth', this.width);
    this.reset();
  },

  hideMessages: function () {
    if (this.autoHideMessages) {
      this.wrapper.find('.gv-message-container').addClass('gv-collapsed');
    }
  }
}, {
  core    : {},
  Plugins : {}
});

Genoverse.prototype.origin = ($('script[src]:last').attr('src').match(/(.*)js\/\w+/) || [])[1];

$(function () {
  if (!$('link[href="' + Genoverse.prototype.origin + 'css/genoverse.css"]').length) {
    $('<link href="' + Genoverse.prototype.origin + 'css/genoverse.css" rel="stylesheet">').appendTo('body');
  }
});

window.Genoverse = Genoverse;
