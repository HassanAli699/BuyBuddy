document.addEventListener("DOMContentLoaded", function () {
  const productDetailsContainer = document.getElementById(
    "productDetailsContainer"
  );
  productDetailsContainer.innerHTML = "";
  const productDetails = getProductDetailsFromURL();
  const backButton = document.getElementById("backButton");

  const productCard = createProductCard(productDetails);
  console.log(productDetails);
  productDetailsContainer.appendChild(productCard);
  fetchComparedProducts(productDetails.name);
  recommendProducts(productDetails.name, 1);

  const headerTitle = document.getElementById("headerTitle");
  headerTitle.innerHTML = productDetails.name;

  backButton.addEventListener("click", function () {
    history.back();
  });
});

function fetchComparedProducts(productName) {
  fetch(
    `http://127.0.0.1:5000/get_compared_products?user_search=${productName}`
  )
    .then((response) => response.json())
    .then((comparedProducts) => {
      if (comparedProducts && Array.isArray(comparedProducts.Data)) {
        displayComparedProducts(comparedProducts);
       
      } else {
        console.error(
          "Invalid or empty compared products data:",
          comparedProducts
        );
      }
    })
    .catch((error) =>
      console.error("Error fetching compared products:", error)
    );
}

function displayComparedProducts(comparedProducts) {
  const comparedProductsContainer = document.createElement("div");
  comparedProductsContainer.classList.add("compared-products-container");

    // Get the product details
    const productDetailsnew = getProductDetailsFromURL();

  // Iterate through compared products and create product cards
  comparedProducts.Data.forEach((comparedProduct) => {
    // Check if the compared product is different from the product details product
    if (comparedProduct.product_name !== productDetailsnew.name) {
      const comparedProductCard = createComparedProductCard(comparedProduct);
      comparedProductsContainer.appendChild(comparedProductCard);
    }
  });

  productDetailsContainer.appendChild(comparedProductsContainer);
}

function createComparedProductCard(comparedProduct) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("compared-product-card");

  const productImage = document.createElement("img");
  productImage.src = comparedProduct.product_image;
  productImage.alt = comparedProduct.product_name;
  productImage.classList.add("compared-product-image");
  cardElement.appendChild(productImage);

  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("compared-product-details");

  const productNameElement = document.createElement("span");
  productNameElement.textContent = comparedProduct.product_name;
  productNameElement.classList.add("compared-product-name");
  detailsContainer.appendChild(productNameElement);

  productNameElement.addEventListener("click", function () {
    window.open(comparedProduct.product_link, "_blank");
  });

  const productPriceElement = document.createElement("span");
  productPriceElement.textContent = `Price: Rs ${comparedProduct.product_price.toFixed(
    0
  )}`;
  productPriceElement.classList.add("compared-product-price");
  detailsContainer.appendChild(productPriceElement);


  const ratingContainer = document.createElement("div");
  ratingContainer.classList.add("compared-product-rating");

  const rating = comparedProduct.product_ratings || 0;
  for (let i = 0; i < 5; i++) {
    const starElement = document.createElement("i");
    starElement.classList.add(
      "fas",
      "fa-star",
      rating > i ? "filled" : "empty"
    );
    ratingContainer.appendChild(starElement);
  }
  detailsContainer.appendChild(ratingContainer);

  const productStoreElement = document.createElement("span");
  productStoreElement.textContent = `Store: ${comparedProduct.product_store}`;
  productStoreElement.classList.add("compared-product-store");
  detailsContainer.appendChild(productStoreElement);

  cardElement.appendChild(detailsContainer);

  return cardElement;
}

function createProductCard(productDetails) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("product-card");

  const productImage = document.createElement("img");
  productImage.src = productDetails.image;
  productImage.alt = productDetails.name;
  productImage.classList.add("product-image");
  cardElement.appendChild(productImage);

  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("product-details");

  const productNameElement = document.createElement("span");
  productNameElement.textContent = productDetails.name;
  productNameElement.classList.add("product-name");
  detailsContainer.appendChild(productNameElement);

  productNameElement.addEventListener("click", function () {
    window.open(productDetails.link, "_blank");
  });

  const productPriceElement = document.createElement("span");
  productPriceElement.textContent = `Price: Rs ${productDetails.price}`;
  productPriceElement.classList.add("product-price");
  detailsContainer.appendChild(productPriceElement);

  const productStoreElement = document.createElement("span");
  productStoreElement.textContent = `Store: ${productDetails.store}`;
  productStoreElement.classList.add("product-store");
  detailsContainer.appendChild(productStoreElement);

  const productCategoryElement = document.createElement("span");
  productCategoryElement.textContent = `Category: ${productDetails.category}`;
  productCategoryElement.classList.add("product-category");
  detailsContainer.appendChild(productCategoryElement);

  cardElement.appendChild(detailsContainer);

  return cardElement;
}

function getProductDetailsFromURL() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return {
    name: urlSearchParams.get("name"),
    image: urlSearchParams.get("image"),
    link: urlSearchParams.get("link"),
    ratings: urlSearchParams.get("ratings"),
    store: urlSearchParams.get("store"),
    category: urlSearchParams.get("category"),
    price: urlSearchParams.get("price"),
  };
}

function recommendProducts(query, page = 1) {
  fetch(
    `http://127.0.0.1:5000/hybrid_recommendations?product_name=${query}&page=${page}&page_size=${30}`
  )
    .then((response) => response.json())
    .then((recommendedData) => {
      if (recommendedData && Array.isArray(recommendedData.Data)) {
        const recommendedContainer = document.createElement("div");
        recommendedContainer.classList.add("recommended-products-container");

        recommendedData.Data.forEach((recommendedProduct) => {
          const recommendedCard =
            createRecommendedProductCard(recommendedProduct);
          recommendedContainer.appendChild(recommendedCard);
        });
        productDetailsContainer.appendChild(recommendedContainer);
      }
    })
    .catch((error) =>
      console.error("Error fetching recommended products:", error)
    );
}

function createRecommendedProductCard(result) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("recommended-product-card");

  const productLink = document.createElement("a");
  productLink.href = `/Pages/Explore/product_detailsPage.html?name=${result.product_name}&image=${result.product_image}&link=${result.product_link}&ratings=${result.product_ratings}&store=${result.product_store}&category=${result.product_category}&price=${result.product_price}`;
  productLink.classList.add("product-link");

  cardElement.addEventListener("click", function (event) {
    event.preventDefault();
    const productDetailsURL = productLink.href;
    window.location.href = productDetailsURL;
  });

  const productImage = document.createElement("img");
  productImage.src = result.product_image;
  productImage.alt = result.product_name;
  productImage.classList.add("recommended-product-image");
  cardElement.appendChild(productImage);

  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("recommended-product-details");

  const productNameElement = document.createElement("span");
  productNameElement.textContent = result.product_name;
  productNameElement.classList.add("recommended-product-name");
  detailsContainer.appendChild(productNameElement);

  const productPriceElement = document.createElement("span");
  productPriceElement.textContent = `Price: Rs ${result.product_price.toFixed(
    0
  )}`;
  productPriceElement.classList.add("recommended-product-price");
  detailsContainer.appendChild(productPriceElement);

  const productStoreElement = document.createElement("span");
  productStoreElement.textContent = `Store: ${result.product_store}`;
  productStoreElement.classList.add("recommended-product-store");
  detailsContainer.appendChild(productStoreElement);

  cardElement.appendChild(detailsContainer);

  return cardElement;
}

