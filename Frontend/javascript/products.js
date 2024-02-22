const ngrokLink = "https://57b8-2804-d45-8c0c-d200-d97a-6b1c-2efd-188d.ngrok-free.app";

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
                            <th scope="row">${product.code}</th>
                            <td>${product.productName}</td>
                            <td>${product.department}</td>
                            <td>
                                <a class="btn btn-secondary" id="edit-btn code-${product.code}" href="./edit.html?code=${product.code}">Edit</a>
                            </td>
                            <td>
                                <a class="btn btn-danger" id="delete-btn" onClick="openModal('${product.productName}', ${product.code})">Delete</a>
                            </td>
                        </tr>
                    `
            })
        })
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