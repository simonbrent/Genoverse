# Genoverse

Genoverse is a portable, customizable, back-end independent JavaScript and HTML5 based genome browser which allows the user to explore data in a dynamic and interactive manner.

Data is visualized in the browser, meaning Genoverse can be installed on any website and show data from a wide range of online or local sources.

Genoverse works with a variety of formats, such as XML, JSON, BED, BAM, VCF, GFF, or delimited text files, and can be customized to parse and display any data source as required.

Genoverse works using a system of **tracks** - essentially horizontal sections of the genome browser which display **features** - genes, variants, etc. with defined genomic start and end points. Each track has its own data, set stored in a **model**, a method for displaying that data, stored in a **view**, and a **controller** to manage the creation of DOM elements, and user interactions with them. 

Tracks can have multiple models and views, which allows for switching between displays at different zoom levels. An example of this would be a track where you show genes when looking at a large region of a chromosome, and then switch to showing transcripts as the user zooms in.

In addition to this, Genoverse has a set of [plugins](docs/plugins.md), which allow additional functionality beyond the core genome browser. These include a control panel for adding and removing tracks, and interacting with the browser more easily, a way to add controls to each individual track, and a way to enable drag and drop of local data files onto the genome browser.

## Installation

1. Download the latest version from GitHub
    ```
    git clone git@github.com:wtsi-web/Genoverse.git
    ```

2. Embed Genoverse using either
    ```html
    <script src="/path/to/Genoverse/js/genoverse.combined.js"></script>
    ```
    
    which comes with jQuery and jQuery UI included, or 
    ```html
    <script src="/path/to/Genoverse/js/genoverse.combined.nojquery.js"></script>
    ```
    
    if you already have them in the page

3. Add a script tag or JavaScript file which initializes Genoverse, e.g.
  ```html
  <script>
    $(document).ready(function () {
      var genoverse = new Genoverse({ ... configuration ... });
    });
  </script>
  ```
  For more details about configuration properties, see [here](docs/configuration.md).

