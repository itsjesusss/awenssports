// ==============================================
// SISTEMA SIMPLE DE MODALES SIN PROBLEMAS DE ARIA
// ==============================================

// Crear un modal simple que no use Bootstrap
function mostrarMensajeSimple(titulo, mensaje, tipo = 'info') {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
    `;
    
    // Determinar color según tipo
    let colorHeader = '#232f3e'; // color-secundario
    if (tipo === 'exito') colorHeader = '#28a745'; // color-exito
    else if (tipo === 'error') colorHeader = '#dc3545'; // color-peligro
    else if (tipo === 'advertencia') colorHeader = '#ffc107'; // color-advertencia
    
    // Crear modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 8px;
        width: 100%;
        max-width: 500px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        overflow: hidden;
    `;
    
    // Crear header
    const header = document.createElement('div');
    header.style.cssText = `
        background: ${colorHeader};
        color: ${tipo === 'advertencia' ? '#000' : 'white'};
        padding: 15px 20px;
        font-weight: bold;
        font-size: 1.1rem;
    `;
    header.textContent = titulo;
    
    // Crear body
    const body = document.createElement('div');
    body.style.cssText = `
        padding: 20px;
        max-height: 60vh;
        overflow-y: auto;
    `;
    body.innerHTML = mensaje;
    
    // Crear footer
    const footer = document.createElement('div');
    footer.style.cssText = `
        padding: 15px 20px;
        background: #f8f9fa;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    `;
    
    // Crear botón aceptar
    const btnAceptar = document.createElement('button');
    btnAceptar.textContent = 'Aceptar';
    btnAceptar.style.cssText = `
        background: #ff9900;
        color: white;
        border: none;
        padding: 8px 20px;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
    `;
    
    // Función para cerrar
    const cerrarModal = () => {
        overlay.remove();
        document.body.style.overflow = 'auto';
    };
    
    btnAceptar.onclick = cerrarModal;
    
    // Cerrar haciendo clic fuera
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            cerrarModal();
        }
    };
    
    // Cerrar con ESC
    const cerrarConESC = (e) => {
        if (e.key === 'Escape') {
            cerrarModal();
            document.removeEventListener('keydown', cerrarConESC);
        }
    };
    document.addEventListener('keydown', cerrarConESC);
    
    // Ensamblar modal
    footer.appendChild(btnAceptar);
    modal.appendChild(header);
    modal.appendChild(body);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    
    // Bloquear scroll del body
    document.body.style.overflow = 'hidden';
    
    // Agregar al DOM
    document.body.appendChild(overlay);
    
    // Enfocar el botón
    setTimeout(() => btnAceptar.focus(), 100);
    
    return {
        close: cerrarModal,
        element: overlay
    };
}

