const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productContainer = document.querySelector('.productCardRealTime-container');

    productForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const code = document.getElementById('code').value;
        const price = parseFloat(document.getElementById('price').value);
        const stock = parseInt(document.getElementById('stock').value);
        const category = document.getElementById('category').value;

        if (!title || !description || !code || !price || !stock || !category) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        const newProduct = {title, description, code, price, stock, category };

        // Emitir el nuevo producto al servidor
        socket.emit('createProduct', newProduct);

        productForm.reset();
    });

    // Escuchar actualizaciones de productos
    socket.on('updateProducts', (products) => {
        productContainer.innerHTML = '';

        products.forEach((product) => {
            const productElement = document.createElement('div');
            productElement.classList.add('productCard');
            productElement.innerHTML = `
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>Code: ${product.code}</p>
                <p>Price: $${product.price}</p>
                <p>Stock: ${product.stock}</p>
                <p>Category: ${product.category}</p>
            `;
            productContainer.appendChild(productElement);
        });
    });
});
