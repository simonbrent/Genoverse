# Genoverse functions

The following are functions that exist in the `Genoverse` object. Any of these can have before/after hooks added to them, or be overwritten by supplying them as properties in configuration.

## Initialization 

#### genoverse.init()
> Called once the Genoverse instance is created. Sets initial properties of the instance and calls functions to creates its DOM elements, event handlers, tracks and highlights, and set the starting location.

#### genoverse.addDomElements(width)
> Creates the DOM elements required by the instance of Genoverse
>
> Argument | Type | Description
> --- | --- | ---
> width | Integer | The width for the container DOM element (usually this should be the initial value of [`genoverse.width`](/docs/configuration.md#width-default-1000))

#### genoverse.addUserEventHandlers()
> Creates the event handlers required for users to interact with the instance of Genoverse

## Configuration

#### genoverse.loadConfig()
> If [`genoverse.saveable`](/docs/configuration.md#saveable-default-false) is `true`, configuration will be loaded from `window[`[`genoverse.storageType`](/docs/configuration.md#storagetype-default-sessionstorage)`].getItem(`[`genoverse.saveKey`](/docs/configuration.md#savekey-default-empty-string)`)`. This configuration contains the user's previous tracks, their ordering, heights, and any other [track configuration settings](/docs/tracks/configuration.md#changing-track-settings). If no configuration exists, the default set of tracks will be used instead.

#### genoverse.saveConfig()
> If [`genoverse.saveable`](/docs/configuration.md#saveable-default-false) is `true`, the user's current tracks, their ordering, heights, and any other [track configuration settings](/docs/tracks/configuration.md#changing-track-settings) will be saved to `window[`[`genoverse.storageType`](/docs/configuration.md#storagetype-default-sessionstorage)`].getItem(`[`genoverse.saveKey`](/docs/configuration.md#savekey-default-empty-string)`)`.

#### genoverse.resetConfig()
> If [`genoverse.saveable`](/docs/configuration.md#saveable-default-false) is `true`, removes all tracks and unremovable highlights, adds the default set of tracks, and removes the value in [`genoverse.saveKey`](/docs/configuration.md#savekey-default-empty-string) from `window[`[`genoverse.storageType`](/docs/configuration.md#storagetype-default-sessionstorage)`]`.

## Changing browser location

#### genoverse.moveTo(chr, start, end [, update] [, keepLength])
> See the [api documentation](/docs/api.md#genoversemovetochr-start-end--update--keeplength)

#### genoverse.move(delta)
> Move the browser region a number of pixels left or right. This will be translated into a new chromosomal location based on the current value of `genoverse.scale` (width of the browser's containing DOM element in pixels / size of genomic region being viewed).
>
> **Note:** [`genoverse.moveTo`](/docs/api.md#genoversemovetochr-start-end--update--keeplength) should be used instead to change the location of a Genoverse instance externally.
> 
> Argument | Type | Description
> --- | --- | ---
> delta | Integer | The number of pixels to move the browser region by (> 1 for left to right, < 1 for right to left)

#### genoverse.setRange(start, end [, update] [, keepLength])
> Sets [`genoverse.start`](/docs/configuration.md#start-default-1) and [`genoverse.end`](/docs/configuration.md#end-default-1000000), moving the browser region in the process.
> 
> **Note:** [`genoverse.moveTo`](/docs/api.md#genoversemovetochr-start-end--update--keeplength) should be used instead to change the location of a Genoverse instance externally.
>
> Argument | Type | Description
> --- | --- | ---
> start | Integer | A number between `1` and [`genoverse.chromosomeSize`](/docs/configuration.md#chromosomesize-default-undefined)
> end | Integer | A number between `start` and [`genoverse.chromosomeSize`](/docs/configuration.md#chromosomesize-default-undefined)
> update | Boolean or undefined | If `true`, the URL will be updated with the new `start` and `end`
> keepLength | Boolean or undefined | if `true`, the new viewpoint will have the same zoom level as before (`end - start` remains unchanged), centered on the given `start` and `end`.

#### genoverse.setScale()
> Sets `genoverse.scale` to (width of the browser's containing DOM element in pixels / size of genomic region being viewed). If the scale changes, forces all tracks to draw new images at the new scale.

## Track interactions

#### genoverse.addTracks
> See the [api documentation](/docs/api.md#genoverseaddtrackstracks--after-)

#### genoverse.addTrack
> See the [api documentation](/docs/api.md#genoverseaddtracktrack--after-)

#### genoverse.removeTracks
> See the [api documentation](/docs/api.md#genoverseremovetrackstracks)

#### genoverse.removeTrack
> See the [api documentation](/docs/api.md#genoverseremovetracktrack)

#### genoverse.updateTrackOrder(e, ui)
> Called when a user moves track labels to reorder tracks in the browser. Set the moved track's `order` property such that it is between the `order` properties of its new immediate siblings. [`genoverse.sortTracks`](#genoversesorttracks) is then called to update the position of the track's image element.
> 
> See [jQuery UI sortable update event](http://api.jqueryui.com/sortable/#event-update) for argument details.

#### genoverse.sortTracks
> Reorders the tracks' DOM elements based on each track's `order` property, lowest first.

## Highlight interactions

#### genoverse.addHighlights(highlights)
> See the [api documentation](/docs/api.md#genoverseaddhighlightshighlights)

#### genoverse.addHighlight(highlight)
> See the [api documentation](/docs/api.md#genoverseaddhighlighthighlight)

## URL interactions

#### genoverse.updateURL
> If [`genoverse.urlParamTemplate`](/docs/configuration.md#urlparamtemplate-default-r__chr____start__-__end__) is set, the URL will be updated to reflect the current browser region. This will be done either by using [`window.history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method), or by updating `window.location.hash`, depending on the value of [`genoverse.useHash`](/docs/configuration.md#usehash-default-undefined).

#### genoverse.popState
> Called by [`window.onpopstate`](https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate) or [`window.onhashchange`](https://developer.mozilla.org/en/docs/Web/API/WindowEventHandlers/onhashchange) to update the browser region if the user uses the back or forward buttons in their web browser.

#### genoverse.getURLCoords
> Returns an object in the form `{ "chr": "1", "start": 123, "end": 456 }` by parsing the URL using the value of [`genoverse.urlParamTemplate`](/docs/configuration.md#urlparamtemplate-default-r__chr____start__-__end__)

#### genoverse.getQueryString
> Returns a string of [`genoverse.urlParamTemplate`](/docs/configuration.md#urlparamtemplate-default-r__chr____start__-__end__) with the placeholders replaced with their relevant values, to be used in updating the URL. If [`genoverse.useHash`](/docs/configuration.md#usehash-default-undefined) is `false`, this will be appended to any existing value of `window.location.search` such that other parameters are unchanged.

## Popup menus

#### genoverse.makeMenu(features [, event, track ])
> Creates a popup menu for one or more features. If more than one feature is provided, the popup will contain one link per feature which each create another popup for that feature
> 
> Argument | Type | Description
> --- | --- | ---
> features | Feature object or array of feature objects | The feature(s) to make the menu for
> event | [jQuery event](http://api.jquery.com/category/events/) or undefined | The click event that created the menu, used to position the menu at the mouse pointer
> track | `Genoverse.Track` instance or undefined | The track which was clicked on

#### genoverse.makeFeatureMenu(features [, event, track ])
> Called by [`genoverse.makeMenu`](#genoversemakemenufeatures--event-track-) to create a popup menu for a single feature
> 
> Argument | Type | Description
> --- | --- | ---
> feature | Feature object | The feature to make the menu for
> event | [jQuery event](http://api.jquery.com/category/events/) or undefined | The click event that created the menu, used to position the menu at the mouse pointer
> track | `Genoverse.Track` instance or undefined | The track which was clicked on

#### genoverse.closeMenus([ track ])
> See the [api documentation](/docs/api.md#genoverseclosemenus-track-)

## User events

#### genoverse.setDragAction(action)
> See the [api documentation](/docs/api.md#genoversesetdragactionaction)

#### genoverse.setWheelAction(action)
> See the [api documentation](/docs/api.md#genoversesetwheelactionaction)

#### genoverse.startDragScroll(e)
> Initializes a scroll action
>
> Argument | Type | Description
> --- | --- | ---
> e | [jQuery event](http://api.jquery.com/category/events/) | The user event which starts a scroll operation

#### genoverse.stopDragScroll([ update ])
> Ends a scroll action
>
> Argument | Type | Description
> --- | --- | ---
> update | Boolean or undefined | If not `false`, will update the URL to the new location (providing the URL is changeable by the instance of Genoverse)

#### genoverse.startDragSelect(e)
> Initializes a select action
>
> Argument | Type | Description
> --- | --- | ---
> e | [jQuery event](http://api.jquery.com/category/events/) | The user event which starts a select operation

#### genoverse.stopDragSelect(e)
> Ends a select action, showing an actions menu for the selected region
>
> Argument | Type | Description
> --- | --- | ---
> e | [jQuery event](http://api.jquery.com/category/events/) | The user event which ends a select operation

#### genoverse.cancelSelect()
> Hides the region selection element

#### genoverse.dragSelect(e)
> Resizes the region selection element based on a mousemove event
> 
> Argument | Type | Description
> --- | --- | ---
> e | [jQuery event](http://api.jquery.com/category/events/) | The mousemove event

#### genoverse.keydown(e)
> If the shift key is pressed, region selection is enabled while it is held down (nothing happens if [`genoverse.dragAction`](/docs/configuration.md#dragaction-default-scroll) was already `"select"`). If the escape key is pressed, any popup menus (for track features or the region select menu) are hidden.
>
> Argument | Type | Description
> --- | --- | ---
> e | [jQuery event](http://api.jquery.com/category/events/) | The keydown event

#### genoverse.keyup(e)
> If the shift key is released, region selection is disabled if it was enabled by pressing the key initially (nothing happens if [`genoverse.dragAction`](/docs/configuration.md#dragaction-default-scroll) was already `"select"`).
>
> Argument | Type | Description
> --- | --- | ---
> e | [jQuery event](http://api.jquery.com/category/events/) | The keyup event

#### genoverse.mousedown(e)
> Starts a scroll or select action by calling [`genoverse.startDragScroll(e)`](#genoversestartdragscrolle) or [`genoverse.startDragSelect(e)`](#genoversestartdragselecte), based on the value of [`genoverse.dragAction`](/docs/configuration.md#dragaction-default-scroll)
>
> Argument | Type | Description
> --- | --- | ---
> e | [jQuery event](http://api.jquery.com/category/events/) | The mousedown event

#### genoverse.mouseup(e)
> Ends the current scroll or select action by calling [`genoverse.stopDragScroll(update)`](#genoversestopdragscroll-update-) or [`genoverse.stopDragSelect(e)`](#genoversestopdragselecte), as applicable
>
> Argument | Type | Description
> --- | --- | ---
> e | [jQuery event](http://api.jquery.com/category/events/) | The mouseup event

#### genoverse.mousemove(e)
> If a scroll action is taking place, moves the browser region as the mouse moves.
> If a region select is taking place, changes the size of the selected region as the mouse moves.
> If [`genoverse.dragAction`](/docs/configuration.md#dragaction-default-scroll) is `"select"` and a region select is not taking place, moves the region select element (a dotted red vertical line) to the location of the mouse pointer.
>
> Argument | Type | Description
> --- | --- | ---
> e | [jQuery event](http://api.jquery.com/category/events/) | The mousemove event

#### genoverse.mousewheelZoom(e, delta)
> Performs zoom in and zoom out operations
>
> Argument | Type | Description
> --- | --- | ---
> e | [jQuery event](http://api.jquery.com/category/events/) | The user event which will cause a zoom operation
> delta | `1` or `-1` | `1` for zoom in, `-1` for zoom out

#### genoverse.zoomIn([ x ])
> Calls [`genoverse.setRange`](#genoversesetrangestart-end--update--keeplength) to zoom in, halving the size of the browser region (e.g. 100-200 becomes 125-175). If an `x` argument is provided, the zoom will step towards that point, instead of directly inward. `x`is the difference between the x coordinate of a mousewheel zoom event and the left offset of the browser images on the page.
>
> Argument | Type | Description
> --- | --- | ---
> x | Integer or undefined | The point to zoom towards

#### genoverse.zoomOut([ x ])
> Calls [`genoverse.setRange`](#genoversesetrangestart-end--update--keeplength) to zoom out, doubling the size of the browser region (e.g. 100-200 becomes 50-250). If an `x` argument is provided, the zoom will step towards that point, instead of directly outward. `x`is the difference between the x coordinate of a mousewheel zoom event and the left offset of the browser images on the page.
>
> Argument | Type | Description
> --- | --- | ---
> x | Integer or undefined | The point to zoom towards

## Misc

#### genoverse.on()
> See the [api documentation](/docs/api.md#genoverseonevents--ontracks--callback)

#### genoverse.once()
> See the [api documentation](/docs/api.md#genoverseonceevents--ontracks--callback)

#### genoverse.reset()
> See the [api documentation](/docs/api.md#genoversereset)

#### genoverse.destroy()
> See the [api documentation](/docs/api.md#genoversedestroy)

#### genoverse.setWidth(width)
> See the [api documentation](/docs/api.md#genoversesetwidthwidth)

#### genoverse.getChromosomeSize(chr)
> If [`genoverse.genome`](/docs/configuration.md#genome-default-undefined) is an object, returns the size of the chromosome in the genome, else returns [`genoverse.chromosomeSize`](/docs/configuration.md#chromosomesize-default-undefined)
>
> Argument | Type | Description
> --- | --- | ---
> chr | String | The name of the chromosome

#### genoverse.getSelectorPosition()
> Returns an object in the form `{ "start": 1, "end": 2, "left": 1, "width", 1 }` representing the position of the region selector DOM element.
> `start` and `end` are the genomic coordinates selected by the region, `left` and `width` are the CSS positional values of the element.

#### genoverse.onTracks(functionName [, arg1, arg2, ...argN ])
> Calls the function `functionName` on all tracks in the instance of Genoverse, with the arguments provided
>
> Argument | Type | Description
> --- | --- | ---
> functionName | String | The name of the function to call. This function can be in `Genoverse.Track`, `Genoverse.Track.Controller`, `Genoverse.Track.Model`, or `Genoverse.Track.View`
> args | Anything | A list of arguments to be passed to the function being called
