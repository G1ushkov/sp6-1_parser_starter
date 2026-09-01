// @todo: напишите здесь код парсера

function parsePage() {

    // Meta

    const pageTitle = document.querySelector('title');
    const title = pageTitle.textContent.split('—')[0].trim();

    const metaDescription = document.querySelector('meta[name="description"]');
    const metaDescriptionContent = metaDescription.getAttribute('content').trim();

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const metaKeywordsContent = metaKeywords
        .getAttribute('content')
        .split(',')
        .map((keyword) => keyword.trim());

    const pageLanguage = document.querySelector('html').getAttribute('lang').trim();

    const opengraphMeta = document.querySelectorAll('meta[property]');

    const opengraph = {};

    opengraphMeta.forEach(meta => {
        const key = meta.getAttribute('property').split(':')[1];
        let value = meta.getAttribute('content').trim();

        if (key === 'title') {
            value = value.split('—')[0].trim();
        }

        opengraph[key] = value;
    });

    // Product

    // Suggested products

    // Reviews

    return {
        meta: {
            title: title,
            description: metaDescriptionContent,
            keywords: metaKeywordsContent,
            language: pageLanguage,
            opengraph: opengraph,
        },
        product: {},
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;

console.log(parsePage());
