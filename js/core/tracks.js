Genoverse.core.tracks = {
  onTracks: function () {
    var args = $.extend([], arguments);
    var func = args.shift();
    var mvc;

    for (var i = 0; i < this.tracks.length; i++) {
      if (this.tracks[i].disabled) {
        continue;
      }

      mvc = this.tracks[i]._interface[func];

      if (mvc) {
        this.tracks[i][mvc][func].apply(this.tracks[i][mvc], args);
      } else if (this.tracks[i][func]) {
        this.tracks[i][func].apply(this.tracks[i], args);
      }
    }
  },

  addTrack: function (track, index) {
    return this.addTracks([ track ], index)[0];
  },

  addTracks: function (tracks, index) {
    var defaults = {
      browser : this,
      width   : this.width
    };

    var push = !!tracks;
    var j, config;

    tracks = tracks || $.extend([], this.tracks);
    index  = index  || 0;

    for (var i = 0; i < tracks.length; i++) {
      if (this.savedConfig && this.savedConfig[tracks[i].prototype.id]) {
        defaults.config = this.savedConfig[tracks[i].prototype.id];
      }

      tracks[i] = new tracks[i]($.extend(defaults, { index: i + index }));

      if (tracks[i].id) {
        this.tracksById[tracks[i].id] = tracks[i];
      }

      if (push) {
        this.tracks.push(tracks[i]);

        if (this.scale) {
          tracks[i].controller.setScale(); // scale will only be set for tracks added after initalisation
          tracks[i].controller.makeFirstImage();
        }
      } else {
        this.tracks[i] = tracks[i];
      }
    }

    this.sortTracks();
    this.saveConfig();

    return tracks;
  },

  removeTrack: function (track) {
    this.removeTracks([ track ]);
  },

  removeTracks: function (tracks) {
    var i = tracks.length;
    var track, j;

    while (i--) {
      track = tracks[i];
      j     = this.tracks.length;

      while (j--) {
        if (track === this.tracks[j]) {
          this.tracks.splice(j, 1);
          break;
        }
      }

      if (track.id) {
        delete this.tracksById[track.id];
      }

      track.destructor(); // Destroy DOM elements and track itself
    }

    this.saveConfig();
  },

  sortTracks: function () {
    if ($.grep(this.tracks, function (t) { return typeof t !== 'object'; }).length) {
      return;
    }

    var sorted     = $.extend([], this.tracks).sort(function (a, b) { return a.order - b.order; });
    var labels     = $();
    var containers = $();

    for (var i = 0; i < sorted.length; i++) {
      if (!sorted[i].prop('unsortable')) {
        sorted[i].prop('order', i);
      }

      if (sorted[i].prop('menus').length) {
        sorted[i].prop('top', sorted[i].prop('container').position().top);
      }

      labels.push(sorted[i].prop('label')[0]);
      containers.push(sorted[i].prop('container')[0]);
    }

    this.labelContainer.append(labels);
    this.wrapper.append(containers);

    // Correct the order
    this.tracks = sorted;

    labels.map(function () { return $(this).data('track'); }).each(function () {
      if (this.prop('menus').length) {
        var diff = this.prop('container').position().top - this.prop('top');
        this.prop('menus').css('top', function (i, top) { return parseInt(top, 10) + diff; });
        this.prop('top', null);
      }
    });

    sorted = labels = containers = null;
  },

  updateTrackOrder: function (e, ui) {
    var track = ui.item.data('track');
    var prev  = ui.item.prev().data('track');
    var next  = ui.item.next().data('track');
    var p     = prev ? prev.prop('order') : 0;
    var n     = next ? next.prop('order') : 0;
    var o     = p || n;
    var order;

    if (prev && next && Math.floor(n) === Math.floor(p)) {
      order = p + (n - p) / 2;
    } else {
      order = o + (p ? 1 : -1) * Math.abs(Math.round(o) - o || 1) / 2;
    }

    track.prop('order', order);

    this.sortTracks();
    this.saveConfig();
  },

  checkTrackHeights: function () {
    if (this.dragging) {
      return;
    }

    this.onTracks('checkHeight');
  },

  resetTrackHeights: function () {
    this.onTracks('resetHeight');
  }
};
