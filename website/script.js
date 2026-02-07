document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       CATEGORÍAS (MENÚ LATERAL)
    ========================== */
    const categoriaBtns = document.querySelectorAll('#menu-lateral button');
    const categorias = document.querySelectorAll('.categoria');

    categoriaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const categoria = btn.dataset.categoria;

            categorias.forEach(cat => {
                cat.style.display =
                    cat.dataset.categoria === categoria ? 'block' : 'none';
            });
        });
    });

    // Mostrar primera categoría por defecto
    if (categorias.length > 0) {
        categorias.forEach((cat, i) => {
            cat.style.display = i === 0 ? 'block' : 'none';
        });
    }

    /* =========================
       SUBCATEGORÍAS (TABS)
    ========================== */
    const subcatBtns = document.querySelectorAll('.subcat-btn');

    subcatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const catDiv = btn.closest('.categoria');
            const subcat = btn.dataset.subcat;

            // Activar botón
            btn.parentElement
                .querySelectorAll('.subcat-btn')
                .forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Mostrar productos
            catDiv.querySelectorAll('.producto').forEach(prod => {
                prod.style.display =
                    prod.dataset.subcat === subcat ? 'block' : 'none';
            });
        });
    });

    /* =========================
       BUSCADOR
    ========================== */
    const searchInput = document.getElementById('search');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const texto = searchInput.value.toLowerCase();

            document.querySelectorAll('.producto').forEach(prod => {
                const nombre = prod.querySelector('h3')?.textContent.toLowerCase() || '';
                prod.style.display = nombre.includes(texto) ? 'block' : 'none';
            });
        });
    }

    /* =========================
       MODAL DE PRODUCTOS (GENERAL)
    ========================== */
    const modal = document.getElementById('modal-producto');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalSpecs = document.getElementById('modal-especificaciones');
    const closeBtn = document.querySelector('.close');

    document.querySelectorAll('.producto').forEach(producto => {
        producto.addEventListener('click', () => {

            // ⛔ Si no tiene especificaciones, no abrir modal
            if (!producto.dataset.especificaciones) return;

            let specs;
            try {
                const raw = producto.dataset.especificaciones;
                const limpio = raw.replaceAll('&quot;', '"');
                specs = JSON.parse(limpio);
            } catch (error) {
                console.error('Error en data-especificaciones:', error);
                return;
            }

            const nombre = producto.dataset.nombre || 'Producto';

            modalTitulo.textContent = nombre;
            modalSpecs.innerHTML = '';

            // Crear contenido dinámico
            for (const nivel1 in specs) {
                const bloque = document.createElement('div');
                bloque.classList.add('grado');

                const titulo = document.createElement('h4');
                titulo.textContent = nivel1;
                bloque.appendChild(titulo);

                const contenedor = document.createElement('div');
                contenedor.classList.add('medidas');

                const contenido = specs[nivel1];

                // 👉 SI ES ARRAY
                if (Array.isArray(contenido)) {
                    contenido.forEach(item => {
                        const btn = document.createElement('button');
                        btn.classList.add('medida-btn');
                        btn.textContent = item;
                        contenedor.appendChild(btn);
                    });
                }

                // 👉 SI ES OBJETO
                else {
                    for (const nivel2 in contenido) {
                        const subtitulo = document.createElement('h5');
                        subtitulo.textContent = nivel2;
                        contenedor.appendChild(subtitulo);

                        const valores = contenido[nivel2];

                        // array final
                        if (Array.isArray(valores)) {
                            valores.forEach(v => {
                                const btn = document.createElement('button');
                                btn.classList.add('medida-btn');
                                btn.textContent = v;
                                contenedor.appendChild(btn);
                            });
                        }

                        // objeto dentro de objeto (Marca)
                        else {
                            for (const nivel3 in valores) {
                                const sub3 = document.createElement('h6');
                                sub3.textContent = nivel3;
                                contenedor.appendChild(sub3);

                                const finales = valores[nivel3];

                                if (Array.isArray(finales)) {
                                    finales.forEach(v => {
                                        const btn = document.createElement('button');
                                        btn.classList.add('medida-btn');
                                        btn.textContent = v;
                                        contenedor.appendChild(btn);
                                    });
                                }
                            }
                        }
                    }
                }

                bloque.appendChild(contenedor);
                modalSpecs.appendChild(bloque);
            }

            modal.style.display = 'flex';
        });
    });

    /* =========================
       CERRAR MODAL
    ========================== */
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', e => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

});
