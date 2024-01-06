const params = new URLSearchParams(window.location.search);
const productionCard = document.querySelector("#production-cards");
if (productionCard != null) { getProductions(); }

const productSelect = document.querySelector("#product-select");
if (productSelect != null) {
    findProducts();
}

const productionForm = document.querySelector("#production-form");
if (productionForm != null) {
    productionForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!params.has("code")) {
            await addProduction();
        }

        await editProduction();
    });
}

async function getProductions() {
    await fetch("https://c542-2804-d45-8c0c-d200-14f7-8bbc-f91e-4e49.ngrok-free.app/productions")
        .then(response => {
            if (!response.ok) throw new Error("Failed to get productions");

            return response.json();
        })
        .then(data => {
            data.forEach(production => {

                fetch(`https://c542-2804-d45-8c0c-d200-14f7-8bbc-f91e-4e49.ngrok-free.app/products/${production.productCode}`)
                    .then(response => { return response.json() })
                    .then(data => {
                        productionCard.innerHTML += `
                            <div class="card" style="width: 90%;">
                                <div class="card-body">
                                    <h5 class="card-title">${data.productName}</h5>
                                    <h6 class="card-subtitle mb-2 text-body-secondary">Quantidade: ${production.amount}</h6>
                                    <div class="production-btns">
                                        <h7 class="card-subtitle mb-3 text-body-secondary">Dia Produzido: ${production.fabricationDate.split("T")[0]}</h7>
                                        <div>
                                        <a class="btn btn-secondary" href="http://127.0.0.1:5500/Frontend/pages/newProduction.html?code=${production.code}">Edit</a>
                                        <a class="btn btn-danger" id="delete-btn" onClick="openModal('${data.productName}', ${production.code})">Delete</a>
                                        </div>
                                    </div>
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
    const recipesIpt = document.querySelector("div#recipes-div").querySelector("input");

    const data = {
        "Code": await newCode(),
        "ProductCode": productSelect.value,
        "amount": amountIpt.value,
        "validity": validityIpt.value,
        "recipesQuantity": recipesIpt.value
    }

    const opt = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    await fetch("https://c542-2804-d45-8c0c-d200-14f7-8bbc-f91e-4e49.ngrok-free.app/productions", opt)
        .finally(() => {
            window.location.href = "http://localhost:5500/Frontend/pages/productions.html"
        })
        .catch(err => {
            console.error(err);
        });
}

async function findProducts() {
    await fetch("https://c542-2804-d45-8c0c-d200-14f7-8bbc-f91e-4e49.ngrok-free.app/products")
        .then(response => {
            return response.json();
        })
        .then(data => {
            data.forEach(product => {
                productSelect.innerHTML += `
                    <option value=${product.Code}>${product.ProductName}</option>
                `;
            });

            let code = "";
            if (params.has("code")) {
                code = params.get("code");
                const amountIpt = document.querySelector("div#amount-div").querySelector("input");
                const validityIpt = document.querySelector("div#validity-div").querySelector("input");
                const recipesIpt = document.querySelector("div#recipes-div").querySelector("input");

                fetch(`https://c542-2804-d45-8c0c-d200-14f7-8bbc-f91e-4e49.ngrok-free.app/productions/${code}`)
                    .then(response => { return response.json() })
                    .then(data => {
                        productSelect.value = data.productCode;
                        amountIpt.value = data.amount;
                        validityIpt.value = data.validity;
                        recipesIpt.value = data.recipesQuantity;
                    });
            }
        });
}

async function newCode() {
    let code = 0;

    await fetch("https://c542-2804-d45-8c0c-d200-14f7-8bbc-f91e-4e49.ngrok-free.app/productions")
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

async function editProduction() {
    const amountIpt = document.querySelector("div#amount-div").querySelector("input");
    const validityIpt = document.querySelector("div#validity-div").querySelector("input");
    const recipesIpt = document.querySelector("div#recipes-div").querySelector("input");

    const code = params.get("code");
    const data = {
        "ProductCode": productSelect.value,
        "amount": amountIpt.value,
        "validity": validityIpt.value,
        "recipesQuantity": recipesIpt.value
    }

    const opt = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    await fetch(`https://c542-2804-d45-8c0c-d200-14f7-8bbc-f91e-4e49.ngrok-free.app/productions/${code}/edit`, opt)
        .finally(() => {
            window.location.href = "http://localhost:5500/Frontend/pages/productions.html";
        })
        .catch(err => {
            console.error(err);
        });
}

function openModal(name, prodCode) {
    const deleteModal = document.querySelector("#delete-modal");
    const productName = deleteModal.querySelector("#product-name");
    const confirmBtn = deleteModal.querySelector("#confirm-btn");
    const cancelBtn = deleteModal.querySelector("#cancel-btn");

    let code = prodCode;
    productName.textContent = name;
    deleteModal.style.display = "flex";

    
    confirmBtn.addEventListener("click", async () => {
        const opt = { 
            method: "POST"
        }
        await fetch(`https://c542-2804-d45-8c0c-d200-14f7-8bbc-f91e-4e49.ngrok-free.app/productions/${code}/remove`, opt)
            .catch(err => {
                console.error(err);
            });
    });

    cancelBtn.addEventListener("click", () => {
        deleteModal.style.display = "none";
    });
}

