## Genoverse

### Initialization 

#### genoverse.init()
> Called once the Genoverse instance is created. Sets initial properties of the instance and calls functions to creates its DOM elements, event handlers, tracks and highlights, and set the starting location.

#### genoverse.addDomElements(width)
> Creates the DOM elements required by the instance of Genoverse
>
> Argument | Type | Description
> --- | --- | ---
> width | Integer | The width for the container DOM element (usually this should be the initial value of `genoverse.width`)

#### genoverse.addUserEventHandlers()
> Created the event handlers required for users to interact with the instance of Genoverse

### Configuration

#### genoverse.loadConfig()
> If `genoverse.saveable` is `true`, configuration will be loaded from `window[genoverse.storageType].getItem(genoverse.saveKey)`. This configuration contains the user's previous tracks, their ordering, heights, and any other [track configuration settings](/docs/tracks/configuration.md#changing-track-settings). If no configuration exists, the default set of tracks will be used instead.

#### genoverse.saveConfig()
> If `genoverse.saveable` is `true`, the user's current tracks, their ordering, heights, and any other [track configuration settings](/docs/tracks/configuration.md#changing-track-settings) will be saved to `window[genoverse.storageType].getItem(genoverse.saveKey)`.

#### genoverse.resetConfig()
> If `genoverse.saveable` is `true`, removes all tracks and unremovable highlights, adds the default set of tracks, and removes the value in `genoverse.saveKey` from `window[genoverse.storageType]`.

### Changing browser location

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
> Sets `genoverse.start` and `genoverse.end`, moving the browser region in the process.
> 
> **Note:** [`genoverse.moveTo`](/docs/api.md#genoversemovetochr-start-end--update--keeplength) should be used instead to change the location of a Genoverse instance externally.
>
> Argument | Type | Description
> --- | --- | ---
> start | Integer | A number between `1` and `genoverse.chromosomeSize`
> end | Integer | A number between `start` and `genoverse.chromosomeSize`
> update | Boolean or undefined | If `true`, the URL will be updated with the new `start` and `end`
> keepLength | Boolean or undefined | if `true`, the new viewpoint will have the same zoom level as before (`end - start` remains unchanged), centered on the given `start` and `end`.

#### genoverse.setScale()
> Sets `genoverse.scale` to (width of the browser's containing DOM element in pixels / size of genomic region being viewed). If the scale changes, forces all tracks to draw new images at the new scale.

### User events

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
