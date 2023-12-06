document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const searchResultsElement = document.getElementById("searchResults");
  const backButton = document.getElementById("backButton");
  searchInput.focus();

  searchButton.addEventListener("click", function () {
    const searchTerm = searchInput.value;
    if (searchTerm.trim() !== "") {
      performSearch(searchTerm);
      searchResultsElement.innerHTML = "";
    }
  });

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const searchTerm = searchInput.value;
      if (searchTerm.trim() !== "") {
        performSearch(searchTerm);
        searchResultsElement.innerHTML = "";
      }
    }
  });

  backButton.addEventListener("click", function () {
    window.location.href = "/Pages/popup.html";
  });

  function performSearch(query, page = 1) {
    fetch(
      `http://127.0.0.1:5000/search_products?product_name=${query}&page=${page}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);

        if (data && Array.isArray(data.Data)) {
          totalPages = data.total_pages;

          searchResultsElement.innerHTML = "";
          data.Data.forEach((result) => {
            const cardElement = createProductCard(result);
            searchResultsElement.appendChild(cardElement);
          });
          renderPageNumbers(data.current_page, data.total_pages);
          recommendProducts(query, page);
        } else {
          searchResultsElement.textContent = "No results found.";
          console.log("Empty or invalid API response:", data);
        }
      })
      .catch((error) => console.error("Error performing search:", error));
  }

  function recommendProducts(query, page = 1) {
    fetch(
      `http://127.0.0.1:5000/recommend?product_name=${query}&page=${page}`
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
          searchResultsElement.appendChild(recommendedContainer);
        }
      })
      .catch((error) =>
        console.error("Error fetching recommended products:", error)
      );
  }

  function createProductCard(result) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("product-card");

    const productImage = document.createElement("img");
    productImage.src = result.product_image;
    productImage.alt = result.product_name;
    productImage.classList.add("product-image");
    cardElement.appendChild(productImage);

    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("product-details");

    const productNameElement = document.createElement("span");
    productNameElement.textContent = result.product_name;
    productNameElement.classList.add("product-name");
    detailsContainer.appendChild(productNameElement);

    productNameElement.addEventListener("click", function () {
      window.open(result.product_link, "_blank");
    });

    const productPriceElement = document.createElement("span");
    productPriceElement.textContent = `Price: Rs ${result.product_price.toFixed(
      0
    )}`;
    productPriceElement.classList.add("product-price");
    detailsContainer.appendChild(productPriceElement);

    const ratingContainer = document.createElement("div");
    ratingContainer.classList.add("product-rating");

    const rating = result.product_ratings || 0; 
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
    productStoreElement.textContent = `Store: ${result.product_store}`;
    productStoreElement.classList.add("product-store");
    detailsContainer.appendChild(productStoreElement);

    cardElement.appendChild(detailsContainer);

    return cardElement;
  }

  function renderPageNumbers(currentPage, totalPages) {
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    const pagesContainer = document.createElement("div");
    pagesContainer.classList.add("page-numbers-container");

    for (let i = startPage; i <= endPage; i++) {
      const pageElement = document.createElement("span");
      pageElement.textContent = i;
      pageElement.classList.add("page-number");

      if (i === currentPage) {
        pageElement.classList.add("current-page");
      }

      pageElement.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
        performSearch(searchInput.value, i);
      });

      pagesContainer.appendChild(pageElement);
    }
    searchResultsElement.appendChild(pagesContainer);
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

  
});
