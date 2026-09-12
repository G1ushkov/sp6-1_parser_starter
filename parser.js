const currencyMap = {
    '₽': 'RUB',
    '$': 'USD',
    '€': 'EUR'
};

// Meta

function parseMeta() {
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

    return {
        title: title,
        description: metaDescriptionContent,
        keywords: metaKeywordsContent,
        language: pageLanguage,
        opengraph: opengraph,
    }
}

// Product price

function parsePrice(priceElement) {
    const price = parseInt(
        priceElement.childNodes[0].textContent.trim().slice(1));

    const oldPriceElement = priceElement.querySelector('span');

    let oldPrice;
    if (oldPriceElement === null) {
        oldPrice = price;
    } else {
        oldPrice = parseInt(oldPriceElement.textContent.trim().slice(1));
    }

    const discount = oldPrice - price;
    const discountPercent = `${(discount / oldPrice * 100).toFixed(2)}%`;

    const currencySymbol = priceElement
        .childNodes[0]
        .textContent
        .trim()
        .slice(0, 1);
    const currency = currencyMap[currencySymbol];

    return {
        price,
        oldPrice,
        discount,
        discountPercent,
        currency
    }
}

// Product properties

function parseProperties(productProperties) {
    const properties = {};

    productProperties.forEach(property => {
        const key = property.children[0].textContent.trim();
        const value = property.children[1].textContent.trim();

        properties[key] = value;
    });

    return properties;
}

// Product description

function parseDescription(productDescription) {
    const descriptionClone = productDescription.cloneNode(true);

    descriptionClone.querySelectorAll('*').forEach((element) => {
        for (const attribute of element.attributes) {
            element.removeAttribute(attribute.name);
        }
    });

    const description = descriptionClone.innerHTML.trim();

    return description;
}

// Product images

function parseImages(productImages) {
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

    return images;
}

// Product tags

function parseTags(productTags) {
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

    return tags;
}

// Product

function parseProduct(sectionProduct) {

    const productId = sectionProduct.dataset.id;

    const productName = sectionProduct
        .querySelector('.title')
        .textContent
        .trim();

    const buttonLikeStatus = sectionProduct
        .querySelector('.like')
        .classList.contains('active');

    // price

    const priceElement = sectionProduct.querySelector('.price');
    const priceData = parsePrice(priceElement);
    const price = priceData.price;
    const oldPrice = priceData.oldPrice;
    const discount = priceData.discount;
    const discountPercent = priceData.discountPercent;
    const currency = priceData.currency;

    // properties

    const productProperties = sectionProduct.querySelectorAll('.properties li');
    const properties = parseProperties(productProperties);

    // description

    const productDescription = sectionProduct.querySelector('.description');
    const description = parseDescription(productDescription);

    // images

    const productImages = sectionProduct.querySelectorAll('.preview nav img');
    const images = parseImages(productImages);

    // tags

    const productTags = sectionProduct.querySelectorAll('.tags span');
    const tags = parseTags(productTags);

    return {
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
    }
}

// Suggested products

function parseSuggested(suggestedProducts) {
    const suggested = [];

    for (const suggestedItem of suggestedProducts) {
        const name = suggestedItem.querySelector('h3').textContent.trim();
        const description = suggestedItem.querySelector('p').textContent.trim();
        const image = suggestedItem.querySelector('img').getAttribute('src');
        const suggestedPrice = suggestedItem.querySelector('b').textContent.trim();
        const currencySymbol = suggestedPrice.slice(0, 1);
        const currency = currencyMap[currencySymbol];
        const price = suggestedPrice.slice(1);

        const suggestedObject = {
            name: name,
            description: description,
            image: image,
            currency: currency,
            price: price
        }

        suggested.push(suggestedObject);
    }

    return suggested;
}

// Reviews

function parseReviews(reviewItems) {
    const reviews = [];

    for (const reviewItem of reviewItems) {
        const title = reviewItem.querySelector('.title').textContent.trim();
        const description = reviewItem.querySelector('p').textContent.trim();
        const author = reviewItem.querySelector('.author');
        const avatar = author.querySelector('img').getAttribute('src');
        const name = author.querySelector('span').textContent.trim();
        const date = author.querySelector('i').textContent.trim().split('/').join('.');
        const rating = reviewItem.querySelectorAll('.filled').length;

        const reviewObject = {
            rating: rating,
            author: {
                avatar: avatar,
                name: name
            },
            title: title,
            description: description,
            date: date
        }

        reviews.push(reviewObject);
    }

    return reviews;
}

function parsePage() {

    // Meta
    const meta = parseMeta();

    // Product
    const sectionProduct = document.querySelector('section.product');
    const product = parseProduct(sectionProduct);

    // Suggested products

    const suggestedProducts = document.querySelectorAll('.suggested article');
    const suggested = parseSuggested(suggestedProducts);

    // Reviews

    const reviewItems = document.querySelectorAll('.reviews article');
    const reviews = parseReviews(reviewItems);


    return {
        meta,
        product,
        suggested,
        reviews
    };
}

window.parsePage = parsePage;

console.log(parsePage());
