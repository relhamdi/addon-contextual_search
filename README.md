# Chromium add-on - Contextual Search

Add-on for Chromium-based browsers that adds contextual menu buttons linked to custom search engines.

If a word is selected, text-based search engines will be displayed.
If an image is selected, image-based search engines will be displayed.

> Note: Only tested on Brave.


## Config

You can register custom search engines in the `src/config.base.js` file, that needs to be renamed in `src/config.js`.

Rules on search engines definition:
- Object must have the `name` and `url` properties
- `url` must contains the `%s` symbol, where the query will be replaced

> Note: It is possible to add separators between search engines, to organize them. Just add an Object with a name equals to the **SEPARATOR_NAME** variable, further example in `src/config.base.js` (the `url` property is not used).


## Installation

1. Clone this repo / Download as zip (then unzip) at the desired location
2. Type in `chrome://extensions/` in your Chromium browser
3. Enable developer mode (if needed)
4. Select *loading an unpacked extension* and select the repo's directory


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