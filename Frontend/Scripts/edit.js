
let params =  new URLSearchParams(window.location.search);
let code = params.get('code');

async function getProduct() {

    let codeIpt = document.querySelector("#codeInput");
    let productIpt = document.querySelector("#productInput");
    let departmentIpt = document.querySelector("#dapartmentInput");

    await fetch(`http://localhost:5096/products/${code}`)
        .then(response => { return response.json() })
        .then(data => {
            codeIpt.value = data.code;
            productIpt.value = data.productName;
            departmentIpt.value = data.department;
        });
}