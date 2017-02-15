# Plugins

Genoverse browser provides constitutive core functionality. `Genoverse.Plugins` namespace contains a set of optional, additional pieces of functionality - plugins - some projects may need and others might not.

Genoverse can asynchronously load plugins from its [js/plugins](https://github.com/wtsi-web/Genoverse/tree/gh-pages/js/plugins) directory on your server itself. Or you may explicitly import plugins in your html with, for example, `<script src="Genoverse/js/plugins/controlPanel.js">` for slightly faster load times.

## List of plugins

### controlPanel
Adds
 - a "Tracks" button to the top left of the genome browser, which when clicked displays a list of enabled and available tracks, to be added or removed.
 - a suite of buttons to the right of the genome browser, for scrolling, zooming and selecting regions of the genome
 - the `karyotype` plugin

### karyotype
Adds an ideogram of the chromosome being used by the genome browser, with a marker showing the currently viewed region. The marker and be dragged and resized to change region, and chromosome bands can be jumped to by clicked on them.

### trackControls
Adds a toggleable pop-out menu on the right side of the track, containing buttons to view track information, remove the track, toggle the track between fixed height and auto resizing, and change track filters/configuration settings, if there are any.

### resizer
Adds a draggable handle to the bottom of each track, to allow the user to resize it to their desired height. If this plugin is not in use, tracks can only be resized to show all features currently in view.

### focusRegion
Adds a button to the control panel to move the viewpoint to a particular region of the genome. The `controlPanel` plugin will be added if not already in use.

### fullscreen
Adds a button to the control panel to enable the toggling of a full screen view of the genome browser. The `controlPanel` plugin will be added if not already in use.

### tooltips
Adds a button to the control panel to enable the toggling of a help tooltips for the genome browser. The `controlPanel` plugin will be added if not already in use.

### fileDrop
Adds the ability to drag and drop a local data file onto the genome browser, and have its data displayed as a track.
