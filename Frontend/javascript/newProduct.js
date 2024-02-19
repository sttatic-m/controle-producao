const ngrokLink = "https://57b8-2804-d45-8c0c-d200-d97a-6b1c-2efd-188d.ngrok-free.app";

let params = new URLSearchParams(window.location.search);
let code = params.get('code');
let form = document.querySelector("#new-form");

let codeIpt = document.querySelector("div#code-div").querySelector("input");
let productIpt = document.querySelector("div#product-div").querySelector("input");
let departmentIpt = document.querySelector("div#department-div").querySelector("input");

let selectProduct = document.querySelector("select#select-products");

newCode();

async function newCode() {
    const options = {
        headers: new Headers({
            "ngrok-skip-browser-warning": "5000"
        }),
    }
    await fetch(ngrokLink + "/products", options)
        .then(response => {
            if(!response.ok) throw new Error("Failed get products")
            return response.json();
        })
        .then(data => {
            let code = data[data.length - 1].Code;
            codeIpt.value = code + 1;
        })
        .catch( err => { console.log(err) });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        "Code": codeIpt.value,
        "ProductName": productIpt.value,
        "Department": departmentIpt.value
    }
    const opt = { 
        method: "POST",
        headers: new Headers({
            'Content-Type': 'application/json',
            "ngrok-skip-browser-warning": "5000"
        }),
        body: JSON.stringify(data)
    }

    await fetch(ngrokLink + "/products", opt)

    window.location.href = "./products.html";
});