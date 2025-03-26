// Constants
const SEPARATOR_NAME = 'separator';

// Custom text search engines
const SEARCH_ENGINES = [
    { name: 'Google', url: 'https://www.google.com/search?q=%s' },
    { name: 'Bing', url: 'https://www.bing.com/search?q=%s' },

    { name: SEPARATOR_NAME, url: '' },

    { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=%s' },
    { name: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/%s' },
];

// Custom image search engines
const IMAGE_SEARCH_ENGINES = [
    { name: 'Google Lens', url: 'https://lens.google.com/uploadbyurl?url=%s' },
    { name: 'Yandex', url: 'https://yandex.com/images/search?rpt=imageview&url=%s' },

    { name: SEPARATOR_NAME, url: '' },

    { name: 'Bing Images', url: 'https://www.bing.com/images/search?q=%s' }
];

const data = {
    searchEngines: SEARCH_ENGINES,
    imageSearchEngines: IMAGE_SEARCH_ENGINES,
    separatorName: SEPARATOR_NAME,
}

const initializeData = async () => {
    // Save data
    await chrome.storage.local.set({ configData: data });
    console.log('Config file initialized.');
}
