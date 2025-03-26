# Chromium add-on - Contextual Search

Add-on for Chromium-based browsers that adds contextual menu buttons linked to custom search engines.

If a word is selected, text-based search engines will be displayed.
If an image is selected, image-based search engines will be displayed.

> Note: Only tested on Brave.


## Config

You can register custom search engines in the `config/config.base.json` file, that needs to be renamed in `config/config.json`.

Rules on search engines definition:
- Object must have the `name` and `url` properties
- `url` must contains the `%s` symbol, where the query will be replaced

> Note 1: It is possible to add separators between search engines, to organize them. Just add an Object with an empty `name`, further examples in `config/config.base.json` (the `url` property is not used here).

> Note 2: It is possible to register an engine in the config file, but without displaying it through the extension. For that, add a `hidden` property that equals `true` for the targeted engine, further examples in `config/config.base.json`.


## Installation

1. Clone this repo / Download as zip (then unzip) at the desired location
2. Register your search engines (as said in the previous part)
3. Type in `chrome://extensions/` in your Chromium browser
4. Enable developer mode (if needed)
5. Select *loading an unpacked extension* and select the repo's directory


## Usage

- Select an element and right-clic to open the contextual menu, then you'll have access to the textual search engines in the add-on's part
- Right-clic on an image to open the contextual menu, then you'll have access to the image search engines in the add-on's part


## Update

1. Pull updates in the repo / Re-download as zip (then unzip) at the same location
2. Type in `chrome://extensions/` in your Chromium browser
3. Enable developer mode (if needed)
4. Look for the **Contextual search** extension and reload it to apply changes


## TODO

- More testing
- Check if search engines were wrongly defined
- Make so that, once the search tab is closed, the caller tab is again selected (?)