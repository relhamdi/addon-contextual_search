importScripts('config.js');

let searchEngines;
let imageSearchEngines;
let separatorName;

chrome.runtime.onInstalled.addListener(async () => {
    // Init config data
    await initializeData();
    // Load data
    await loadData();
    // Execute main
    main();
});

const loadData = async () => {
    // Load config data
    const result = await chrome.storage.local.get(['configData']);
    searchEngines = result?.configData?.searchEngines || [];
    imageSearchEngines = result?.configData?.imageSearchEngines || [];
    separatorName = result?.configData?.separatorName || '';

    console.log('Config file retrieved.');
    console.log(`> ${searchEngines.length} text search engines loaded.`)
    console.log(`> ${imageSearchEngines.length} image search engines loaded.`)
};

const main = () => {
    // Text search menu
    chrome.contextMenus.create({
        id: 'searchText',
        title: '🔍 Search for: \'%s\'',
        contexts: ['selection'],
    });

    // Text search engines buttons
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

    // Image search engines buttons
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

    // Clic listener
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        let query = '';

        if (info.menuItemId.startsWith('search_')) {
            // Text search
            query = encodeURIComponent(info.selectionText);
            const engine = searchEngines.find(e => 'search_' + e.name === info.menuItemId);
            if (engine) {
                const searchUrl = engine.url.replace('%s', query);
                chrome.tabs.create({ url: searchUrl });
            }
        } else if (info.menuItemId.startsWith('imageSearch_')) {
            // Image search
            query = encodeURIComponent(info.srcUrl);
            const engine = imageSearchEngines.find(e => 'imageSearch_' + e.name === info.menuItemId);
            if (engine) {
                const searchUrl = engine.url.replace('%s', query);
                chrome.tabs.create({ url: searchUrl });
            }
        }
    });
};