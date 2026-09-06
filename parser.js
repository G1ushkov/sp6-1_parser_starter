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

    const sectionProduct = document.querySelector('section.product');
    const productId = sectionProduct.dataset.id;

    const productName = sectionProduct
        .querySelector('.title')
        .textContent
        .trim();

    const buttonLikeStatus = sectionProduct
        .querySelector('.like')
        .classList.contains('active');

    const price = parseInt(sectionProduct
        .querySelector('.price')
        .childNodes[0]
        .textContent
        .trim()
        .slice(1)
    );

    const oldPrice = parseInt(sectionProduct
        .querySelector('.price')
        .children[0]
        .textContent
        .trim()
        .slice(1)
    );

    const discount = oldPrice - price;

    const discountPercent = `${(discount / oldPrice * 100).toFixed(2)}%`;

    const currencySymbol = sectionProduct
        .querySelector('.price')
        .childNodes[0]
        .textContent
        .trim()
        .slice(0, 1);

    const currencyMap = {
        '₽': 'RUB',
        '$': 'USD',
        '€': 'EUR'
    };

    const currency = currencyMap[currencySymbol];

    const productProperties = sectionProduct.querySelectorAll('.properties li');

    const properties = {};

    productProperties.forEach(property => {
        const key = property.children[0].textContent.trim();
        const value = property.children[1].textContent.trim();

        properties[key] = value;
    });

    const productDescription = sectionProduct.querySelector('.description');
    const descriptionClone = productDescription.cloneNode(true);
    descriptionClone.querySelectorAll('*').forEach((element) => {
        for (const attribute of element.attributes) {
            element.removeAttribute(attribute.name);
        }
    });
    const description = descriptionClone.innerHTML.trim();

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
