# Track configuration

The following are properties for `Genoverse.Track` and its MVC components. These can be overwritten to customize the way tracks get data and display it in the browser.

## Track display, resizing, and reordering

#### name (default `undefined`)
> The name of the track, which appears in its label on the left of the genome browser

#### height (default `12`)
> The initial height in pixels of the DOM element containing the track

#### resizable (default `true`)
> Determines whether the track's height can changed. Can be:
>
> - `true` - the user can resize the track
> - `false` - the track cannot be resized
> - `"auto"` - the track will automatically resize to show all features, but the user cannot resize it themselves

#### autoHeight (default `undefined`)
> Determines whether the track automatically resize so that all the features are visible. Can be:
>
> - `true` - identical to `resizable = "auto"`, above
> - `false` - the track will not automatically resize
> - `undefined` - the track will use [`genoverse.trackAutoHeight`](/docs/configuration.md#trackautoheight-default-false) to set `track.autoHeight`

#### hideEmpty (default `undefined`)
> If the track automatically resizes, determines whether should it be hidden when there are no features. Can be:
>
> - `true` - the track will be hidden if there are no features in view
> - `false` - the track will be displayed if there are no features in view 
> - `undefined` - the track will use [`genoverse.hideEmptyTracks`](/docs/configuration.md#hideemptytracks-default-true) to set `track.hideEmpty`

#### invert (default `false`)
> If `true`, features are drawn from bottom of the track image, up, rather than from the top, down. This can be used to draw, for example, histograms with rising bars. The inversion is actually achieved by performing a CSS transform on the track's image container DOM element, rather than by performing different logic when positioning the features for drawing.

#### margin (default `2`)
> The whitespace in pixels between this track and the one below it in the genome browser. This will appear as extra pixels in height at the bottom of the track.

#### border (default `true`)
> If `true`, the track will have a 1px grey bottom border

#### unsortable (default `false`)
> If `true`, the track cannot be moved by the user. If `false`, a drag handle will appear next to the track's name, allowing the user to change its vertical position within the genome browser.

#### fixedOrder (default `false`)
> If `true`, the track cannot be moved at all. Use for tracks which allways need to go at the top or bottom.

#### legend (default `false`)
> Determines whether a legend will be added to the track, and what class that legend will use. Can be:
>
> - `true` - A `Genoverse.Track.Legend`
> - `false` - No legend
> - An extension of `Genoverse.Track.Legend`, i.e. `Genoverse.Track.Legend.extend({ ... legend config ... })`
> - A child class of `Genoverse.Track.Legend`, e.g. `Genoverse.Track.Legend.MyLegendClass`

#### children (default `undefined`)
> Determines whether a track will have child tracks, which are located in the same DOM element as their parent. Can be:
>
> - An extension of `Genoverse.Track`, i.e. `Genoverse.Track.extend({ ... config ... })`
> - An array of extensions of `Genoverse.Track`
>
> Legend can be child tracks, but if they are provided as such, the `legend` property should not be set.
> 
> Note: Multiple levels of children (i.e. a child track with children) is not supported.

## Fetching data

#### url (default `undefined`)
> The URL template used to fetch data from a server. Can contain placeholders for `__ASSEMBLY__`, `__CHR__`, `__START__`, and `__END__`, for example 
> ```
> http://my.website.com/__ASSEMBLY__/path/to/track/data?chr=__CHR__&start=__START__&end=__END__
> ```
> These placeholders will be replaces with [`genoverse.assembly`](/docs/configuration.md#assembly-default-undefined), `genoverse.chr`, and the start and end for the request respectively, before data is fetched from the server.

#### urlParams (default `undefined`)
> An object of query parameters to be added to each request for data, for example:
> ```
> url: "http://my.website.com/data?chr=__CHR__&start=__START__&end=__END__",
> urlParams: { "foo": "bar" }
> ```
> will result in a URL like `http://my.website.com/data?chr=1&start=1&end=10000&foo=bar`

#### data (default `undefined`)
> Will be used instead of fetching data from a source, if defined as an array of objects (these objects should fulfill the requirements of a Genoverse **feature**). `track.url` is not required if `track.data` is supplied.

#### allData (default `false`)
> If `true`, the initial request for data is assumed to contain all the track's data for the current chromosome. No subsequent requests will be made as the user navigates the genome.

#### dataRequestLimit (default `undefined`)
> The maximum region size to request data for, if any. If defined as a number, multiple [jQuery.ajax](http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings) requests will be made to get data for a region size which exceeds its value.

#### dataType (default `"json"`)
> The dataType setting to be used in the [jQuery.ajax](http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings) requests to get data for the track

#### xhrFields (default `undefined`)
> The xhrFields setting to be used in the [jQuery.ajax](http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings) requests to get data for the track

## Drawing features

#### featureHeight (default `undefined`)
> The height of each feature, if `feature.height` is not set. If `undefined`,  will be set to `track.height`

#### featureMargin (default `{ top: 3, right: 1, bottom: 1, left: 0 }`)
> The space in pixels around each feature, used when positioning the feature on the canvas, and for bumping (below). If any property is left undefined, it will default to 0. Top and right margins can be overwritten for individual features using `feature.marginTop` and `feature.marginRight`. To draw features that should touch each other (e.g. bases of sequence), `featureMargin` should be set to `{ top: 0, right: 0, bottom: 0, left: 0 }`.

#### color (default `"#000000"`)
> The color for each features, if `feature.color` is not set

#### fontColor (default `undefined`)
> The default color for feature labels. If `undefined`, a feature's label color will be `feature.color`, or `track.color` (above), in that order of precedence.

#### fontWeight (default ` "normal"`)
> Combined with `fontHeight` and `fontFamily` to set the font for the canvas element used to draw the track's features

#### fontHeight (default `10`)
> Combined with `fontWeight` and `fontFamily` to set the font for the canvas element used to draw the track's features. Value is given in pixels.

#### fontFamily (default `"sans-serif"`)
> Combined with `fontHeight` and `fontWeight` to set the font for the canvas element used to draw the track's features

#### labels (default `true`)
> Determines how feature labels are drawn. Can be:
> 
> - `true` - display a feature's label directly below the feature, at the start of the feature
> - `"overlay"` - display a feature's label within the feature, if the feature is wide enough to contain the label, in the center of the feature
> - `"separate"` - display all features' labels on a separate canvas, below all of the features, in line with the start of their feature. Labels will be bumped (see below) to ensure they are all visible.
> - `false` - do not display feature labels

#### repeatLabels (default `false`)
> If `true`, a feature's label is repeated along the length of the feature, such that an instance of the label will always be in view

#### bump (default `false`)
> Determines whether features are moved vertically within the track so that the do not overlap horizontally. Can be:
> 
> - `true` - features are moved vertically
> - `false` - features are not moved vertically, and can overlap
> - `"labels"` - features are not moved vertically, but if `track.labels === true`, `track.labels` is set to `"separate"`, so labels can be bumped while features are not

#### depth (default `undefined`)
> If set to an integer, this is the maximum bumping depth for features in the track. Features which need to be moved vertically to beyond this depth (e.g. if depth = 2 and three features have the same start and end) will not be drawn.

#### subFeatureJoinStyle (default `false`)
> For features with a `subFeatures` property, determines what method is used to join these sub-features together. Can be:
> 
> - `"line"` - sub-features are joined by a horizontal line
> - `"peak"` - sub-features are joined by a peak (diagonal line up, diagonal line down)
> - `"curve"` - sub-features are joined by a quadratic curve
> - `false` - sub-features are not joined

In the case of `"peak"` and `"curve"`, the highest point of the join is mid-way between the end of one sub-feature and the start of the next. If the `feature.strand == -1`, the peak/curve will go down (a trough) instead of up.

Sub-feature join lines are only drawn for pairs of sub-features where `subFeature1.end != subFeature2.start`.

#### subFeatureJoinLineWidth (default `0.5`)

The canvas `lineWidth` value used when drawing sub-feature join lines.

#### threshold (default `Infinity`)
> The integer size of region above which the track's features are not drawn. Synonymous with `[numerical key]: false` ([see here](/docs/tracks.md#multiple-models-and-views)), such that 
> ```
> Genoverse.Track.extend({ threshold: 100000 })
> ``` 
> and 
> ```
> Genoverse.Track.extend({ 100000: false })
> ```
> have the same effect.

## Interacting with features

#### clickTolerance (default `0`)
> Pixels of tolerance added to a click position when finding features for popup menus, when scale < 1. Increase to make it easier to click on small features (e.g. 1bp variants) when looking at large regions, at the cost of possibly showing feature menus for more features than expected.

## Changing track settings

#### configSettings (default `undefined`)
> An object defining properties of the track (including its models, views, and controller) which can be changed after initialization, as follows:
> ```javascript
> {
>   example1: {
>     config1: { property1: "a", property2: "b", function1: function () { ... }, ... },
>     config2: { property1: "x", property2: "y", function1: function () { ... }, ... }
>   },
>   example2: {
>     config1: { property3: "a", property4: "b", function2: function () { ... }, ... },
>     config2: { property3: "x", property4: "y", function2: function () { ... }, ... }
>   }
> }
> ```
> See [`track.setConfig`](/docs/tracks/api.md#tracksetconfigconfig) for details of how to change between different settings.

#### defaultConfig (default `undefined`)
> An object defining which `configSettings` are used on track initialization, in the form:
> ```javascript
> { example1: "config1", example2: "config2" }
> ```
> __Required__ when `configSettings` is provided.

#### controls (default `undefined`)
> An array providing users with the ability to change the track's configuration, providing the [trackControls plugin](/docs/plugins.md#trackcontrols) is enabled. 
> The elements of the array can be:
>
> - a HTML string including a `"data-control"` attribute that can be made into a [jQuery](http://api.jquery.com/jQuery/#jQuery2) object 
> - a jQuery object with a [data](http://api.jquery.com/jQuery.data/) `"control"` value, which will be cloned (data and events bound to the object will be included in the clone)
> - an object as follows:
>  
>    ```javascript
>    {
>      "type": "select", // A type of DOM node
>      "name": "example1", // Equivalent of data-control attribute
>      "options": [ // other types of DOM node can be give, and don't require an options property
>        { "value": "config1", "text": "Config 1" },
>        { "value": "config2", "text": "Config 2" },
>      ]
>    }
>    ```
> 
> In each case, the data-control attribute will be used as keys in the `configSettings` property (above), and the values of the control's option DOM elements will be used as keys within that. Alternatively, for non-select controls, a click handler could be added directly to the control, to perform modifications to the track.
>

[See here](/docs/tracks.md#allowing-a-user-to-change-a-tracks-configuration) for more information about track configurations.
