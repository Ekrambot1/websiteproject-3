(function () {
  "use strict";

  var tinyslider = function () {
    var el = document.querySelectorAll(".testimonial-slider");

    if (el.length > 0) {
      var slider = tns({
        container: ".testimonial-slider",
        items: 1,
        axis: "horizontal",
        controlsContainer: "#testimonial-nav",
        swipeAngle: false,
        speed: 700,
        nav: true,
        controls: true,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 3500,
        autoplayButtonOutput: false,
      });
    }
  };
  tinyslider();
})();

// Select all elements with the class 'add-cart'
const addToCartButtons = document.querySelectorAll(".add-cart");

// Add a click event listener to each button
addToCartButtons.forEach((button) => {
  button.addEventListener("click", function () {
    console.log("Button clicked");
    addToCart(button);
  });
});

let productArray = [];

function addToCart(cartBtn) {
  var parentDiv = cartBtn.closest(".product-item");
  var title = parentDiv.querySelector(".product-title").innerText;
  var imgSrc = parentDiv
    .querySelector(".product-thumbnail")
    .getAttribute("src");
  var price = parentDiv.querySelector(".product-price").innerText;
  //   console.log(title, imgSrc, price);
  var product = { title, imgSrc, price };

  if (productArray.find((element) => element.title == product.title)) {
    var myModal = new bootstrap.Modal(document.getElementById("myModal1"));
    myModal.show();
    return;
  } else {
    productArray.push(product);
    setstorage();
  }
  var myModal = new bootstrap.Modal(document.getElementById("myModal2"));
  myModal.show();
  updateTotal();
}
function setstorage() {
  var itemval = JSON.stringify(productArray);
  localStorage.setItem("items", itemval);
}
window.addEventListener("load", getstorage);

function getstorage() {
  const storedValue = JSON.parse(localStorage.getItem("items"));

  if (Array.isArray(storedValue)) {
    storedValue.forEach((value) => {
      var title = value.title;
      var price = value.price;
      var imgSrc = value.imgSrc;
      console.log(title, price, imgSrc);

      if (title && price && imgSrc) {
        let newProductElement = createproduct(imgSrc, title, price);
        let element = document.createElement("tr");
        element.setAttribute("class", "cart-item");
        element.innerHTML = newProductElement;
        let cartBasket = document.querySelector(".cart-items");
        cartBasket.append(element);
      } else {
        console.log("Invalid item format:", value);
      }
    });
  } else {
    console.log("No items found in local storage or invalid format.");
  }
  updateTotal();
}

function createproduct(imgSrc, title, price) {
  return `
									<td class="product-thumbnail">
										<img src="${imgSrc}"class="img-fluid">
									</td>
									<td class="product-name">
										<h2 class="cart-title h5 text-black">${title}</h2>
									</td>
									<td class="price">${price}</td>
									<td>
										<div class="input-group mb-3 ms-5 d-flex align-items-center quantity-container"
											style="max-width: 150px;">
											<input type="number" class="text-center quantity-amount"
												 min="1" max="10" placeholder="" width:"20px"
											   onchange="updateTotal()"
												aria-describedby="button-addon1">
										</div>
									</td>
									<td class="total-price">${price}</td>
									<td><a class="cart-remove-item" >Remove</a></td>
								`;
}
function updateTotal() {
  var cartItems = document.querySelectorAll(".cart-item");
  var totalValue = document.querySelector(".subtotal-price");

  let total = 0;

  cartItems.forEach((product) => {
    let priceElement = product.querySelector(".price");
    let price = parseFloat(priceElement.innerText.replace("$", ""));

    let quantityInput = product.querySelector(".quantity-amount");
    let qty = parseInt(quantityInput.value);

    // Validate the quantity to be within the range of 1 to 10
    if (isNaN(qty) || qty < 1) {
      qty = 1;
      quantityInput.value = qty;
    } else if (qty > 10) {
      qty = 10;
      quantityInput.value = qty;
    }

    total += price * qty;
    product.querySelector(".total-price").innerText =
      "$" + (price * qty).toFixed(2);
  });

  totalValue.innerHTML = "$" + " " + total.toFixed(2); // Display total with two decimal places

  // // Add Product Count in Cart Icon
  // var cartCount = document.querySelector(".cart-count");
  // let count = productArray.length;
  // cartCount.innerHTML = count;

  // if (count == 0) {
  //   cartCount.style.display = "none";
  // } else {
  //   cartCount.style.display = "block";
  // }
}
let couponApplied = false;
function applyCoupon() {
  if (couponApplied) {
    alert("Coupon code has already been applied.");
    return;
  }
  const couponCodeInput = document.getElementById("coupon");
  const totalPriceDisplay = document.querySelector(".subtotal-price");
  const disamount = document.querySelector(".discount");
  const coupon = document.querySelector(".coupon");
  const couponCode = couponCodeInput.value;

  const validCouponCode = "ekram";
  const discountAmount = 40;

  if (couponCode === validCouponCode) {
    const totalPrice = parseFloat(totalPriceDisplay.innerText.replace("$", ""));
    const discountedPrice = totalPrice - discountAmount;

    totalPriceDisplay.textContent = "$" + " " + discountedPrice.toFixed(2);

    var myModal = new bootstrap.Modal(document.getElementById("myModal3"));
    myModal.show();
    coupon.innerHTML = "Coupon Applied";
    disamount.innerHTML = "$" + discountAmount;
  } else {
    var myModal = new bootstrap.Modal(document.getElementById("myModal4"));
    myModal.show();
  }

  couponCodeInput.value = "";
}

//remove
// let btnRemove = document.querySelectorAll(".cart-remove-item");
// btnRemove.forEach((del) => {
//   del.addEventListener("click", function () {
//     // removeItem(del);
//   });
// });
document.querySelector(".cart-items").addEventListener("click", function(event) {
  if (event.target.classList.contains("cart-remove-item")) {
    removeItem(event.target);
  }
});


function removeItem(button) {
  if (confirm("Are you sure you want to delete this item?")) {
    let parentElement = button.closest(".cart-item");
    if (parentElement) {
      let title = parentElement.querySelector(".cart-title").innerHTML;
      parentElement.remove();
      productArray = productArray.filter((el) => el.title != title);
      var myModal = new bootstrap.Modal(document.getElementById("myModal5"));
      myModal.show();
      updateTotal();
    }
  }
}
