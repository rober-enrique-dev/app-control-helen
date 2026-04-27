document.addEventListener('DOMContentLoaded', () => {
    let currentTab = 'yanbal';
    let db = JSON.parse(localStorage.getItem('helen_v3_db')) || [];

    const list = document.getElementById('list-container');
    const totalVal = document.getElementById('total-val');
    const labelTotal = document.getElementById('label-total');
    const modal = document.getElementById('modal-form');

    const format = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

    // Formateo de dinero
    document.getElementById('input-visible').addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, "");
        document.getElementById('input-real').value = v;
        e.target.value = v ? new Intl.NumberFormat('es-CO').format(v) : "";
    });

    window.switchTab = (tab) => {
        currentTab = tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        labelTotal.innerText = tab === 'yanbal' ? 'Total Revista' : 'Total Gastos Personales';
        render();
    };

    const render = () => {
        list.innerHTML = "";
        let suma = 0;
        
        // Filtramos solo lo que pertenece a la pestaña actual
        const filtered = db.filter(item => item.tipo === currentTab);
        
        filtered.forEach((item, i) => {
            suma += parseInt(item.monto);
            const card = document.createElement('div');
            card.className = "item-card";
            card.onclick = () => { if(confirm("¿Eliminar?")) { 
                db = db.filter(d => d.id !== item.id); 
                render(); 
            }};
            card.innerHTML = `
                <div class="item-info">
                    <h3>${item.nombre}</h3>
                    <span>${item.detalle}</span>
                </div>
                <div class="item-price" style="color: ${item.tipo === 'yanbal' ? '#00B894' : '#FF3860'}">
                    ${format(item.monto)}
                </div>
            `;
            list.appendChild(card);
        });
        
        totalVal.innerText = format(suma);
        totalVal.style.color = currentTab === 'yanbal' ? 'var(--verde)' : 'var(--rojo)';
        localStorage.setItem('helen_v3_db', JSON.stringify(db));
    };

    document.getElementById('btn-open').onclick = () => modal.classList.add('active');
    
    document.getElementById('btn-save').onclick = () => {
        const m = document.getElementById('input-real').value;
        const n = document.getElementById('input-nombre').value;
        if(!m || !n) return;
        
        db.push({
            id: Date.now(),
            tipo: document.getElementById('input-tipo').value,
            nombre: n,
            detalle: document.getElementById('input-detalle').value || "Varios",
            monto: m
        });
        
        render();
        modal.classList.remove('active');
        document.getElementById('input-nombre').value = "";
        document.getElementById('input-detalle').value = "";
        document.getElementById('input-visible').value = "";
    };

    render();
});