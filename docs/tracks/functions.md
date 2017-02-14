## Initialization

The following functions are called during track creation and do not have before/after hooks.

#### track.setInterface()
> Creates a `track._interface` object which is used to determine whether properties and functions belong to the track's model, view, or controller

#### track.setDefaults()
> Sets initial properties of the track instance

#### track.setDefaultConfig()
> If [`track.defaultConfig`](/docs/tracks/configuration.md#defaultconfig-default-undefined) is defined, uses it to set the current config, and add the correct settings to the track

#### track.setEvents()
> Can be used to add events to the instance of Genoverse with [`genoverse.on`](/docs/api.md#genoverseonevents--ontracks--callback) if required by a particular type of track. By default does nothing.

## [MVC interactions](/docs/tracks.md#multiple-models-and-views)

#### track.setLengthMap()
> Finds [numerical keys](/docs/tracks.md#multiple-models-and-views) in the track definition, and uses them to create a `track.lengthMap` array containing `Genoverse.Track.Model` and `Genoverse.Track.View` instances as required. 
> 
> `track.lengthMap` is in the form 
> ```
> [ 
  [ 1,    { "model": modelInstance1,    "view": viewInstance1    } ], 
  [ 1000, { "model": modelInstance1000, "view": viewInstance1000 } ],
  ...
]
> ```
> where the first element in each array is the relevant numerical key.
> 
> Also creates `track.models` and `tracks.views` objects in the form
> ```
> track.models = { "1": modelInstance1, "1000": modelInstance1000, ... }
> track.views  = { "1": viewInstance1,  "1000": viewInstance1000,  ... }
> ```
> Called once during track initalization. Does not have before/after hooks.

#### track.setMVC()
> Creates the instance of `Genoverse.Track.Controller` required by the track the first time it is called.
> Sets the model and view of a track, based on the current size of the browser region, determined by calling [`track.getSettingsForLength`](#trackgetsettingsforlength). 

#### track.newMVC(object [, functions, properties ])
> Returns a new instance of a `Genoverse.Track.Model`, `Genoverse.Track.View`, or `Genoverse.Track.Controller`
> 
> Argument | Type | Description
> --- | --- | ---
> object | `Genoverse.Track.Model`, `Genoverse.Track.View` or `Genoverse.Track.Controller` class | The class to be instantiated
> functions | Object or undefined | An object whose values are functions to be overwritten in the instance
> properties | Object or undefined | An object whose values are non-function properties to be overwritten in the instance

#### track.getSettingsForLength()
> Returns the value of [`track.lengthMap`](#tracksetlengthmap) with the lowest first element value which is less that the current size of the browser region

## [User configuration](/docs/tracks.md#allowing-a-user-to-change-a-tracks-configuration)

#### track.setConfig()
> See the [api documentation](/docs/api.md#tracksetconfigtype-name)

#### track.getConfig(type)
> Returns the name of the current [`track.configSetting`](/docs/tracks/configuration.md#configsettings-default-undefined) in use for the given `type` of config
> 
> Argument | Type | Description
> --- | --- | ---
> type | String | The type of config setting

## Enabling and disabling

#### track.enable()
> See the [api documentation](/docs/api.md#trackenable)

#### track.disable()
> See the [api documentation](/docs/api.md#trackdisable)

#### track.reset()
> See the [api documentation](/docs/api.md#trackreset)
> 
#### track.remove()
> See the [api documentation](/docs/api.md#trackremove)
