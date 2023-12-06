document.addEventListener("DOMContentLoaded", function () {
  getTopRated();

  backButton.addEventListener("click", function () {
    window.location.href = "/Pages/popup.html"; 
  });
});

function getTopRated(page = 1) {
  const exploreResultsElement = document.getElementById("exploreResults");
  fetch(`http://127.0.0.1:5000/top_rated_products?page=${page}`)
    .then((response) => response.json())
    .then((data) => {
      if (data && Array.isArray(data.Data)) {
        exploreResultsElement.innerHTML = "";
        data.Data.forEach((product) => {
          const productCard = createProductCard(product);
          exploreResultsElement.appendChild(productCard);
        });
        renderPageNumbers(data.current_page, data.total_pages);
      } else {
        exploreResultsElement.textContent = "No top-rated products found.";
      }
    })
    .catch((error) =>
      console.error("Error fetching top-rated products:", error)
    );
}

function createProductCard(result) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("product-card");

  const productLink = document.createElement("a");
  productLink.href = `product_detailsPage.html?name=${result.product_name}&image=${result.product_image}&link=${result.product_link}&ratings=${result.product_ratings}&store=${result.product_store}&category=${result.product_category}&price=${result.product_price}`;
  productLink.classList.add("product-link");

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

  cardElement.addEventListener("click", function (event) {
    event.preventDefault(); 
    const productDetailsURL = productLink.href;
    window.location.href = productDetailsURL;
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
  const exploreResultsElement = document.getElementById("exploreResults");
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
      getTopRated(i);
    });

    pagesContainer.appendChild(pageElement);
  }
  exploreResultsElement.appendChild(pagesContainer);
}
