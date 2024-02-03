const ngrokLink = "https://a72c-2804-d45-8c0c-d200-a13d-63b0-2139-2fd6.ngrok-free.app";

let table = document.querySelector("tbody#table-body");
getProducts();

let editBtns = document.querySelectorAll("a#edit-btn");
let editModal = document.querySelector("#edit-modal");
editBtns.forEach(btn => {
    btn.addEventListener('shown.bs.modal', () => {
        modal.focus();
    });
})

async function getProducts() {
    const opt = {
        method: "GET", 
        cors: "no-cors",
        headers: new Headers({
            "ngrok-skip-browser-warning": "5000"
        })
    }
    await fetch(ngrokLink + "/products", opt)
        .then(response => { return response.json() })
        .then(data => {
            data.forEach(product => {
                table.innerHTML += `
                    <tr>
                        <th scope="row">${product.Code}</th>
                        <td>${product.ProductName}</td>
                        <td>${product.Department}</td>
                        <td>
                            <a class="btn btn-secondary" id="edit-btn code-${product.Code}" href="./edit.html?code=${product.Code}">Edit</a>
                        </td>
                        <td>
                            <a class="btn btn-danger" id="delete-btn" onClick="openModal('${product.ProductName}', ${product.Code})">Delete</a>
                        </td>
                    </tr>
                `
            });
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
            cors: "no-cors",
            headers: new Headers({
                "ngrok-skip-browser-warning": "5000"
            })
        }
        await fetch(ngrokLink + `/products/${code}/remove`, opt)
            .catch(err => {
                console.error(err);
            });
        deleteModal.style.display = "none";
    });

    cancelBtn.addEventListener("click", () => {
        deleteModal.style.display = "none";
    });
}