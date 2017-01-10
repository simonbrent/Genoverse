The following are methods that can be called on a Genoverse.Track instance to perform actions required by UI changes external to the instance (i.e. from the website you have integrated Genoverse into).

#### track.setConfig(type, name)
> Set the track's [configuration](/docs/tracks/configuration.md#changing-track-settings) after initalization
> Argument | Type | Description
> --- | --- | ---
> type | String | One of the keys in `track.configSettings`
> name | String | One of the keys in `track.configSettings[type]`

#### track.setConfig(config)
> Set the track's [configuration](/docs/tracks/configuration.md#changing-track-settings) after initalization
> Argument | Type | Description
> --- | --- | ---
> config | Object | An object in the form `{ type1: "name1", type2, "name2" }`, where each `type` and `name` fulfills the criteria of `track.setConfig(type, name)` (above)

#### track.remove()
> Remove the track from the genome browser

#### track.disable()
> Hide the track in the genome browser, without removing it

#### track.enable()
> Show the track in the genome browser, if it had previously been disabled

#### track.reset()
> Clears all data stored by the track's models and views, removes the images that have been drawn by the track so far, and then requests new data, and creates new images for the current location in the genome browser
