# Genoverse API

The following are methods that can be called on an instance of Genoverse to perform actions required by UI changes external to the instance (i.e. from the website you have integrated Genoverse into).

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

#### genoverse.moveTo(start, end [, update] [, keepLength])
> Moves the viewpoint to the region between `start` and `end`
>
> Argument | Type | Description
> --- | --- | ---
> start | Integer | a number between `1` and `genoverse.chromosomeSize`
> end | Integer | a number between `start` and `genoverse.chromosomeSize`
> update | Boolean or undefined | If `true`, the URL will be updated with the new `start` and `end`
> keepLength | Boolean or undefined | if `true`, the new viewpoint will have the same zoom level as before (`end - start` remains unchanged), centered on the given `start` and `end`.

#### genoverse.setWidth(width)
> Resizes the `container` element for the instance of Genoverse
>
> Argument | Type | Description
> --- | --- | ---
> width | Integer | The pixel width to resize to

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

#### genoverse.reset()
> Removes all existing data visualizations, and recreates them

#### genoverse.destroy()
> Removes the instance of Genoverse from the web page