// ==============================================
// APLICACIÓN PARA EL CARRITO DE COMPRAS
// ==============================================
if (document.getElementById('app-carrito')) {
    const { createApp } = Vue;
    
    createApp({
        data() {
            return {
                pedido: {
                    gama: '',
                    tipo: '',
                    tallas: {},
                    datosCliente: {
                        nombre: '',
                        telefono: '',
                        email: '',
                        direccion: ''
                    },
                    datosEquipo: {
                        nombre: '',
                        categoria: '',
                        colores: ''
                    },
                    ideaUniforme: ''
                },
                gamas: [
                    { nombre: 'Básica', precio: 240.00 },
                    { nombre: 'Clásica', precio: 300.00 },
                    { nombre: 'FullPrint', precio: 450.00 }
                ],
                tallasAdulto: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                tallasInfantil: ['4-6 años', '7-9 años', '10-12 años', '13-15 años'],
                codigoSeguimientoGenerado: '',
                modoEdicion: false,
                pedidoEditando: null,
                modalActual: null
            }
        },
        computed: {
            tallasDisponibles() {
                return this.pedido.tipo === 'adulto' ? this.tallasAdulto : 
                       this.pedido.tipo === 'infantil' ? this.tallasInfantil : [];
            },
            precioGamaSeleccionada() {
                const gama = this.gamas.find(g => g.nombre === this.pedido.gama);
                return gama ? gama.precio : 0;
            },
            calcularTotalUniformes() {
                let total = 0;
                for (let talla in this.pedido.tallas) {
                    total += this.pedido.tallas[talla] || 0;
                }
                return total;
            },
            calcularSubtotal() {
                return this.precioGamaSeleccionada * this.calcularTotalUniformes;
            },
            calcularEnvio() {
                return this.calcularSubtotal > 100 ? 0 : 10;
            },
            calcularTotal() {
                return this.calcularSubtotal + this.calcularEnvio;
            },
            formularioValido() {
                return this.pedido.gama && 
                       this.pedido.tipo && 
                       this.calcularTotalUniformes > 0 &&
                       this.pedido.datosCliente.nombre &&
                       this.pedido.datosCliente.telefono &&
                       this.pedido.datosCliente.email &&
                       this.pedido.datosCliente.direccion &&
                       this.pedido.datosEquipo.nombre &&
                       this.pedido.datosEquipo.categoria &&
                       this.pedido.datosEquipo.colores &&
                       this.pedido.ideaUniforme;
            }
        },
        methods: {
            inicializarTallas() {
                this.pedido.tallas = {};
                this.tallasDisponibles.forEach(talla => {
                    this.pedido.tallas[talla] = 0;
                });
            },
            
            aumentarCantidad(talla) {
                if (!this.pedido.tallas[talla]) {
                    this.pedido.tallas[talla] = 0;
                }
                if (this.pedido.tallas[talla] < 50) {
                    this.pedido.tallas[talla]++;
                }
            },
            
            disminuirCantidad(talla) {
                if (this.pedido.tallas[talla] > 0) {
                    this.pedido.tallas[talla]--;
                }
            },
            
            generarCodigoSeguimiento() {
                const prefix = 'AWS';
                const randomNum = Math.floor(100000 + Math.random() * 900000);
                return `${prefix}-${randomNum}`;
            },
            
            mostrarMensaje(titulo, mensaje, tipo = 'info') {
                // Cerrar modal anterior si existe
                if (this.modalActual) {
                    this.modalActual.close();
                }
                
                this.modalActual = mostrarMensajeSimple(titulo, mensaje, tipo);
                
                // Limpiar referencia cuando se cierre
                const modalElement = this.modalActual.element;
                const originalClose = this.modalActual.close;
                this.modalActual.close = () => {
                    originalClose();
                    this.modalActual = null;
                };
                
                return this.modalActual;
            },
            
            mostrarMensajeConfirmacion(titulo, mensaje, textoAceptar = 'Aceptar', textoCancelar = 'Cancelar') {
                return new Promise((resolve) => {
                    const overlay = document.createElement('div');
                    overlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.5);
                        z-index: 9999;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 20px;
                    `;
                    
                    const modal = document.createElement('div');
                    modal.style.cssText = `
                        background: white;
                        border-radius: 8px;
                        width: 100%;
                        max-width: 500px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                        overflow: hidden;
                    `;
                    
                    const header = document.createElement('div');
                    header.style.cssText = `
                        background: #232f3e;
                        color: white;
                        padding: 15px 20px;
                        font-weight: bold;
                        font-size: 1.1rem;
                    `;
                    header.textContent = titulo;
                    
                    const body = document.createElement('div');
                    body.style.cssText = `
                        padding: 20px;
                        max-height: 60vh;
                        overflow-y: auto;
                    `;
                    body.innerHTML = mensaje;
                    
                    const footer = document.createElement('div');
                    footer.style.cssText = `
                        padding: 15px 20px;
                        background: #f8f9fa;
                        display: flex;
                        justify-content: flex-end;
                        gap: 10px;
                    `;
                    
                    const btnCancelar = document.createElement('button');
                    btnCancelar.textContent = textoCancelar;
                    btnCancelar.style.cssText = `
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 8px 20px;
                        border-radius: 4px;
                        font-weight: bold;
                        cursor: pointer;
                    `;
                    
                    const btnAceptar = document.createElement('button');
                    btnAceptar.textContent = textoAceptar;
                    btnAceptar.style.cssText = `
                        background: #ff9900;
                        color: white;
                        border: none;
                        padding: 8px 20px;
                        border-radius: 4px;
                        font-weight: bold;
                        cursor: pointer;
                    `;
                    
                    const cerrarModal = (resultado) => {
                        overlay.remove();
                        document.body.style.overflow = 'auto';
                        document.removeEventListener('keydown', manejarESC);
                        resolve(resultado);
                    };
                    
                    btnCancelar.onclick = () => cerrarModal(false);
                    btnAceptar.onclick = () => cerrarModal(true);
                    
                    const manejarESC = (e) => {
                        if (e.key === 'Escape') {
                            cerrarModal(false);
                        }
                    };
                    
                    overlay.onclick = (e) => {
                        if (e.target === overlay) {
                            cerrarModal(false);
                        }
                    };
                    
                    document.addEventListener('keydown', manejarESC);
                    document.body.style.overflow = 'hidden';
                    
                    footer.appendChild(btnCancelar);
                    footer.appendChild(btnAceptar);
                    modal.appendChild(header);
                    modal.appendChild(body);
                    modal.appendChild(footer);
                    overlay.appendChild(modal);
                    document.body.appendChild(overlay);
                    
                    setTimeout(() => btnAceptar.focus(), 100);
                });
            },
            
            async realizarPedido() {
                if (!this.formularioValido) {
                    this.mostrarMensaje('Error', 
                        'Por favor completa todos los campos obligatorios y selecciona al menos un uniforme.', 
                        'error');
                    return;
                }
                
                const codigo = this.modoEdicion ? this.pedidoEditando.codigoSeguimiento : this.generarCodigoSeguimiento();
                
                const pedidoCompleto = {
                    gama: this.pedido.gama,
                    tipo: this.pedido.tipo,
                    tallas: this.pedido.tallas,
                    cantidad: this.calcularTotalUniformes,
                    datosCliente: this.pedido.datosCliente,
                    datosEquipo: this.pedido.datosEquipo,
                    ideaUniforme: this.pedido.ideaUniforme,
                    codigoSeguimiento: codigo,
                    total: this.calcularTotal,
                    estado: 'revision'
                };
                
                const url = this.modoEdicion ? 'actualizar_pedido.php' : 'procesar_pedido.php';
                
                console.log('Enviando datos a:', url, pedidoCompleto);
                
                const modalCargando = this.mostrarMensaje('Procesando', 
                    this.modoEdicion ? 'Actualizando tu pedido...' : 'Procesando tu pedido...');
                
                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(pedidoCompleto)
                    });

                    const responseText = await response.text();
                    let data;
                    
                    try {
                        data = JSON.parse(responseText);
                    } catch (e) {
                        console.error('Respuesta no es JSON:', responseText);
                        throw new Error('Error en la respuesta del servidor');
                    }

                    console.log('Respuesta del servidor:', data);
                    
                    // Cerrar modal de carga
                    modalCargando.close();
                    
                    setTimeout(() => {
                        if (data.success) {
                            if (this.modoEdicion) {
                                this.mostrarMensaje(
                                    '¡Pedido Actualizado!', 
                                    `Tu pedido se actualizó correctamente!<br><br>
                                    <strong>Código de seguimiento:</strong> ${codigo}<br><br>
                                    Recuerda que puedes consultar el estado de tu pedido en cualquier momento.`,
                                    'exito'
                                );
                                this.modoEdicion = false;
                                this.pedidoEditando = null;
                            } else {
                                this.codigoSeguimientoGenerado = codigo;
                                this.mostrarMensaje(
                                    '¡Pedido Realizado!', 
                                    `Tu pedido ha sido realizado con éxito.<br><br>
                                    <strong>Código de seguimiento:</strong> ${codigo}<br><br>
                                    Guarda este código para realizar el seguimiento de tu pedido.`,
                                    'exito'
                                );
                            }
                            this.resetearFormulario();
                        } else {
                            this.mostrarMensaje('Error', 
                                'Error al procesar el pedido: ' + (data.message || 'Error desconocido'), 
                                'error');
                        }
                    }, 300);
                    
                } catch (error) {
                    console.error('Error:', error);
                    modalCargando.close();
                    setTimeout(() => {
                        this.mostrarMensaje('Error de Conexión', 
                            'No se pudo conectar con el servidor: ' + error.message, 
                            'error');
                    }, 300);
                }
            },
            
            resetearFormulario() {
                this.pedido = {
                    gama: '',
                    tipo: '',
                    tallas: {},
                    datosCliente: {
                        nombre: '',
                        telefono: '',
                        email: '',
                        direccion: ''
                    },
                    datosEquipo: {
                        nombre: '',
                        categoria: '',
                        colores: ''
                    },
                    ideaUniforme: ''
                };
            },
            
            cargarDatosEdicion(pedidoData) {
                console.log('Cargando datos para edición:', pedidoData);
                
                this.pedido.gama = pedidoData.gama;
                this.pedido.tipo = pedidoData.tipo;
                this.pedido.datosCliente = pedidoData.datosCliente;
                this.pedido.datosEquipo = pedidoData.datosEquipo;
                this.pedido.ideaUniforme = pedidoData.ideaUniforme;
                
                this.inicializarTallas();
                
                if (pedidoData.tallas && typeof pedidoData.tallas === 'object') {
                    this.pedido.tallas = { ...pedidoData.tallas };
                } else {
                    this.pedido.tallas = {};
                }
                
                this.modoEdicion = true;
                this.pedidoEditando = pedidoData;
            }
        },
        mounted() {
            const urlParams = new URLSearchParams(window.location.search);
            const codigoEdicion = urlParams.get('editar');
            
            if (codigoEdicion) {
                console.log('Buscando pedido con código:', codigoEdicion);
                
                fetch(`consultar_pedido.php?codigo=${codigoEdicion}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Datos recibidos:', data);
                    if (data.success) {
                        this.cargarDatosEdicion(data.pedido);
                    } else {
                        this.mostrarMensaje('Error', 
                            'No se pudo cargar el pedido para editar: ' + data.message, 
                            'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.mostrarMensaje('Error', 
                        'Error al cargar el pedido para editar: ' + error.message, 
                        'error');
                });
            }
        }
    }).mount('#app-carrito');
}

