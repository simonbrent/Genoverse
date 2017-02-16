# Genoverse.Track.Controller functions

The following are functions that exist in the `Genoverse.Track.Controller` object. Any of these can have before/after hooks added to them, or be overwritten by supplying them as properties in configuration.

## Initialization

#### controller.init()
> Called once the controller instance is created. Sets initial properties of the instance and calls functions to creates its DOM elements, and event handlers.

#### controller.addDomElements()
> Creates the DOM elements required by the track

#### controller.addUserEventHandlers()
> Creates the event handlers required for users to interact with the track

#### controller.setName(name)
> Sets the name of the track, as displayed in the label to the left of its images.
>
> Argument | Type | Description
> --- | --- | ---
> name | String | The name for the track.

## User interactions

#### controller.click(e)
> Called when a user clicks on the track's image DOM element. Creates a popup menu for the feature(s) the user clicked on.
>
> Argument | Type | Description
> --- | --- | ---
> e | [jQuery event](http://api.jquery.com/category/events/) | The click event

#### controller.getClickedFeatures(x, y [, target ])
> Returns an array of features for the given coordinates. These coordinates correspond to where a user clicked on a track image, and what genomic region that image represents.
>
> Argument | Type | Description
> --- | --- | ---
> x | Float | The x coordinate in pixels from the start of the chromosome. This is calculated as (x coordinate of the click event - left offset of the container DOM element + (current browser region start value * current browser scale)) where scale = (browser pixel width / browser region size)
> y | Integer | The y coordinate in pixels from the top of the container DOM element
> target | [jQuery selector](http://api.jquery.com/category/selectors/) or `undefined` | The element being clicked on. Needed to distinguish between a click on an image containing features and an image containing labels when [`labels = "separate"`](/docs/tracks/configuration.md#labels-default-true)

## Track messages

#### controller.showMessage(code [, additionalText ])
> Shows a message for the track. Messages appear as pop-outs from the left side of the track image.
>
> Argument | Type | Description
> --- | --- | ---
> code | String | The code of the message to show. Default message codes are `"error"`, `"threshold"` or `"resize"`.
> additionalText | String or `undefined` | Extra text to append to the message as defined by `this.messages[code]`

#### controller.hideMessage([ code ])
> Removes a message or messages from the track. This is different from the user action of minimizing a message pop-out - the pop-out will no longer appear at all.
> 
> Argument | Type | Description
> --- | --- | ---
> code | String or `undefined` | The code of the message to hide. Default message codes are `"error"`, `"threshold"` or `"resize"`. If `undefined`, all of the track's messages are hidden.

#### controller.showError(error)
> Shows an error message for the track by calling [`controller.showMessage("error", error)`](#controllershowmessagecode--additionaltext-) 
> 
> Argument | Type | Description
> --- | --- | ---
> error | String | Extra text to append to the error message as defined by `this.messages.error`

## Track height changes

#### controller.checkHeight()
> Determines whether the track needs to be resized, either because the browser region size exceeds the track's [`threshold`](/tracks/configuration.md#threshold-default-infinity), or because the track is [`autoHeight`](/tracks/configuration.md#autoheight-default-undefined) and the features in view take up a different amount of vertical space to the current height of the track's image.

#### controller.autoResize()
> If the track is [`autoHeight`](/tracks/configuration.md#autoheight-default-undefined), calls [`controller.resize`](#controllerresizeheight--forecshow-saveconfig-), otherwise calls [`controller.toggleExpander`](#controllertoggleexpandersaveconfig)

#### controller.resize(height [, forceShow, saveConfig ])
> Changes the height of the track's DOM elements
> 
> Argument | Type | Description
> --- | --- | ---
> height | Integer | The new height for the track's DOM elements
> forceShow | Boolean or `undefined` | If `true`, `height` will be used even if the track would normally be hidden (see [`track.setHeight`](/docs/functions/track.md#tracksetheightheight--forceshow-))
> saveConfig | Boolean or `undefined` | If not `false`, [`genoverse.saveConfig`](/docs/functions/genoverse.md#genoversesaveconfig) is called after height has been changed, to retain this height on page refresh

#### controller.resize(height [, top, saveConfig ])
> Changes the height of the track's DOM elements
> 
> Argument | Type | Description
> --- | --- | ---
> height | Integer | The new height for the track's DOM elements
> top | Integer or `undefined` | The top offset in pixels for the track's labels image, in the case that [`labels = "separate"`](/docs/tracks/configuration.md#labels-default-true)
> saveConfig | Boolean or `undefined` | If not `false`, [`genoverse.saveConfig`](/docs/functions/genoverse.md#genoversesaveconfig) is called after height has been changed, to retain this height on page refresh

#### controller.toggleExpander()
> Shows or hides the expander - a DOM element at the bottom of the track's image which allows users to expand the image's height by clicking in on - of resizable tracks depending on whether any features in the current browser region are being hidden by the image's current height.

## Creating images

#### controller.makeImage(params)
> Creates an image DOM element and adds it to the track. Calls [`model.getData`](/docs/functions/model.md#modelgetdatachrstartend--done-) to get features to be drawn on the new image, and then [`controller.render`](#controllerrenderfeaturesimg) to draw them on the image.
> Returns a [jQuery deferred object](http://api.jquery.com/category/deferred-object/) which is resolved once the data for the image has been retrieved.
>
> Argument | Type | Description
> --- | --- | ---
> params | Object | A set of properties required to create the image

#### controller.makeFirstImage()
> Called when a track is created or when the browser's scale changes to create three image DOM elements and adds them to the track by calling [`controller.makeImage`](#controllermakeimageparams). One image covers the browser region, one covers the region to the left, and the other covers the region to the right. This allows the user to scroll away from the initial region without the immediate need to request more data and draw new images.

#### controller.render(features, img)
> Creates a canvas DOM element and calls [`view.draw`](/docs/functions/view.md#viewdrawfeaturesfeaturecontextlabelcontextscale) to draw features on it. Once this is done, the `src` attribute of the image DOM element is set to the [canvas' data url](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL). The canvas element is never added to the DOM.
>
> Argument | Type | Description
> --- | --- | ---
> features | Array | The features to be drawn
> img | [jQuery selector](http://api.jquery.com/category/selectors/) | The image element to be drawn

#### controller.renderBackground(features, img [, height ])
> Like [`controller.render`](#controllerrenderfeaturesimg), but for drawing background images for a track. An example of this is the `Genoverse.Track.Scalebar` track, where a background image is used for the vertical grey lines which extend the whole height of the browser.
>
> Argument | Type | Description
> --- | --- | ---
> features | Array | The features to be drawn
> img | [jQuery selector](http://api.jquery.com/category/selectors/) | The image element to be drawn
> height | Integer or `undefined` | The height for the canvas DOM element. Default `1`.

## Popup menus

#### controller.populateMenu(feature)
> Returns an object for use in [`genoverse.makeFeatureMenu`](/docs/functions/genoverse.md#genoversemakefeaturemenufeatures--event-track-), defining the contents of the feature's popup menu.
> 
> For example, consider a variation feature where the popup needs to contain information about the location and alleles. `populateMenu` could return an object as follows:
> ```
> {
>   "Location": "1:100-101",
>   "Reference allele": "CT",
>   "Alternative allele": "TG"
> }
> ```
> The would create a popup with these three attributes, in the order they are defined in the object. Note that the keys and values of the object are displayed in the popup unmodified, so case is important, and both keys and values can contain HTML. 
> 
> The popup is created using a table element, with keys in the first column and values in the second. In order to create rows in the table where content can span both columns, a key whose value is an empty string can be given.
> 
> There is one special reserved key: `title` is used to set the value of the popup's title element (the bar at the top of the popup).
>
> Expanding on the example above, the final return value could be:
>```
> {
>   "title": "A variant",
>   "Location": "1:100-101",
>   "Reference allele": "CT",
>   "Alternative allele": "TG",
>   "External resource": '<a href="http://external.resource.com/link/to/this/variant">Click here</a>',
>   '<a href="http://external.resource2.com/link/to/this/variant">Another external resource, link text is long and spans both columns in the table</a>': ""
> }
>```
>
> Finally, instead of a plain object, `populateMenu` can return a [jQuery deferred object](http://api.jquery.com/category/deferred-object/). This allows an AJAX request to be used to get further information for the popup which isn't included in the feature. This can be used to speed up requests made by [`model.getData`](/docs/functions/model.md#modelgetdatachrstartend--done-), as only the essential positional properties of a feature are needed to draw it, and extra details can be obtained later. This deferred object must be resolved with a plain object argument, as detailed above, for example:
>
>```
> populateMenu: function (feature) {
>   var deferred = $.Deferred();
>
>   $.ajax({
>     url: 'http://my.website.com/path/to/data/for/feature'
>     success: function (data) {
>       var menu = { ... based on data ... };
>       deferred.resolve(menu);
>     }
>   });
>  
>   return deferred;
> }
>``` 
>
> Argument | Type | Description
> --- | --- | ---
> feature | Object | The feature to create the popup for

## Misc

#### controller.setScale()
> Calls [`track.setMVC`](/docs/functions/track.md#tracksetmvc) to update the track's `model` and `view` properties

#### controller.move(delta)
> Pans the track's images left or right, making a new image if the left- or right-most image no longer entirely covers the browser region
>
> Argument | Type | Description
> --- | --- | ---
> delta | Integer | The number of pixels to move the track's images by (> 1 for left to right, < 1 for right to left)

#### controller.reset()
> Called by [`track.reset`](/docs/api.md#trackreset) to remove the images that have been drawn by the track so far, and then creates new images for the current location in the genome browser
