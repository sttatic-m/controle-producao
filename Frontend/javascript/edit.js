
const ngrokLink = "https://3a42-2804-d45-8c0c-d200-6d9c-a15a-874c-b446.ngrok-free.app";

let params =  new URLSearchParams(window.location.search);
let code = params.get('code');
let form = document.querySelector("#edit-form");

let codeIpt = document.querySelector("div#code-div").querySelector("input");
let productIpt = document.querySelector("div#product-div").querySelector("input");
let departmentIpt = document.querySelector("div#department-div").querySelector("input");

getProduct();

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        Code: codeIpt.value,
        ProductName: productIpt.value,
        Department: departmentIpt.value
    }

    const options = {
        method: "POST",
        headers: new Headers({
            'Content-Type': 'application/json',
            "ngrok-skip-browser-warning": "5000"
        }),
        body: JSON.stringify(data)
    }

    await fetch(ngrokLink + `/products/${code}/edit`, options)
    .then(response => {
        if(!response.ok) throw new Error("Request Failed - " + response.statusText);

        window.location.href = "./pages/products.html"
    })
    .catch(err => { window.alert(err)})
});

async function getProduct() {
    const options = {
        headers: new Headers({
            "ngrok-skip-browser-warning": "5000"
        }),
    }

    await fetch(ngrokLink + `/products/${code}`, options)
        .then(response => { return response.json() })
        .then(data => {
            codeIpt.value = data.code;
            productIpt.value = data.productName;
            departmentIpt.value = data.department;
        });
}