const SEARCH_TEXT_ID = 'searchText';
const SEARCH_IMAGE_ID = 'searchImage';

const SEARCH_TEXT_PREFIX = 'textSearch_';
const SEARCH_IMAGE_PREFIX = 'imageSearch_';

let searchEngines;
let imageSearchEngines;


// Read config file
const loadConfigData = async () => {
    try {
        const response = await fetch(chrome.runtime.getURL('config/config.json'));
        const data = await response.json();

        // Load data
        searchEngines = data?.searchEngines || [];
        imageSearchEngines = data?.imageSearchEngines || [];

        console.log('✅ Config file loaded.');
        console.log(`> ${searchEngines.length} text search engines loaded.`)
        console.log(`> ${imageSearchEngines.length} image search engines loaded.`)
    } catch (error) {
        console.error('❌ Error while loading the config file:', error);
    }
};

// Create context menu items based on parameters
const createMenuItems = (menuId, engines, prefix, context) => {
    engines.forEach((engine, index) => {
        // Skip if engine is not wanted
        if (engine.hidden) return;

        if (engine.name) {
            // If engine has a name, display it
            chrome.contextMenus.create({
                id: prefix + engine.name,
                parentId: menuId,
                title: 'On ' + engine.name,
                contexts: [context],
            });
        } else {
            // Else, add a separator
            chrome.contextMenus.create({
                id: 'separator_' + index,
                parentId: menuId,
                type: 'separator',
                contexts: [context],
            });
        }
    });
};

// Build context menu items
const buildContextMenuItems = async () => {
    // Delete elements to avoid duplicates when app is reloaded
    await chrome.contextMenus.removeAll();

    // Text search menu
    chrome.contextMenus.create({
        id: SEARCH_TEXT_ID,
        title: '🔍 Search for: \'%s\'',
        contexts: ['selection'],
    });

    // Create the text search engines items
    createMenuItems(SEARCH_TEXT_ID, searchEngines, SEARCH_TEXT_PREFIX, 'selection');

    // Image search menu
    chrome.contextMenus.create({
        id: SEARCH_IMAGE_ID,
        title: '🖼️ Search this image',
        contexts: ['image'],
    });

    // Create the image search engines items
    createMenuItems(SEARCH_IMAGE_ID, imageSearchEngines, SEARCH_IMAGE_PREFIX, 'image');
};

// Contextual menu management
const handleContextMenuClick = async (info, tab) => {
    let query = '';
    let engine;

    // Load data if necessary
    if (!searchEngines || !imageSearchEngines) {
        await loadConfigData();
    }

    if (info.menuItemId.startsWith(SEARCH_TEXT_PREFIX)) {
        // Text search
        query = encodeURIComponent(info.selectionText);
        engine = searchEngines.find(e => SEARCH_TEXT_PREFIX + e.name === info.menuItemId);

    } else if (info.menuItemId.startsWith(SEARCH_IMAGE_PREFIX)) {
        // Image search
        query = encodeURIComponent(info.srcUrl);
        engine = imageSearchEngines.find(e => SEARCH_IMAGE_PREFIX + e.name === info.menuItemId);
    }

    // Open search in new tab
    if (engine) {
        const searchUrl = engine.url.replace('%s', query);
        console.log(`> '${engine.name}' search with: ${searchUrl}`);
        chrome.tabs.create({ url: searchUrl, index: tab.index + 1 });
    }
};

const main = async () => {
    // Load data
    await loadConfigData();
    // Build context menu
    await buildContextMenuItems();
};


// onClicked => Handle click on contextual menu
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    await handleContextMenuClick(info, tab);
});


console.log('🚀 Extension loaded.');
main();