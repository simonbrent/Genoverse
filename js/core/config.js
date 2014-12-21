Genoverse.core.config = {
  loadConfig: function () {
    this.defaultTracks = $.extend([], true, this.tracks);

    var config = window[this.storageType].getItem(this.saveKey);

    if (config) {
      config = JSON.parse(config);
    } else {
      return this.addTracks();
    }

    var tracksLibrary = this.tracksLibrary || [];
    var tracks        = [];
    var tracksById    = {};
    var tracksByName  = {};
    var savedConfig   = {};
    var i, prop, track;

    function setConfig(track, conf) {
      for (prop in conf) {
        if (prop === 'config') {
          savedConfig[conf.id] = conf[prop];
        } else {
          track.prototype[prop] = conf[prop];
        }
      }
    }

    for (i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].prototype.id) {
        tracksById[this.tracks[i].prototype.id] = this.tracks[i];
      }
    }

    for (i = 0; i < tracksLibrary.length; i++) {
      if (tracksLibrary[i].prototype.name) {
        tracksByName[tracksLibrary[i].prototype.name] = tracksLibrary[i];
      }
    }

    for (i = 0; i < config.length; i++) {
      track = tracksById[config[i].id];

      if (track) {
        setConfig(track, config[i]);
        track._fromStorage = true;
      } else if (tracksByName[config[i].name]) {
        track = tracksByName[config[i].name];

        this.trackIds = this.trackIds || {};
        this.trackIds[track.prototype.id] = this.trackIds[track.prototype.id] || 1;

        track = track.extend({ id: track.prototype.id + (tracksById[track.prototype.id] ? this.trackIds[track.prototype.id]++ : '') })

        setConfig(track, config[i]);
        tracks.push(track);
      }
    }

    for (i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].prototype.id && !this.tracks[i]._fromStorage) {
        continue;
      }

      tracks.push(this.tracks[i]);
    }

    this.tracks      = tracks;
    this.savedConfig = savedConfig;

    this.addTracks();
  },

  saveConfig: function () {
    if (this._constructing || !this.saveable) {
      return;
    }

    var config = [];

    for (var i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].id) {
        config.push({
          id         : this.tracks[i].id,
          name       : this.tracks[i].name,
          order      : this.tracks[i].order,
          height     : this.tracks[i].height,
          autoHeight : this.tracks[i].autoHeight,
          config     : this.tracks[i].config
        });
      }
    }

    window[this.storageType].setItem(this.saveKey, JSON.stringify(config));
  },

  resetConfig: function () {
    window[this.storageType].removeItem(this.saveKey);

    this._constructing = true;
    this.savedConfig   = {};

    this.removeTracks(this.tracks);
    this.addTracks($.extend([], true, this.defaultTracks));

    this._constructing = false;
  }
};
