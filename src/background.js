let searchEngines;
let imageSearchEngines;
let separatorName;

// Read config file
const loadConfigData = async () => {
    try {
        const response = await fetch(chrome.runtime.getURL('config/config.json'));
        const data = await response.json();

        // Load data
        searchEngines = data?.searchEngines || [];
        imageSearchEngines = data?.imageSearchEngines || [];
        separatorName = data?.separatorName || '';

        console.log('Config file loaded.');
        console.log(`> ${searchEngines.length} text search engines loaded.`)
        console.log(`> ${imageSearchEngines.length} image search engines loaded.`)
    } catch (error) {
        console.error('Error while loading the config file:', error);
    }
};

// Build context menu items
const buildContextMenuItems = async () => {
    // Delete elements to avoid duplicates when app is reloaded
    await chrome.contextMenus.removeAll();

    // Text search menu
    chrome.contextMenus.create({
        id: 'searchText',
        title: '🔍 Search for: \'%s\'',
        contexts: ['selection'],
    });

    // Text search engines buttons and separators
    searchEngines.forEach((engine, index) => {
        if (engine.name === separatorName) {
            chrome.contextMenus.create({
                id: 'separator_' + index,
                parentId: 'searchText',
                type: 'separator',
                contexts: ['selection'],
            });
        } else {
            chrome.contextMenus.create({
                id: 'search_' + engine.name,
                parentId: 'searchText',
                title: 'On ' + engine.name,
                contexts: ['selection'],
            });
        }
    });

    // Image search menu
    chrome.contextMenus.create({
        id: 'searchImage',
        title: '🖼️ Search this image',
        contexts: ['image'],
    });

    // Image search engines buttons and separators
    imageSearchEngines.forEach((engine, index) => {
        if (engine.name === separatorName) {
            chrome.contextMenus.create({
                id: 'separator_' + index,
                parentId: 'searchImage',
                type: 'separator',
                contexts: ['image'],
            });
        } else {
            chrome.contextMenus.create({
                id: 'imageSearch_' + engine.name,
                parentId: 'searchImage',
                title: 'On ' + engine.name,
                contexts: ['image'],
            });
        }
    });
};

const main = async () => {
    // Load data
    await loadConfigData();
    // Build context menu
    await buildContextMenuItems();
};

// onClick => Display options and search the element
chrome.contextMenus.onClicked.addListener((info, tab) => {
    let query = '';

    if (info.menuItemId.startsWith('search_')) {
        // Text search
        query = encodeURIComponent(info.selectionText);
        const engine = searchEngines.find(e => 'search_' + e.name === info.menuItemId);
        if (engine) {
            const searchUrl = engine.url.replace('%s', query);
            console.log(`'${engine.name}' search with: ${searchUrl}`);
            chrome.tabs.create({ url: searchUrl });
        }

    } else if (info.menuItemId.startsWith('imageSearch_')) {
        // Image search
        query = encodeURIComponent(info.srcUrl);
        const engine = imageSearchEngines.find(e => 'imageSearch_' + e.name === info.menuItemId);
        if (engine) {
            const searchUrl = engine.url.replace('%s', query);
            console.log(`'${engine.name}' search with: ${searchUrl}`);
            chrome.tabs.create({ url: searchUrl });
        }
    }
});

console.log('Extension loaded');
main();