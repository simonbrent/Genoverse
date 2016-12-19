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
