# Genoverse.Track.Model functions

The following are functions that exist in the `Genoverse.Track.Model` object. Any of these can have before/after hooks added to them, or be overwritten by supplying them as properties in configuration.

#### model.init()
> Called once the model instance is created. Sets initial properties of the instance.

#### model.features(chr)
> Returns an RTree of features for the given chromosome
>
> Argument | Type | Description
> --- | --- | ---
> chr | String | The name of the chromosome to return features for

#### model.dataRanges(chr)
> Returns an RTree of features for the given chromosome
>
> Argument | Type | Description
> --- | --- | ---
> chr | String | The name of the chromosome to return data ranges for

#### model.parseURL(chr, start, end [, url ])
> Returns a URL string with placeholders for chromosome, start, end and assembly replaced. Chromosome, start and end placeholders are replaced from input arguments, while the assembly placeholder (if it exists) is replaced with the value of `genoverse.assembly`.
>
> Argument | Type | Description
> --- | --- | ---
> chr | String | The name of the chromosome to use in the URL
> start | Integer | The start position to use in the URL
> end | Integer | The end position to use in the URL
> url | String or `undefined` | The URL to parse. Defaults to the [`url`](/docs/tracks/configuration.md#url-default-undefined) property

#### model.getData(chr, start, end [, done ])
> Makes [jQuery.ajax](http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings) request(s) to get data for the given genomic region (multiple requests may be made if [`dataRequestLimit`](/docs/tracks/configuration.md#datarequestlimit-default-undefined) is set.
> Returns a [jQuery deferred object](http://api.jquery.com/category/deferred-object/) which is resolved when all of the jQuery.ajax requests are complete.
> 
> Argument | Type | Description
> --- | --- | ---
> chr | String | The name of the chromosome to get data for
> start | Integer | The start of the region to get data for
> end | Integer | The end of the region to get data for
> done | Function or `undefined` | A callback to be executed on completion of each jQuery.ajax request performed

#### model.receiveData(data, chr, start, end)
> Called on successful completion of each successful attempt to get data made by [`model.getData`](#modelgetdatachr-start-end--done-). Calls [`model.setDataRange`](#modelsetdatarangechr-start-end) and [`model.parseData`](#modelparsedatadata-chr-start-end) to process the data returned by the request.
> 
> Argument | Type | Description
> --- | --- | ---
> data | Anything | The data returned by the request in [`model.getData`](#modelgetdatachr-start-end--done-)
> chr | String | The name of the chromosome used in the request
> start | Integer | The start of the region used in the request
> end | Integer | The end of the region used in the request

#### model.parseData(data, chr, start, end)
> Converts the data provided into features that Genoverse can use. Calls [`model.insertFeature`](#modelinsertfeaturefeature) for each feature produced from the data. By default, `data` is expected to be an array of feature objects (the assumption is that the contents of the [`url`](/docs/tracks/configuration.md#url-default-undefined) is a JSON array). If that is not the case for a particular track, this function will need to be overwritten to handle the data structure being used.
> 
> See [`model.receiveData`](#modelreceivedatadata-chr-start-end) for argument descriptions.

#### model.insertFeature(feature)
> Inserts the given feature into the `features` RTree for the feature's `chr` property
> 
> Argument | Type | Description
> --- | --- | ---
> feature | Object | The feature to be inserted

#### model.setDataRange(chr, start, end)
> Inserts the given start and end into the `dataRanges` RTree for the given `chr`.
> `dataRanges` are used to check whether data has already been received for a given region, in order to avoid making multiple requests for the same data (see [`model.checkDataRange`](#modelcheckdatarangechr-start-end)).
> 
> Argument | Type | Description
> --- | --- | ---
> chr | String | The name of the chromosome that data has been received for
> start | Integer | The start of the region that data has been received for
> end | Integer | The end of the region that data has been received for

#### model.checkDataRange(chr, start, end)
> Returns `true` if the track already has data for the whole of the given genomic region, else returns `false`.
> 
> Argument | Type | Description
> --- | --- | ---
> chr | String | The name of the chromosome to check
> start | Integer | The start of the region to check
> end | Integer | The end of the region to check

#### model.findFeatures(chr, start, end)
> Returns an array of [sorted](#modelsortfeaturesfeatures) features stored in the `features` RTree for the given `chr`
> 
> Argument | Type | Description
> --- | --- | ---
> chr | String | The name of the chromosome to find features in
> start | Integer | The start of the region to find features in
> end | Integer | The end of the region to find features in

#### model.sortFeatures(features)
> Sorts an array of features based on their `sort` property, lowest first. By default the value of `sort` is the feature's `start` + the index of the feature in the data array received by [`model.parseData`](#modelparsedatadata-chr-start-end). This means that features are sorted by lowest start, with tie-breaking based on the original data source's ordering.
> This function can be overwritten to sort on different criteria.
>
> Argument | Type | Description
> --- | --- | ---
> features | Array | An array of features to sort

#### model.updateData(data)
> If the track is using the [`data`](/docs/tracks/configuration.md#data-default-undefined) property, this function allows that data to be updated. The given `data` argument will completely overwrite the old value of the property, after which the track will be [`reset`](/docs/api.md#trackreset).

#### model.abort()
> Aborts all incomplete [jQuery.ajax](http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings) requests currently being made by the model instance
