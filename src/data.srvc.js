import faker from "faker"

/** Public stuff ***************************************************************/

const getProductList = (thisMany) => {
    let delay = getRandomInt(50, 150);
    let productNames = fakeProductList(thisMany);

    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(productNames), delay);
    })
}

const getProductDetails = (name) => {
    let delay = getRandomInt(2000, 5000);
    let productDetails = fakeProductDetails(name);

    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(productDetails), delay);
    })
}

/** Private stuff **************************************************************/

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const fakeProductList = (thisMany) => {
    let names = [];

    for (let i = 0; i < thisMany; i++) {
        names.push({id: i, name: faker.commerce.productName()});
    }

    return names;
}

const fakeProductDetails = (name) => {
    return {
        name,
        details: [faker.lorem.paragraphs(), faker.lorem.paragraphs()].join(" ")
    };
}

/** Exports ********************************************************************/

export {getProductList, getProductDetails}
