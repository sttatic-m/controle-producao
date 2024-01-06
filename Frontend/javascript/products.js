
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
    cors: "no-cors"
}
    await fetch("https://c542-2804-d45-8c0c-d200-14f7-8bbc-f91e-4e49.ngrok-free.app/products", opt)
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
            method: "POST"
        }
        await fetch(`https://c542-2804-d45-8c0c-d200-14f7-8bbc-f91e-4e49.ngrok-free.app/products/${code}/remove`, opt)
            .catch(err => {
                console.error(err);
            });
    });

    cancelBtn.addEventListener("click", () => {
        deleteModal.style.display = "none";
    });
}