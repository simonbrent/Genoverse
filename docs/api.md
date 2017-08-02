# API

The following are methods that can be called on an instance of Genoverse or Genoverse.Track to perform actions required by UI changes external to the instance (i.e. from the website you have integrated Genoverse into).

Genoverse does not use underscored field names, such as `_private` or `_privateFunction()`, to denote private fields. Generally, all variables on Genoverse or Genoverse.Track objects should be considered private in a sense that it is not safe to modify them directly, saying e.g `genoverse.start = 1`. Instead, call the following API functions.

## Genoverse API

#### genoverse.addTracks(tracks [, after ])
> Add a number of tracks to the genome browser
>
> Argument | Type | Description
> --- | --- | ---
> tracks | Array | An array of `Genoverse.Track` class definitions to be added
> after | Integer or undefined | The existing track after which the new tracks will be inserted. For example, if the existing tracks are `[ A, B, C, D, E ]`, `genoverse.addTracks([ X, Y ], 2)` will result in `[ A, B, X, Y, C, D, E ]`. If `undefined` , the tracks will be inserted after the existing tracks.

#### genoverse.addTrack(track [, after ])
> Add a single track to the genome browser
>
> Argument | Type | Description
> --- | --- | ---
> track | `Genoverse.Track` class | A `Genoverse.Track` class definition to be added
> after | Integer or undefined | See `genoverse.addTracks`

#### genoverse.removeTracks(tracks)
> Remove a number of tracks from the genome browser
>
> Argument | Type | Description
> --- | --- | ---
> tracks | Array | An array of existing `Genoverse.Track` instances to be removed

#### genoverse.removeTrack(track)
> Remove a single track from the genome browser
>
> Argument | Type | Description
> --- | --- | ---
> track | `Genoverse.Track` instance | An existing `Genoverse.Track` instance to be removed

#### genoverse.addHighlights(highlights)
> Add a number of highlighted regions to the genome browser
>
> Argument | Type | Description
> --- | --- | ---
> tracks | Array | An array of highlighted regions to be added. See [configuration](configuration.md#highlights-default-) for the structure of highlights.

#### genoverse.addHighlight(highlight)
> Add a single highlighted regions to the genome browser
>
> Argument | Type | Description
> --- | --- | ---
> highlight | Object | A highlighted region to be added. See [configuration](configuration.md#highlights-default-) for the structure of highlights.

#### genoverse.moveTo(chr, start, end [, update] [, keepLength])
> Moves the viewpoint to the region between `start` and `end`
>
> Argument | Type | Description
> --- | --- | ---
> chr | String or undefined | The name of a chromosome defined by `genoverse.genome`. If `genoverse.genome` is undefined, `chr` must be undefined, or the current value of `genoverse.chr`.
> start | Integer | A number between `1` and `genoverse.chromosomeSize`
> end | Integer | A number between `start` and `genoverse.chromosomeSize`
> update | Boolean or undefined | If `true`, the URL will be updated with the new `start` and `end`
> keepLength | Boolean or undefined | if `true`, the new viewpoint will have the same zoom level as before (`end - start` remains unchanged), centered on the given `start` and `end`.

#### genoverse.setWidth(width)
> Resizes the `container` element for the instance of Genoverse
>
> Argument | Type | Description
> --- | --- | ---
> width | Integer | The width to resize to, in pixel

#### genoverse.setDragAction(action)
> Sets [`genoverse.dragAction`](/docs/configuration.md#dragaction-default-scroll), determining whether a drag (mousedown, mousemove, mouseup) results in the browser region moving, a region being selected, or nothing
>
> Argument | Type | Description
> --- | --- | ---
> action | `"select"`, `"scroll"`, or `"off"` | The value which `genoverse.dragAction` will be set to

#### genoverse.setWheelAction(action)
> Sets [`genoverse.wheelAction`](/docs/configuration.md#wheelaction-default-off), determining whether a mousewheel scroll zooms the browser in and out, or does nothing
>
> Argument | Type | Description
> --- | --- | ---
> action | `"zoom"` or `"off"` | The value which `genoverse.wheelAction` will be set to

#### genoverse.closeMenus([ track ])
> If `track` is a Genoverse.Track instance, closes (hides) all popup menus for that track. 
>
> If `track` is `undefined`, closes all popup menus.
> 
> Argument | Type | Description
> --- | --- | ---
> track | Genoverse.Track instance or undefined | The object whose popup menus will be closed

#### genoverse.on(events, [, onTracks ], callback)
> Execute functions before or after Genoverse or Genoverse.Track functions
>
> Argument | Type | Description
> --- | --- | ---
> events | String | One or more space-separated events. Events are function names with an uppercase first letter, appended to "before" or "after", e.g. "beforeAddTrack" or "afterSetWidth".
> onTracks | `"tracks"` or `Genoverse.Track` instance | If present, the callback will be executed on any track in the genome browser. *Note that providing a specific track instance does not mean the callback will be executed only for that track.* If omitted (i.e. `genoverse.on(events, callback)`, the callback will be executed on the instance of Genoverse.
> callback | Function | The function to be executed for all of the space-separated events

#### genoverse.on(events [, onTracks ])
> Execute functions before or after Genoverse or Genoverse.Track functions
>
> Argument | Type | Description
> --- | --- | ---
> events | Object | An object whose keys are one or more space-separated events (see above), and whose values are the functions to be executed for those events
> onTracks | `"tracks"` or `Genoverse.Track` instance | See above

#### genoverse.once(events, [, onTracks ], callback)
> Like [`genoverse.on`](#genoverseonevents--ontracks--callback), but the functions will only be called one time

#### genoverse.once(events, [, onTracks ])
> Like [`genoverse.on`](#genoverseonevents--ontracks-), but the functions will only be called one time

#### genoverse.reset()
> Removes all existing data visualizations, and recreates them

#### genoverse.resetTrackHeights()
> Sets all track heights to their initial values

#### genoverse.destroy()
> Removes the instance of Genoverse from the web page

## Genoverse.Track API

#### track.prop(key [, value ])
> Get or set a property on the track or it's model, view or controller, without needing to know specifically which of these objects the property belongs to. Also available on `track.model`, `track.view`, and `track.controller` with identical functionality.
>
> Argument | Type | Description
> --- | --- | ---
> key | String | The name of the property to be returned.
> value | Anything | If defined, the value of the property will be set to this argument. If `null`, the property will be removed from its object.

#### track.setConfig(type, name)
> Set the track's [configuration](/docs/tracks/configuration.md#changing-track-settings) after initalization
>
> Argument | Type | Description
> --- | --- | ---
> type | String | One of the keys in `track.configSettings`
> name | String | One of the keys in `track.configSettings[type]`

#### track.setConfig(config)
> Set the track's [configuration](/docs/tracks/configuration.md#changing-track-settings) after initalization
>
> Argument | Type | Description
> --- | --- | ---
> config | Object | An object in the form `{ type1: "name1", type2, "name2" }`, where each `type` and `name` fulfills the criteria of `track.setConfig(type, name)`, above

#### track.remove()
> Remove the track from the genome browser

#### track.disable()
> Hide the track in the genome browser, without removing it

#### track.enable()
> Show the track in the genome browser, if it had previously been disabled

#### track.reset()
> Clears all data stored by the track's models and views, removes the images that have been drawn by the track so far, and then requests new data, and creates new images for the current location in the genome browser

#### track.resetHeight()
> Sets the track's height to its initial value

#### track.updateName(name)
> Changes the name of the track, as displayed in the label to the left of its images.
>
> Argument | Type | Description
> --- | --- | ---
> name | String | The name for the track.
