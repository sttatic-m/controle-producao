const params = new URLSearchParams(window.location.search);
const ngrokLink = "https://849b-2804-d45-8c0c-d200-8cca-c017-96ed-2372.ngrok-free.app";

const productionCard = document.querySelector("#production-cards");

if (productionCard != null) { getProductions(); }

const productSelect = document.querySelector("datalist#product-datalist");
const productDataName = document.querySelector("#data-product-name");
const productDataIpt = document.querySelector("#product-data-ipt");

if (productSelect != null && productDataName != null && productDataIpt != null) {
    findProducts();
    productDataIpt.addEventListener("change", () => { updateProducSearch() });
}

function updateProducSearch()
{
    let val = productDataIpt.value;
    let opts = productSelect.querySelectorAll("option");
    opts.forEach(opt => {
        if(val == opt.value)
        {
            productDataName.placeholder = opt.textContent;
        }
    });
}

const dateIpt = document.querySelector("input#date-ipt");
const dateBtn = document.querySelector("a#search-btn");

if (dateIpt != null) {
    dateIpt.addEventListener("input", () => {
        getProductionByDate(dateIpt.value);
    });
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
    const opt = {
        cors: "no-cors",
        headers: new Headers({
            "ngrok-skip-browser-warning": "5000"
        })
    }
    await fetch(ngrokLink + "/productions", opt)
        .then(response => {
            if (!response.ok) throw new Error("Failed to get productions");

            return response.json();
        })
        .then(data => {
            data.forEach(production => {

                fetch(ngrokLink + `/products/${production.productCode}`, opt)
                    .then(response => { return response.json() })
                    .then(data => {
                        productionCard.innerHTML += `
                            <div class="production">
                                <div class="card" style="width: 100%;">
                                    <div class="card-body">
                                        <h5 class="card-title">${data.productName}</h5>
                                        <h6 class="card-subtitle mb-2 text-body-secondary">Quantidade: ${production.amount}</h6>
                                        <div class="production-btns">
                                            <h7 class="card-subtitle mb-3 text-body-secondary">Dia Produzido: ${production.fabricationDate.split("T")[0]}</h7>
                                            <div>
                                            <a class="btn btn-secondary" href="./newProduction.html?code=${production.code}">Edit</a>
                                            <a class="btn btn-danger" id="delete-btn" onClick="openModal('${data.productName}', ${production.code})">Delete</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `
                    })

            });
        });
}

async function getProductionByDate(date) {
    const opt = {
        cors: "no-cors",
        headers: new Headers({
            "ngrok-skip-browser-warning": "5000"
        })
    }

    productionCard.innerHTML = "";
    await fetch(ngrokLink + `/productions/${date}/list`, opt)
        .then(response => {
            if (!response.ok) throw new Error("Failed to get productions");

            return response.json();
        })
        .then(data => {
            data.forEach(production => {

                fetch(ngrokLink + `/products/${production.productCode}`, opt)
                    .then(response => { return response.json() })
                    .then(data => {
                        productionCard.innerHTML += `
                            <div class="production">
                                <div class="card" style="width: 100%;">
                                    <div class="card-body">
                                        <h5 class="card-title">${data.productName}</h5>
                                        <h6 class="card-subtitle mb-2 text-body-secondary">Quantidade: ${production.amount}</h6>
                                        <div class="production-btns">
                                            <h7 class="card-subtitle mb-3 text-body-secondary">Dia Produzido: ${production.fabricationDate.split("T")[0]}</h7>
                                            <div>
                                            <a class="btn btn-secondary" href="./newProduction.html?code=${production.code}">Edit</a>
                                            <a class="btn btn-danger" id="delete-btn" onClick="openModal('${data.productName}', ${production.code})">Delete</a>
                                            </div>
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
        "ProductCode": productDataIpt.value,
        "amount": amountIpt.value,
        "validity": validityIpt.value,
        "recipesQuantity": recipesIpt.value
    }

    const opt = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "ngrok-skip-browser-warning": "5000"
        },
        body: JSON.stringify(data)
    }

    await fetch(ngrokLink + "/productions", opt)
        .finally(() => {
            window.location.href = "./productions.html"
        })
        .catch(err => {
            console.error(err);
        });
}

async function findProducts() {
    const opt = {
        headers: new Headers({
            "ngrok-skip-browser-warning": "5000"
        })
    }
    await fetch(ngrokLink + "/products", opt)
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

                fetch(ngrokLink + `/productions/${code}`, opt)
                    .then(response => { return response.json() })
                    .then(data => {
                        productDataIpt.value = data.productCode;
                        amountIpt.value = data.amount;
                        validityIpt.value = data.validity;
                        recipesIpt.value = data.recipesQuantity;

                        updateProducSearch();
                    });
            }
        });
}

async function newCode() {
    let code = 0;
    const opt = {
        headers: new Headers({
            "ngrok-skip-browser-warning": "5000"
        })
    }

    await fetch(ngrokLink + "/productions", opt)
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
        "ProductCode": productDataIpt.value,
        "amount": amountIpt.value,
        "validity": validityIpt.value,
        "recipesQuantity": recipesIpt.value
    }

    const opt = {
        method: "POST",
        headers: new Headers({
            'Content-Type': 'application/json',
            "ngrok-skip-browser-warning": "5000"
        }),
        body: JSON.stringify(data)
    }

    await fetch(ngrokLink + `/productions/${code}/edit`, opt)
        .finally(() => {
            window.location.href = "./productions.html";
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
            method: "POST",
            headers: new Headers({
                "ngrok-skip-browser-warning": "5000"
            })
        }
        await fetch(ngrokLink + `/productions/${code}/remove`, opt)
            .catch(err => {
                console.error(err);
            });

        deleteModal.style.display = "none";
        window.location.reload();
    });

    cancelBtn.addEventListener("click", () => {
        deleteModal.style.display = "none";
    });
}

