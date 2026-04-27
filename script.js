document.addEventListener('DOMContentLoaded', () => {
    // Base de datos limpia v2
    let db = JSON.parse(localStorage.getItem('helen_premium_v2')) || [];
    let currentTab = 'yanbal';

    const listContainer = document.getElementById('list-container');
    const totalLabel = document.getElementById('total-val');
    const textLabel = document.getElementById('label-total');
    const modal = document.getElementById('modal-form');

    const format = (n) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

    // Formateo de dinero (puntos automáticos)
    document.getElementById('input-visible').addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, "");
        document.getElementById('input-real').value = v;
        e.target.value = v ? new Intl.NumberFormat('es-CO').format(v) : "";
    });

    // Cambiar entre Yanbal y Personales
    window.switchTab = (tab) => {
        currentTab = tab;
        document.getElementById('tab-yanbal').classList.toggle('active', tab === 'yanbal');
        document.getElementById('tab-personales').classList.toggle('active', tab === 'personales');
        textLabel.innerText = tab === 'yanbal' ? 'Total Revista' : 'Total Gastos Personales';
        render();
    };

    const render = () => {
        listContainer.innerHTML = "";
        let sumaTotal = 0;
        
        // Filtramos por pestaña actual
        const filtrados = db.filter(item => item.tipo === currentTab);
        
        filtrados.forEach((item) => {
            sumaTotal += parseInt(item.monto);
            
            const card = document.createElement('div');
            card.className = "item-card";
            
            // Función de borrado con texto profesional
            card.onclick = () => {
                if(confirm("¿Desea confirmar el recaudo de este registro y archivarlo?")) {
                    db = db.filter(d => d.id !== item.id);
                    render();
                }
            };
            
            card.innerHTML = `
                <div class="item-info">
                    <h3>${item.nombre}</h3>
                    <span>${item.detalle}</span>
                </div>
                <div class="item-price" style="color: ${item.tipo === 'yanbal' ? 'var(--verde)' : 'var(--rojo)'}">
                    ${format(item.monto)}
                </div>
            `;
            listContainer.appendChild(card);
        });
        
        totalLabel.innerText = format(sumaTotal);
        totalLabel.style.color = currentTab === 'yanbal' ? 'var(--verde)' : 'var(--rojo)';
        localStorage.setItem('helen_premium_v2', JSON.stringify(db));
    };

    // Control del Modal
    document.getElementById('btn-open').onclick = () => modal.classList.add('active');
    
    document.getElementById('btn-save').onclick = () => {
        const m = document.getElementById('input-real').value;
        const n = document.getElementById('input-nombre').value;
        
        if(!m || !n) {
            alert("Por favor, ingrese el nombre y el monto.");
            return;
        }
        
        db.push({
            id: Date.now(),
            tipo: document.getElementById('input-tipo').value,
            nombre: n,
            detalle: document.getElementById('input-detalle').value || "Sin detalle",
            monto: m
        });
        
        render();
        modal.classList.remove('active');
        
        // Limpiar campos para la próxima entrada
        document.getElementById('input-nombre').value = "";
        document.getElementById('input-detalle').value = "";
        document.getElementById('input-visible').value = "";
        document.getElementById('input-real').value = "";
    };

    // Carga inicial
    render();
});