// ==============================================
// APLICACIÓN PARA EL SEGUIMIENTO DE PEDIDOS
// ==============================================
if (document.getElementById('app-seguimiento')) {
    const { createApp } = Vue;
    
    createApp({
        data() {
            return {
                codigoConsulta: '',
                pedidoConsultado: null,
                mostrarErrorConsulta: false,
                modalActual: null
            }
        },
        methods: {
            mostrarMensaje(titulo, mensaje, tipo = 'info') {
                // Usar la función global
                this.modalActual = mostrarMensajeSimple(titulo, mensaje, tipo);
                
                const originalClose = this.modalActual.close;
                const modalElement = this.modalActual.element;
                
                this.modalActual.close = () => {
                    originalClose();
                    this.modalActual = null;
                };
                
                return this.modalActual;
            },
            
            async mostrarConfirmacion(titulo, mensaje, textoAceptar = 'Sí', textoCancelar = 'No') {
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 9999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                `;
                
                const modal = document.createElement('div');
                modal.style.cssText = `
                    background: white;
                    border-radius: 8px;
                    width: 100%;
                    max-width: 500px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    overflow: hidden;
                `;
                
                const header = document.createElement('div');
                header.style.cssText = `
                    background: #ffc107;
                    color: #000;
                    padding: 15px 20px;
                    font-weight: bold;
                    font-size: 1.1rem;
                `;
                header.textContent = titulo;
                
                const body = document.createElement('div');
                body.style.cssText = `
                    padding: 20px;
                    max-height: 60vh;
                    overflow-y: auto;
                `;
                body.innerHTML = mensaje;
                
                const footer = document.createElement('div');
                footer.style.cssText = `
                    padding: 15px 20px;
                    background: #f8f9fa;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                `;
                
                return new Promise((resolve) => {
                    const btnCancelar = document.createElement('button');
                    btnCancelar.textContent = textoCancelar;
                    btnCancelar.style.cssText = `
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 8px 20px;
                        border-radius: 4px;
                        font-weight: bold;
                        cursor: pointer;
                    `;
                    
                    const btnAceptar = document.createElement('button');
                    btnAceptar.textContent = textoAceptar;
                    btnAceptar.style.cssText = `
                        background: ${textoAceptar.includes('Cancelar') ? '#dc3545' : '#ff9900'};
                        color: white;
                        border: none;
                        padding: 8px 20px;
                        border-radius: 4px;
                        font-weight: bold;
                        cursor: pointer;
                    `;
                    
                    const cerrarModal = (resultado) => {
                        overlay.remove();
                        document.body.style.overflow = 'auto';
                        document.removeEventListener('keydown', manejarESC);
                        resolve(resultado);
                    };
                    
                    btnCancelar.onclick = () => cerrarModal(false);
                    btnAceptar.onclick = () => cerrarModal(true);
                    
                    const manejarESC = (e) => {
                        if (e.key === 'Escape') {
                            cerrarModal(false);
                        }
                    };
                    
                    overlay.onclick = (e) => {
                        if (e.target === overlay) {
                            cerrarModal(false);
                        }
                    };
                    
                    document.addEventListener('keydown', manejarESC);
                    document.body.style.overflow = 'hidden';
                    
                    footer.appendChild(btnCancelar);
                    footer.appendChild(btnAceptar);
                    modal.appendChild(header);
                    modal.appendChild(body);
                    modal.appendChild(footer);
                    overlay.appendChild(modal);
                    document.body.appendChild(overlay);
                    
                    setTimeout(() => btnAceptar.focus(), 100);
                });
            },
            
            async consultarPedido() {
                if (!this.codigoConsulta.trim()) {
                    this.mostrarMensaje('Error', 'Por favor ingresa un código de seguimiento.', 'error');
                    return;
                }
                
                const modalCargando = this.mostrarMensaje('Buscando', 'Buscando tu pedido...');
                
                try {
                    const response = await fetch(`consultar_pedido.php?codigo=${this.codigoConsulta}`);
                    const responseText = await response.text();
                    let data;
                    
                    try {
                        data = JSON.parse(responseText);
                    } catch (e) {
                        console.error('Respuesta no es JSON:', responseText);
                        throw new Error('Error en la respuesta del servidor');
                    }

                    // Cerrar modal de búsqueda
                    modalCargando.close();
                    
                    setTimeout(() => {
                        if (data.success) {
                            this.pedidoConsultado = data.pedido;
                            this.mostrarErrorConsulta = false;
                            
                            let mensaje = `
                                <div style="margin-bottom: 15px;">
                                    <p><strong>Código:</strong> ${this.pedidoConsultado.codigoSeguimiento}</p>
                                    <p><strong>Estado:</strong> <span style="
                                        background: ${this.pedidoConsultado.estado === 'revision' ? '#ffc107' : 
                                                     this.pedidoConsultado.estado === 'aprobado' ? '#28a745' : 
                                                     this.pedidoConsultado.estado === 'proceso' ? '#17a2b8' : '#232f3e'};
                                        color: ${this.pedidoConsultado.estado === 'revision' ? '#000' : 'white'};
                                        padding: 4px 12px;
                                        border-radius: 20px;
                                        font-size: 0.9rem;
                                    ">${this.estadoTexto(this.pedidoConsultado.estado)}</span></p>
                                    <p><strong>Gama:</strong> ${this.pedidoConsultado.gama}</p>
                                    <p><strong>Tipo:</strong> ${this.pedidoConsultado.tipo}</p>
                                    <p><strong>Cantidad total:</strong> ${this.pedidoConsultado.cantidad}</p>
                                    <p><strong>Cliente:</strong> ${this.pedidoConsultado.datosCliente.nombre}</p>
                                    <p><strong>Total:</strong> $${this.pedidoConsultado.total.toFixed(2)}</p>
                                </div>
                            `;
                            
                            if (this.pedidoConsultado.estado === 'revision') {
                                mensaje += `
                                    <div style="
                                        background: #fff3cd;
                                        border: 1px solid #ffeaa7;
                                        padding: 10px;
                                        border-radius: 4px;
                                        margin-top: 15px;
                                        font-size: 0.9rem;
                                    ">
                                        <strong>Nota:</strong> Este pedido está en estado de revisión y puede ser editado o cancelado.
                                    </div>
                                `;
                            } else {
                                mensaje += `
                                    <div style="
                                        background: #d1ecf1;
                                        border: 1px solid #bee5eb;
                                        padding: 10px;
                                        border-radius: 4px;
                                        margin-top: 15px;
                                        font-size: 0.9rem;
                                    ">
                                        <strong>Nota:</strong> Este pedido ya no puede ser editado ni cancelado.
                                    </div>
                                `;
                            }
                            
                            this.mostrarMensaje('Pedido Encontrado', mensaje, 'exito');
                            
                        } else {
                            this.pedidoConsultado = null;
                            this.mostrarErrorConsulta = true;
                            this.mostrarMensaje('No Encontrado', 
                                'No se encontró ningún pedido con ese código de seguimiento.', 
                                'error');
                        }
                    }, 300);
                    
                } catch (error) {
                    console.error('Error:', error);
                    modalCargando.close();
                    setTimeout(() => {
                        this.pedidoConsultado = null;
                        this.mostrarErrorConsulta = true;
                        this.mostrarMensaje('Error', 
                            'Error al consultar el pedido: ' + error.message, 
                            'error');
                    }, 300);
                }
            },
            
            estadoTexto(estado) {
                const estados = {
                    'revision': 'En revisión',
                    'aprobado': 'Aprobado',
                    'proceso': 'En proceso',
                    'completado': 'Completado'
                };
                return estados[estado] || estado;
            },
            
            async editarPedido() {
                if (!this.pedidoConsultado) return;
                
                if (this.pedidoConsultado.estado !== 'revision') {
                    this.mostrarMensaje('No Editable', 
                        `Este pedido ya no puede ser editado porque ya está <strong>${this.estadoTexto(this.pedidoConsultado.estado)}</strong>.`, 
                        'advertencia');
                    return;
                }
                
                const confirmar = await this.mostrarConfirmacion(
                    'Confirmar Edición',
                    `¿Deseas editar el pedido: <strong>${this.pedidoConsultado.codigoSeguimiento}</strong>?<br><br>
                    Serás redirigido al formulario de edición.`,
                    'Sí, Editar',
                    'No'
                );
                
                if (confirmar) {
                    window.location.href = `carrito.html?editar=${this.pedidoConsultado.codigoSeguimiento}`;
                }
            },
            
async cancelarPedido() {
    if (!this.pedidoConsultado) return;
    
    if (this.pedidoConsultado.estado !== 'revision') {
        this.mostrarMensaje('No Cancelable', 
            `Este pedido ya no puede ser cancelado porque ya está <strong>${this.estadoTexto(this.pedidoConsultado.estado)}</strong>.`, 
            'advertencia');
        return;
    }
    
    const confirmar = await this.mostrarConfirmacion(
        'Confirmar Cancelación',
        `¿Estás seguro de cancelar el pedido: <strong>${this.pedidoConsultado.codigoSeguimiento}</strong>?<br><br>
        <div style="
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        ">
            <strong>ADVERTENCIA:</strong> Esta acción NO se puede deshacer.
        </div>`,
        'Sí, Cancelar',
        'No, Conservar'
    );
    
    if (!confirmar) return;
    
    const modalProcesando = this.mostrarMensaje('Procesando', 'Cancelando tu pedido...');
    
    try {
        const response = await fetch('cancelar_pedido.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ codigo: this.pedidoConsultado.codigoSeguimiento })
        });
        
        const responseText = await response.text();
        console.log('Respuesta del servidor (cancelar):', responseText);
        
        let data;
        
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Error parseando JSON:', e);
            console.error('Texto de respuesta:', responseText);
            throw new Error('Respuesta del servidor inválida: ' + responseText.substring(0, 100));
        }

        modalProcesando.close();
        
        setTimeout(() => {
            if (data.success) {
                this.mostrarMensaje('Pedido Cancelado', 
                    'Tu pedido ha sido cancelado correctamente.', 
                    'exito');
                this.pedidoConsultado = null;
                this.codigoConsulta = '';
            } else {
                this.mostrarMensaje('Error', 
                    'Error al cancelar el pedido: ' + data.message, 
                    'error');
            }
        }, 300);
        
    } catch (error) {
        console.error('Error completo:', error);
        modalProcesando.close();
        setTimeout(() => {
            this.mostrarMensaje('Error', 
                'Error al cancelar el pedido: ' + error.message, 
                'error');
        }, 300);
    }
}


        }

    
    }).mount('#app-seguimiento');
}