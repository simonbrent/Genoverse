# Tracks

Genoverse's tracks are responsible for obtaining data from a source (a URL, file, or JavaScript array) and visualizing it in the genome browser.

Tracks are defined in the `Genoverse.Track` namespace. Each track has its own data, set stored in a [`Genoverse.Track.Model`](/docs/tracks/models.md), a method for displaying that data, stored in a [`Genoverse.Track.View`](/docs/tracks/views.md), and a [`Genoverse.Track.Controller`](/docs/tracks/controllers.md) to manage the creation of DOM elements, and user interactions with them. 

Tracks and their MVC components are object-oriented, created using Dean Edward's [Base.js](http://dean.edwards.name/weblog/2006/03/base/) library. This library provides the `extend` function for inheritance, and the ability to call `this.base()` inside any inherited function in order to access it parent's method of the same name, for example:

```javascript
// Adapted from the example on http://dean.edwards.name/weblog/2006/03/base/
var Parent = Base.extend({
  method: function() {
    alert("Hello World!");
  }
});

var Child = Parent.extend({
  method: function() {
    // call the "super" method
    this.base();
    // add some code
    alert("Hello again!");
  }
});

new Child().method();
// ==> Hello World!
// ==> Hello again!
```

## Configuration

The tracks to be used by an instance of Genoverse are defined by the [tracks configuration property](/docs/configuration.md#tracks-default-). This is an array containing either tracks from the [library](/docs/tracks/library.md), or extensions of them or `Genoverse.Track` itself, for example:

```javascript
[
  Genoverse.Track.Scalebar,
  Genoverse.Track.Gene.extend({
    url: 'http://my.website.com/path/to/gene/data?chr=__CHR__&start=__START__&end=__END__'
  }),
  Genoverse.Track.extend({
    id   : 'myTrack',
    name : 'My track',
    url  : 'http://my.website.com/path/to/track/data?chr=__CHR__&start=__START__&end=__END__'
  })
]
```

This would create a genome browser with three tracks - a scalebar, genes from your data source (rather than the default, which is Ensembl's REST API), and a set of rectangles drawn based on start and end coordinates given by `http://my.website.com/path/to/track/data`. 

Track definitions can be extended to inherit or overwrite any functions existing in the `Genoverse.Track`, `Genoverse.Track.Model`, `Genoverse.Track.View` or `Genoverse.Track.Controller` namespaces, without having to know which namespace those functions are in. For example, the `draw` function is located in `Genoverse.Track.View`, but you can create a track which extends it as follows:

```javascript
Genoverse.Track.MyTrack = Genoverse.Track.extend({
  draw: function () {
    // Do my drawing operations

    this.base.apply(this, arguments); // Call the parent function will all the input arguments
  }
});
```

The same is true for non-function properties of the MVC components. This makes it easy to create your own tracks without having to explicitly define their models, views and controllers. It should be noted however that if you want, for example, a reusable view, you will need to create a `Genoverse.Track.View`, at which point it is important to know what properties belong to it.

For more details of the properties and functions which can be extended or overwritten to create new types of tracks, see [here](/docs/tracks/configuration.md).

## Multiple models and views

In addition to its default configuration, a track can also have multiple models and views, which are swapped in and out depending on the size of the region being viewed in the genome browser. These region size configurations are defined using numerical keys whose values are objects of properties to be used at or below those sizes. A good example of this is `Genoverse.Track.Gene`, which is defined as:

```javascript
Genoverse.Track.extend({
  ...
  2000000: { // This one applies when > 2M base-pairs per screen
    labels : false
  },
  100000: { // more than 100K but less then 2M
    labels : true,
    model  : Genoverse.Track.Model.Gene.Ensembl,
    view   : Genoverse.Track.View.Gene.Ensembl
  },
  1: { // > 1 base-pair, but less then 100K
    labels : true,
    model  : Genoverse.Track.Model.Transcript.Ensembl,
    view   : Genoverse.Track.View.Transcript.Ensembl
  }
});
```

In regions between 1 (inclusive) and 100kb (exclusive), transcripts are displayed, with labels. In regions between 100k (inclusive) and 2Mb  (exclusive), genes are displayed with labels. Above 2Mb (inclusive), genes are displayed without labels. Note that the 2Mb configuration does not provide a model or view class - these are copied from the previous (next biggest numerical key, i.e. 100000) configuration. If smaller configurations do not provide model or view classes, the values for `track.model` and `track.view` are used. These default to `Genoverse.Track.Model` and `Genoverse.Track.View`.

Another example would be:

```javascript
Genoverse.Track.extend({
  ...
  bump  : true,
  10000 : false,
  5000  : { bump: false }
});
```

In this case, features in the track are "bumped" - moved vertically within the track so that no features overlap horizontally - between 1 and 4999bp. Between 5000 and 9999bp, the features are not bumped. At 10kb and above, features are not displayed. At all times, the track will use instances of `Genoverse.Track.Model` and `Genoverse.Track.View`. In fact, in this scenario the track has two views - one with bumping, the other without - but only one model, since no model properties are changed between configurations.

## Allowing a user to change a track's configuration

As well as multiple models and views, it is possible to add user controls to tracks, providing the [trackControls plugin](/docs/plugins.md#trackcontrols) is enabled. This plugin provides a pop-out menu on the right side of the track, containing a set of buttons for interacting with the track.

It is possible to prepend additional controls to this menu by defining `controls` and `configSettings` properties for a track. 

The `controls` property should be an array containing elements which are either

- a HTML string including a `"data-control"` attribute that can be made into a [jQuery](http://api.jquery.com/jQuery/#jQuery2) object 
- a jQuery object with a [data](http://api.jquery.com/jQuery.data/) `"control"` value, which will be cloned (data and events bound to the object will be included in the clone)
- an object as follows:
  
  ```javascript
  {
    "type": "select", // A type of DOM node
    "name": "myControl", // Equivalent of data-control attribute
    "options": [ // other types of DOM node can be give, and don't require an options property
      { "value": "typeA", "text": "Type A" },
      { "value": "typeB", "text": "Type B" },
    ]
  }
  ```

In each case, the data-control attribute will be used as keys in the `configSettings` property (below), and the values of the control's option DOM elements will be used as keys within that. Alternatively, for non-select controls, a click handler could be added directly to the control, to perform modifications to the track.

### An example

```javascript
Genoverse.Track.extend({
  data: [
    { chr: 1, start: 1,    end: 1000, type: 'A', subtype: 1, color: 'black'  },
    { chr: 1, start: 2000, end: 3000, type: 'A', subtype: 2, color: 'blue'   },
    { chr: 1, start: 4000, end: 5000, type: 'B', subtype: 2, color: 'orange' },
    { chr: 1, start: 6000, end: 7000, type: 'B', subtype: 1, color: 'purple' }
  ],
  controls: [
    '<select data-control="type">' +
      '<option value="all">All</option>' +
      '<option value="a">Type A only</option>' +
      '<option value="b">Type B only</option>' +
    '</select>',
    '<select data-control="subtype">' +
      '<option value="all">All</option>' +
      '<option value="1">Sub-type 1 only</option>' +
      '<option value="2">Sub-type 2 only</option>' +
    '</select>',
    '<select data-control="colorscheme">' +
      '<option value="default">Default</option>' +
      '<option value="red">All red</option>' +
      '<option value="green">All green</option>' +
    '</select>',
    $('<a title="Change feature height">Squish</a>').on('click', function () {
      var track = $(this).text(function (i, text) { return /Un/.test(text) ? 'Squish' : 'Unsquish'; }).data('track');
      track.setConfig('squish', !track.config.squish);
    })
  ],
  configSettings: {
    type: {
      all : { featureFilter: false },
      a   : { featureFilter: function (feature) { return feature.type == 'A'; } },
      b   : { featureFilter: function (feature) { return feature.type == 'B'; } }
    },
    subtype: {
      all : { featureFilter: false },
      1   : { featureFilter: function (feature) { return feature.subtype == 1; } },
      2   : { featureFilter: function (feature) { return feature.subtype == 2; } }
    },
    colorscheme: {
      default : { beforeDrawFeature: $.noop },
      red     : { beforeDrawFeature: function (f) { f.color = 'red';   } },
      green   : { beforeDrawFeature: function (f) { f.color = 'green'; } }
    },
    squish: {
      true: {
        featureHeight : 2,
        featureMargin : { top: 1, right: 1, bottom: 1, left: 0 },
        labels        : false
      },
      false: {
        featureHeight : 6,
        featureMargin : { top: 2, right: 2, bottom: 2, left: 0 },
        labels        : true
      }
    }
  },
  defaultConfig: {
    type        : 'all',
    subtype     : 'all',
    colorscheme : 'default',
    squish      : false
  }
})
```

This example defines a track with four controls: one to filter features based on their `type` attribute, and a second to filter features based on their `subtype` attribute, a third to change the color used to draw those features, and a fourth to "squish" the features, giving them a smaller height and removing their labels. The `defaultConfig` attribute defines the initial state of those controls. Note that `featureFilter` controls can be combined so that, for example, it is possible to display only those features of type A and subtype 1.
