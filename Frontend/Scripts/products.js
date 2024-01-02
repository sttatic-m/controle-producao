
let table = document.querySelector("tbody#table-body");

async function getProducts() {
    console.log(
        await fetch("http://localhost:5096/products", {
            "mode": "no-cors",
        })
            .then(response => { 
                return response;
            }));
}