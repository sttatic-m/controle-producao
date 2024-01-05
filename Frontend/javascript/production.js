const productionCard = document.querySelector("#production-cards");
if (productionCard != null) { getProductions(); }

const productSelect = document.querySelector("#product-select");
if (productSelect != null) findProducts();

const productionForm = document.querySelector("#production-form");
if(productionForm != null) {
    productionForm.addEventListener("submit", (e) => {
        e.preventDefault();

        addProduction();
    });
}
async function getProductions() {
    await fetch("http://localhost:5096/productions")
        .then(response => {
            if (!response.ok) throw new Error("Failed to get productions");

            return response.json();
        })
        .then(data => {
            data.forEach(production => {

                fetch(`http://localhost:5096/products/${production.productCode}`)
                    .then(response => { return response.json() })
                    .then(data => {
                        productionCard.innerHTML += `
                            <div class="card" style="width: 90%;">
                                <div class="card-body">
                                    <h5 class="card-title">${data.productName}</h5>
                                    <h6 class="card-subtitle mb-2 text-body-secondary">Quantidade: ${production.amount}</h6>
                                    <h7 class="card-subtitle mb-3 text-body-secondary">Dia Produzido: ${production.fabricationDate.split("T")[0]}</h7>
                                </div>
                            </div>
                        `
                    })

            });
        });
}

async function addProduction() {
    const amountIpt = document.querySelector("div#amount-div").querySelector("input");
    const validityIpt = document.querySelector("div#validity-div").querySelector("input");
    const dateIpt = document.querySelector("div#date-div").querySelector("input");

    const data = {
        "code": newCode(),
        "productCode": productSelect.value,
        "amount": amountIpt.value,
        "fabricationDate": dateIpt.value,
        "validity": validityIpt.value
    }

    const opt = { 
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    await fetch("http://localhost:5096/productions", opt)
    .finally( () => {
        //indow.location.href = "http://localhost:5500/Frontend/pages/productions.html";
    })    
    .catch(err => {
        console.error(err);
    });
}

async function findProducts() {
    await fetch("http://localhost:5096/products")
        .then(response => {
            return response.json();
        })
        .then(data => {
            data.forEach(product => {
                productSelect.innerHTML += `
                    <option value=${product.Code}>${product.ProductName}</option>
                `;
            });
        });
}

async function newCode() {
    let code = 0;

    await fetch("http://localhost:5096/productions")
        .then(response => {
            if (!response.ok) throw new Error("Failed get products")
            return response.json();
        })
        .then(data => {
            let currentCode = data[data.length - 1].code;
            code = currentCode + 1;
        })
        .catch(err => { console.log(err) });

    return code;
}