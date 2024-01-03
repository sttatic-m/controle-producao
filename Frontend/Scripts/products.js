
let table = document.querySelector("tbody#table-body");

async function getProducts() {
    
    await fetch("http://localhost:5096/products")
        .then(response => { response.json()})
        .then(data => {
            
        });
}