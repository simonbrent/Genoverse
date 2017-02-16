# Genoverse.Track.View functions

The following are functions that exist in the `Genoverse.Track.View` object. Any of these can have before/after hooks added to them unless otherwise specified, or be overwritten by supplying them as properties in configuration.

#### view.setDefaults()
> Sets initial properties of the instance. Does not have before/after hooks.

#### view.setScaleSettings(scale)
> Creates a `featurePositions` RTree for the current chromosome and given `scale`.
> If [`labels = "separate"`](/docs/tracks/configuration.md#labels-default-true), a `labelPositions` RTree is also created.
> 
> Argument | Type | Description
> --- | --- | ---
> scale | Float | The scale (browser pixel width / browser region size) to create settings for

#### view.scaleFeatures(features, scale)
> For each feature, adds a `feature.position[scale]` property, containing the height of the feature and its scaled start and width. This property is used to determine where on the image the feature will be drawn.
> Returns the features.
> 
> Argument | Type | Description
> --- | --- | ---
> features | Array | The features to be drawn
> scale | Float | The scale for the image being drawn

#### view.positionFeatures(features, params)
> Calls [`view.positionFeature`](#viewpositionfeaturefeature-params) for each feature given.
> Returns the features.
> 
> Argument | Type | Description
> --- | --- | ---
> features | Array | The features to be positioned
> params | Object | A set of properties required to create the image

#### view.positionFeature(feature, params)
> Modifies the feature's [`position`](#viewscalefeaturesfeatures-scale) property to contain the values needed to draw it on the image. Also inserts the feature into the [`featurePositions`](#viewsetscalesettingsscale) RTree, which is used to determine [when features are being clicked on by the user](/docs/functions/controller.md#controllergetclickedfeaturesx-y--target-), and for [bumping](#viewbumpfeaturebounds-feature-scale-tree).
> 
> Argument | Type | Description
> --- | --- | ---
> feature | Object | The feature to be positioned
> params | Object | A set of properties required to create the image

#### view.bumpFeature(bounds, feature, scale, tree)
> If [`bump`](/docs/tracks/configuration.md#bump-default-false) is set, features are moved vertically within the track so that the do not overlap horizontally. This is referred to as "bumping".
> The [`featurePositions`](#viewsetscalesettingsscale) RTree is searched for the given `bounds` to discover if it contains another feature in the position. If there is, the given `bounds`' y coordinate is updated such that it doesn't overlap with the found feature any more. 
> This process is done in a loop until searching the RTree for `bounds` no longer finds any features, at which point the given `feature`'s y coordinate is updated to the value of `bounds.y`. 
> The nature of this process means that it can be quite slow for feature-dense regions. A [`depth`](/docs/tracks/configuration.md#depth-default-undefined) cut-off can be specified to limit the maximum number of iterations, but any features which would need to exceed that limit will not be displayed on the image (they will have a `visible` property set to `false`).
> 
> Argument | Type | Description
> --- | --- | ---
> bounds | Object | The region used to search the RTree, in the form `{ "x": 1, "y": 1, "width": 1, "height": 1 }`
> feature | Object | The feature to be bumped
> scale | Float | The scale for the image being drawn
> tree | RTree | The RTree to be searched. Will be either `featurePositions` or `labelPositions`, depending on what is being bumped.

#### view.draw(features, featureContext, labelContext, scale)
> Calls [`view.drawFeature`](#viewdrawfeaturefeature-featurecontext-labelcontext-scale) for each feature without `visible` property set to `false`. 
> Features are cloned before being passed to [`view.drawFeature`](#viewdrawfeaturefeature-featurecontext-labelcontext-scale) to stop the stored versions from being mutated ([`view.setFeatureColor`](#viewsetfeaturecolorfeature), [`view.setLabelColor`](#viewsetlabelcolorfeature), and [`view.truncateForDrawing`](#viewtruncatefordrawingfeature) can all mutate their input feature).
> 
> Argument | Type | Description
> --- | --- | ---
> features | Array | The features to be drawn
> featureContext | [Canvas 2D rendering context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) | The rendering context for the canvas on which the features will be drawn
> labelContext | [Canvas 2D rendering context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) | The rendering context for the canvas on which the features' labels will be drawn. Different from `featureContext` if [`labels = "separate"`](/docs/tracks/configuration.md#labels-default-true).
> scale | Float | The scale for the image being drawn

#### view.drawBackground(features, context, params)
> Can be used like [`view.draw`](#viewdrawfeatures-featurecontext-labelcontext-scale) to draw a [background image](/docs/functions/controller.md#controllerrenderbackgroundfeatures-img--height-) for a track. 
> By default does nothing.
> 
> Argument | Type | Description
> --- | --- | ---
> features | Array | The features which were drawn on the foreground image
> context | [Canvas 2D rendering context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) | The rendering context for the canvas on which the background will be drawn
> params | Object | A set of properties required to create the image

#### view.drawFeature(feature, featureContext, labelContext, scale)
> Uses the [Canvas 2D rendering context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) to draw a feature on the `featureContext` canvas.
> Calls [`view.drawLabel`](#viewdrawlabelfeature-context-scale) if the feature has a label and [`labels`](/docs/tracks/configuration.md#labels-default-true) are being displayed.
> Calls [`view.decorateFeatures`](#viewdecoratefeaturefeature-context-scale) if `feature.decorations` is present.
> 
> Argument | Type | Description
> --- | --- | ---
> feature | Object | The feature to be drawn
> featureContext | [Canvas 2D rendering context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) | The rendering context for the canvas on which the feature will be drawn
> labelContext | [Canvas 2D rendering context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) | The rendering context for the canvas on which the feature's label will be drawn. Different from `featureContext` if [`labels = "separate"`](/docs/tracks/configuration.md#labels-default-true).
> scale | Float | The scale for the image being drawn

#### view.drawLabel(feature, labelContext, scale)
> Uses the [Canvas 2D rendering context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) to draw a feature's label on the `labelContext` canvas
>
> Argument | Type | Description
> --- | --- | ---
> feature | Object | The feature whose label will be drawn
> labelContext | [Canvas 2D rendering context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) | The rendering context for the canvas on which the label will be drawn
> scale | Float | The scale for the image being drawn

#### view.setFeatureColor(feature)
> Sets `feature.color` to [`view.color`](/docs/tracks/configuration.md#color-default-000000). Called by [`view.drawFeature`](#viewdrawfeaturefeature-featurecontext-labelcontext-scale) for features which don't have a `color` property.
> 
> Argument | Type | Description
> --- | --- | ---
> feature | Object | The feature whose `color` will be set

#### view.setLabelColor(feature)
> Sets `feature.labelColor` to [`view.fontColor`](/docs/tracks/configuration.md#fontcolor-default-undefined), `feature.color`, or [`view.color`](/docs/tracks/configuration.md#color-default-000000). Called by  [`view.drawLabel`](#viewdrawlabelfeature-labelcontext-scale) for features which don't have a `labelColor` property.
> 
> Argument | Type | Description
> --- | --- | ---
> feature | Object | The feature whose `labelColor` will be set

#### view.truncateForDrawing(feature)
> If a feature extends beyond the edge of the canvas, makes it start and end at 1px outside the canvas to reduce unnecessary drawing operations.
> Uses 1px outside rather than on the edges of the canvas in order to stop feature borders being erroneously included in an image (a border will be drawn at the start/end of a feature, meaning that a feature which ends at the end of a canvas will have a vertical border inside the canvas).
> 
> Argument | Type | Description
> --- | --- | ---
> feature | Object | The feature to truncate

#### view.decorateFeature(feature, featureContext, scale)
> Called by [`view.drawFeature`](#viewdrawfeaturefeature-featurecontext-labelcontext-scale) if `feature.decorations` is present. By default, [`view.drawFeature`](#viewdrawfeaturefeature-featurecontext-labelcontext-scale) draws features as rectangles. This function can be used to add other shapes if necessary, positioning them based on `feature.position[scale]`.
> By default does nothing.
>
> Argument | Type | Description
> --- | --- | ---
> feature | Object | The feature to decorate
> featureContext | [Canvas 2D rendering context](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) | The rendering context for the canvas on which the feature was drawn
> scale | Float | The scale for the image being drawn
