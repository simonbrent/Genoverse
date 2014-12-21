Genoverse.core.menus = {
  menuTemplate: $(
    '<div class="gv-menu">'                           +
      '<div class="gv-close gv-menu-button">x</div>'  +
      '<div class="gv-menu-content">'                 +
        '<div class="gv-title"></div>'                +
        '<a class="gv-focus" href="#">Focus here</a>' +
        '<table></table>'                             +
      '</div>'                                        +
    '</div>'
  ).on('click', function (e) {
    if ($(e.target).hasClass('gv-close')) {
      $(this).fadeOut('fast', function () {
        var data = $(this).data();

        if (data.track) {
          data.track.prop('menus', data.track.prop('menus').not(this));
        }

        data.browser.menus = data.browser.menus.not(this);
      });
    }
  }),

  makeMenu: function (feature, event, track) {
    if (!feature.menuEl) {
      var browser = this;
      var menu    = this.menuTemplate.clone(true).data('browser', this);
      var content = $('.gv-menu-content', menu).remove();
      var i, table, el, start, end, key, width, tdWidth;

      function focus() {
        var data    = $(this).data();
        var length  = data.end - data.start + 1;
        var context = Math.max(Math.round(length / 4), 25);

        browser.moveTo(data.start - context, data.end + context, true);

        return false;
      }

      $.when(track ? track.controller.populateMenu(feature) : feature).done(function (properties) {
        if (Object.prototype.toString.call(properties) !== '[object Array]') {
          properties = [ properties ];
        }

        for (i = 0; i < properties.length; i++) {
          table = '';
          el    = content.clone().appendTo(menu);
          start = parseInt(typeof properties[i].start !== 'undefined' ? properties[i].start : feature.start, 10);
          end   = parseInt(typeof properties[i].end   !== 'undefined' ? properties[i].end   : feature.end,   10);

          $('.gv-title', el)[properties[i].title ? 'html' : 'remove'](properties[i].title);

          if (track && start && end && !browser.isStatic) {
            $('.gv-focus', el).data({ start: start, end: Math.max(end, start) }).on('click', focus);
          } else {
            $('.gv-focus', el).remove();
          }

          for (key in properties[i]) {
            if (/^start|end$/.test(key) && properties[i][key] === false) {
              continue;
            }

            if (key !== 'title') {
              table += '<tr><td>' + key + '</td><td>' + properties[i][key] + '</td></tr>';
            }
          }

          $('table', el).html(table);
        }
      });

      if (track) {
        menu.addClass(track.id).data('track', track);
      }

      feature.menuEl = menu.appendTo(this.superContainer || this.container);

      $('.gv-menu-content', menu).each(function () {
        tdWidth = $('td:first', this).outerWidth();

        $('.gv-title', this).width(function (i, w) {
          width = Math.max(w, tdWidth);

          if (width === w) {
            $(this).addClass('gv-block');
            return 'auto';
          }

          return width;
        });
      });
    }

    this.menus = this.menus.add(feature.menuEl);

    if (track) {
      track.prop('menus', track.prop('menus').add(feature.menuEl));
    }

    feature.menuEl.show(); // Must show before positioning, else position will be wrong

    if (event) {
      feature.menuEl.css({ left: 0, top: 0 }).position({ of: event, my: 'left top', collision: 'flipfit' });
    }

    return feature.menuEl;
  },

  closeMenus: function (obj) {
    obj = obj || this;

    obj.menus.filter(':visible').children('.gv-close').trigger('click');
    obj.menus = $();
  }
};
