# Configuration

Genoverse has a large number of configurable properties, in order to allow customization. A basic example with two tracks (a scalebar and some genes) and no plugins would be

```js
var genoverse = new Genoverse({ 
  genome: 'grch38', 
  tracks: [ Genoverse.Track.Scalebar, Genoverse.Track.Gene ] 
});
```

The following properties can be provided to the constructor for Genoverse:

### DOM element

#### container  (default `undefined`)
> A DOM node, jQuery selector, or string to create a jQuery selector (e.g. `"#genoverse"`) inside which the instance of Genoverse will be created. 
If `undefined`, a `<div>` element will be appended to `document.body`.

#### width (default `1000`)
> The width that the `container` DOM element will be

### Genomic coordinates

#### chr (default `1`)
> A string or number defining the initial chromosome to display

#### start (default `1`)
> A string or number defining the initial start position

#### end (default `1000000`)
> A string or number defining the initial end position

#### genome (default `undefined`)
> The genome to be used. Can be:
>
>  - an object with keys of the number/letter/name of the chromosomes, and values in the form `{ "size": 10000 }`. 
>  Additionally an array of bands can be supplied for each chromosome for drawing purposes - see [js/genomes/grch38.js](https://github.com/wtsi-web/Genoverse/blob/gh-pages/js/genomes/grch38.js) for an example.
>  - a string (e.g. `"grch38"`) which will be used to obtain a javascript file from the [js/genomes](https://github.com/wtsi-web/Genoverse/tree/gh-pages/js/genomes) directory
>  - `undefined`, in which case `chromosomeSize` **MUST** be set (see below)

#### chromosomeSize (default `undefined`)
> If `genome` not is provided, `chromosomeSize` **MUST** be set to the length of the chromosome. 
>
> If `genome` is provided, `chromosomeSize` will be set to the chromosome's `size` property, as defined by the genome object.

### What is displayed

#### tracks (default `[]`)
> An array of `Genoverse.Track` definitions to be displayed

#### highlights (default `[]`)
> An array of regions to highlight, in the form 
```
{ "start": 100, "end", 200, "label": "My highlight", "removable": false }
``` 
> `label` defaults to "start-end" (e.g. "100-200") if not provided. 
> 
> If `removable === false`, the highlight cannot be removed.

#### plugins (default `[]`)
> An array of `Genoverse.Plugins` to be used (from the [js/plugins](https://github.com/wtsi-web/Genoverse/tree/gh-pages/js/plugins) directory), e.g. 
```
[ "controlPanel", "trackControls" ]
```
> The strings in this array correspond to the namespace of each plugin, which are the same as their file names. 

### Interaction with the URL

#### urlParamTemplate (default `"r=__CHR__:__START__-__END__"`)
> The template used to alter the web browser's URL. Should contain placeholders for chr, start and end.
>
> If `false` or empty string, no changes will be made to the URL when navigation occurs. 

#### useHash (default `undefined`)
> Determines how the browser's URL gets updated on navigation. Can be:
>
> - `true` - use `window.location.hash`
> - `false` - use `window.history.pushState`
> - `undefined` - use `window.history.pushState` if present in the browser, else use `window.location.hash`

### User actions

#### dragAction (default `"scroll"`) 
> The action performed when a mouse drag happens on the genome browser. Can be:
>
>  - `"scroll"` - Move the browser left or right
>  - `"select"` - Select the region
>  - `"off"`    - Do nothing

#### wheelAction (default `"off"`) 
> The action performed when a mouse drag happens on the genome browser. Can be:
>
>  - `"zoom"` - Zoom in or out
>  - `"off"`    - Do nothing

#### isStatic (default `false`)
> If `true`, will stop drag, select and zoom actions occurring

### Saving user configurations

#### saveable (default `false`)
> If `true`, track configuration and ordering will be saved in `window.sessionStorage`/`window.localStorage` (defined by `storageType`, below) so that users will see the same display when they refresh the page

#### storageType (default `"sessionStorage"`)
> The storage object used to save track configuration. Set to `"localStorage"` for permanence.
>
> See Mozilla's [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) and [localStorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage) documentation for further details.

#### saveKey (default empty string)
> The default key used in configuration storage is `"genoverse"`. `saveKey` will be appended to this to allow different configurations for different instances of Genoverse.

### Default track display settings

#### autoHideMessages (default `true`)
> Determines whether to collapse track messages (toggleable pop-outs on the left side of a track's image)  by default when the user interacts with the genome browser

#### trackAutoHeight (default `false`)
> Determines whether to automatically resize tracks to show all their features (can be overridden by `track.autoHeight`)

#### hideEmptyTracks (default `true`)
> Determines whether to hide an automatically resized tracks if it has no features, or to show it empty (can be overridden by `track.hideEmpty`)
