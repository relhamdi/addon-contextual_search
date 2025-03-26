const SEARCH_TEXT_ID = 'searchText';
const SEARCH_IMAGE_ID = 'searchImage';

const SEARCH_TEXT_PREFIX = 'textSearch_';
const SEARCH_IMAGE_PREFIX = 'imageSearch_';

let searchEngines;
let imageSearchEngines;
let lastClickInfo = null;

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

    // Text search engines buttons and separators
    searchEngines.forEach((engine, index) => {
        if (engine.hidden) return;

        if (engine.name) {
            chrome.contextMenus.create({
                id: SEARCH_TEXT_PREFIX + engine.name,
                parentId: SEARCH_TEXT_ID,
                title: 'On ' + engine.name,
                contexts: ['selection'],
            });
        } else {
            chrome.contextMenus.create({
                id: 'separator_' + index,
                parentId: SEARCH_TEXT_ID,
                type: 'separator',
                contexts: ['selection'],
            });
        }
    });

    // Image search menu
    chrome.contextMenus.create({
        id: SEARCH_IMAGE_ID,
        title: '🖼️ Search this image',
        contexts: ['image'],
    });

    // Image search engines buttons and separators
    imageSearchEngines.forEach((engine, index) => {
        if (engine.hidden) return;

        if (engine.name) {
            chrome.contextMenus.create({
                id: SEARCH_IMAGE_PREFIX + engine.name,
                parentId: SEARCH_IMAGE_ID,
                title: 'On ' + engine.name,
                contexts: ['image'],
            });
        } else {
            chrome.contextMenus.create({
                id: 'separator_' + index,
                parentId: SEARCH_IMAGE_ID,
                type: 'separator',
                contexts: ['image'],
            });
        }
    });
};

// Contextual menu management
const handleContextMenuClick = async (info, tab) => {
    let query = '';

    if (!searchEngines || !imageSearchEngines) {
        await loadConfigData();
    }

    if (info.menuItemId.startsWith(SEARCH_TEXT_PREFIX)) {
        // Text search
        query = encodeURIComponent(info.selectionText);
        const engine = searchEngines.find(e => SEARCH_TEXT_PREFIX + e.name === info.menuItemId);
        if (engine) {
            const searchUrl = engine.url.replace('%s', query);
            console.log(`> '${engine.name}' search with: ${searchUrl}`);
            chrome.tabs.create({ url: searchUrl, index: tab.index + 1 });
        }

    } else if (info.menuItemId.startsWith(SEARCH_IMAGE_PREFIX)) {
        // Image search
        query = encodeURIComponent(info.srcUrl);
        const engine = imageSearchEngines.find(e => SEARCH_IMAGE_PREFIX + e.name === info.menuItemId);
        if (engine) {
            const searchUrl = engine.url.replace('%s', query);
            console.log(`> '${engine.name}' search with: ${searchUrl}`);
            chrome.tabs.create({ url: searchUrl, index: tab.index + 1 });
        }
    }
};

const main = async () => {
    // Load data
    await loadConfigData();
    // Build context menu
    await buildContextMenuItems();
};


// onClicked => Handle first click after waking up
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (lastClickInfo) {
        await handleContextMenuClick(lastClickInfo.info, lastClickInfo.tab);
        lastClickInfo = null;
    } else {
        await handleContextMenuClick(info, tab);
    }
});

// onStartup => Run action
chrome.runtime.onStartup.addListener(() => {
    if (lastClickInfo) {
        setTimeout(async () => {
            await handleContextMenuClick(lastClickInfo.info, lastClickInfo.tab);
            lastClickInfo = null;
        }, 300);
    }
});


console.log('🚀 Extension loaded');
main();