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

    const oldPriceElement = sectionProduct.querySelector('.price span');

    let oldPrice;

    if (oldPriceElement === null) {
        oldPrice = price;
    } else {
        oldPrice = parseInt(oldPriceElement.textContent.trim().slice(1));
    }


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

    const productImages = sectionProduct.querySelectorAll('.preview nav img');

    const images = [];

    for (const image of productImages) {
        const full = image.dataset.src;
        const preview = image.getAttribute('src');
        const alt = image.getAttribute('alt');

        const imageObject = {
            preview: preview,
            full: full,
            alt: alt,
        }

        images.push(imageObject);
    }

    const productTags = sectionProduct.querySelectorAll('.tags span');

    const tags = {
        category: [],
        discount: [],
        label: []
    };

    for (const tag of productTags) {
        if (tag.classList.contains('green')) {
            tags.category.push(tag.textContent.trim());
        } else if (tag.classList.contains('blue')) {
            tags.label.push(tag.textContent.trim());
        } else if (tag.classList.contains('red')) {
            tags.discount.push(tag.textContent.trim());
        }
    }

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
        product: {
            id: productId,
            name: productName,
            isLiked: buttonLikeStatus,
            tags: tags,
            price: price,
            oldPrice: oldPrice,
            discount: discount,
            discountPercent: discountPercent,
            currency: currency,
            properties: properties,
            description: description,
            images: images
        },
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;

console.log(parsePage());
