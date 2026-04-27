document.addEventListener('DOMContentLoaded', () => {
    // 1. CONEXIÓN CON EL HTML (IDs actualizados)
    const btnOpen = document.getElementById('btn-open');
    const modalForm = document.getElementById('modal-form');
    const btnSave = document.getElementById('btn-save');
    const btnToggleList = document.getElementById('btn-toggle-list');
    const listSection = document.getElementById('list-section');
    const gridContainer = document.getElementById('grid-container');
    
    const inputDisplay = document.getElementById('monto-visible');
    const inputHidden = document.getElementById('monto-id');
    const inputProducto = document.getElementById('producto');
    const inputCliente = document.getElementById('cliente');
    const tipoSelect = document.getElementById('tipo');
    const boxCliente = document.getElementById('box-cliente');

    const labelRevista = document.getElementById('total-revista');
    const labelGastos = document.getElementById('total-gastos');

    // 2. FORMATEO DE PUNTOS EN TIEMPO REAL
    inputDisplay.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, "");
        if (v === "") { inputDisplay.value = ""; inputHidden.value = ""; return; }
        inputHidden.value = v;
        inputDisplay.value = new Intl.NumberFormat('es-CO').format(v);
    });

    const format = (n) => new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        minimumFractionDigits: 0 
    }).format(n);

    // 3. LÓGICA DE BOTONES (Abrir/Cerrar)
    btnOpen.addEventListener('click', () => {
        const isHidden = modalForm.style.display === 'none' || modalForm.style.display === '';
        modalForm.style.display = isHidden ? 'block' : 'none';
        if(isHidden) listSection.style.display = 'none'; // Cierra historial si abre registro
        btnOpen.innerText = isHidden ? '❌ CERRAR' : '+ REGISTRAR';
        btnToggleList.innerText = 'HISTORIAL'; // Resetea el otro botón
    });

    btnToggleList.addEventListener('click', () => {
        const isHidden = listSection.style.display === 'none';
        listSection.style.display = isHidden ? 'block' : 'none';
        if(isHidden) {
            modalForm.style.display = 'none'; // Cierra registro si abre historial
            render(); // Dibuja la lista
        }
        btnToggleList.innerText = isHidden ? '🙈 OCULTAR' : 'HISTORIAL';
        btnOpen.innerText = '+ REGISTRAR'; // Resetea el otro botón
    });

    tipoSelect.addEventListener('change', () => {
        boxCliente.style.display = tipoSelect.value === 'Gasto' ? 'none' : 'block';
    });

    // 4. GUARDAR DATOS
    btnSave.addEventListener('click', () => {
        const monto = inputHidden.value;
        const producto = inputProducto.value || 'Sin producto';

        if(!monto) {
            alert("Por favor, ingresa el valor de la operación");
            return;
        }

        const registro = {
            id: Date.now(),
            tipo: tipoSelect.value,
            cliente: tipoSelect.value === 'Revista' ? (inputCliente.value || 'Cliente Anónimo') : 'Gasto Personal',
            producto: producto,
            monto: parseFloat(monto)
        };

        let db = JSON.parse(localStorage.getItem('helen_v_pro')) || [];
        db.push(registro);
        localStorage.setItem('helen_v_pro', JSON.stringify(db));

        // Limpiar y cerrar
        inputDisplay.value = '';
        inputHidden.value = '';
        inputProducto.value = '';
        inputCliente.value = '';
        modalForm.style.display = 'none';
        btnOpen.innerText = '+ REGISTRAR';
        
        render(); // Actualiza totales y lista
        alert("¡Registro guardado con éxito! ✨");
    });

    // 5. MOSTRAR LOS DATOS (GRILLA ORGANIZADA)
    function render() {
        gridContainer.innerHTML = '';
        const db = JSON.parse(localStorage.getItem('helen_v_pro')) || [];
        let totalR = 0; 
        let totalG = 0;

        // Invertimos para que lo más nuevo salga de primero
        [...db].reverse().forEach(item => {
            if(item.tipo === 'Revista') totalR += item.monto;
            else totalG += item.monto;

            const tile = document.createElement('div');
            tile.className = 'record-tile';
            tile.innerHTML = `
                <button class="tile-del" onclick="deleteEntry(${item.id})">✕</button>
                <div style="font-size:1.2rem; margin-bottom:5px;">${item.tipo === 'Revista' ? '💄' : '💸'}</div>
                <strong class="tile-name">${item.cliente}</strong>
                <span class="tile-product">${item.producto}</span>
                <div class="tile-price" style="color: ${item.tipo === 'Revista' ? 'var(--verde)' : 'var(--rojo)'}">
                    ${format(item.monto)}
                </div>
            `;
            gridContainer.appendChild(tile);
        });

        // Actualizar el Dashboard de arriba
        labelRevista.innerText = format(totalR);
        labelGastos.innerText = format(totalG);
    }

    // 6. BORRAR REGISTROS
    window.deleteEntry = (id) => {
        if(confirm("¿Segura que quieres borrar este registro?")) {
            let db = JSON.parse(localStorage.getItem('helen_v_pro')) || [];
            db = db.filter(x => x.id !== id);
            localStorage.setItem('helen_v_pro', JSON.stringify(db));
            render();
        }
    };

    // Cargar totales al abrir la app
    render();
});