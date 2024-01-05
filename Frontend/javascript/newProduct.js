
let params = new URLSearchParams(window.location.search);
let code = params.get('code');
let form = document.querySelector("#new-form");

let codeIpt = document.querySelector("div#code-div").querySelector("input");
let productIpt = document.querySelector("div#product-div").querySelector("input");
let departmentIpt = document.querySelector("div#department-div").querySelector("input");

let selectProduct = document.querySelector("select#select-products");

newCode();

async function newCode() {
    await fetch("http://localhost:5096/products")
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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    await fetch("http://localhost:5096/products", opt)

    window.location.href = "http://localhost:5500/Frontend/pages/products.html";
});