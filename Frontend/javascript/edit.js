
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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    await fetch(`https://c542-2804-d45-8c0c-d200-14f7-8bbc-f91e-4e49.ngrok-free.app/products/${code}/edit`, options)
    .then(response => {
        if(!response.ok) throw new Error("Request Failed - " + response.statusText);

        window.location.href = "http://localhost:5500/Frontend/pages/products.html"
    })
    .catch(err => { window.alert(err)})
});

async function getProduct() {

    await fetch(`https://c542-2804-d45-8c0c-d200-14f7-8bbc-f91e-4e49.ngrok-free.app/products/${code}`)
        .then(response => { return response.json() })
        .then(data => {
            codeIpt.value = data.code;
            productIpt.value = data.productName;
            departmentIpt.value = data.department;
        });
}