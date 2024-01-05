
let table = document.querySelector("tbody#table-body");
getProducts();

let editBtns = document.querySelectorAll("a#edit-btn");
let editModal = document.querySelector("#edit-modal");
editBtns.forEach (btn => {
    btn.addEventListener('shown.bs.modal', () => {
        modal.focus();
    });
})

async function getProducts() {

    await fetch("http://localhost:5096/products")
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
                            <a class="btn btn-danger" id="edit-btn code-${product.Code}">Delete</a>
                        </td>
                    </tr>
                `
            });
        });
}