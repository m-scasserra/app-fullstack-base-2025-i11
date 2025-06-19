var M; // Hack para que no de error al compilar, ya que M es una variable global de Materialize

class Main implements EventListenerObject {

    nombre: string = "Matias";
    per: Persona = new Persona("", 3);

    public mostrarEnConsola(mensaje: string): void {
        console.log(mensaje);
    }

    handleEvent(object: Event): void {
        console.log(object);
        let elementoClick = <HTMLInputElement>object.target;

        if (elementoClick.id === "btnMostrar" && object.type === "click") {
            this.consultarAlServidor();
        } else if (elementoClick.id.startsWith("cb_")) {
            console.log("Cambio en el control del dispositivo:", elementoClick.id, "valor:", elementoClick.type === "range" ? elementoClick.value : elementoClick.checked);

            let xmlReq = new XMLHttpRequest();
            xmlReq.onreadystatechange = () => {
                if (xmlReq.readyState == 4) {
                    if (xmlReq.status == 200) {
                        console.log("Se actualizó el estado del dispositivo");
                    } else {
                        alert("Fallo la actualización del estado del dispositivo");
                    }
                }
            }

            let value = elementoClick.type === "range" ? parseInt(elementoClick.value): (elementoClick.checked ? 1 : 0);

            xmlReq.open("PUT", "http://localhost:8000/devices/" + elementoClick.id.substring(3), true);
            xmlReq.setRequestHeader("Content-Type", "application/json");

            let device: Device = new Device();
            device.id = parseInt(elementoClick.id.substring(3));
            device.state = value;

            xmlReq.send(JSON.stringify(device));
        }
    }

    public consultarAlServidor(): void {
        let xmlReq = new XMLHttpRequest();

        xmlReq.onreadystatechange = () => {
            if (xmlReq.readyState == 4) {
                if (xmlReq.status == 200) {
                    console.log(xmlReq.responseText);

                    let divLiving = document.getElementById("swipe-lista-living");
                    let divCocina = document.getElementById("swipe-lista-cocina");
                    let divBalcon = document.getElementById("swipe-lista-balcon");
                    let divHabitacion = document.getElementById("swipe-lista-habitacion");

                    let listadoLiving: string[] = [];
                    let listadoCocina: string[] = [];
                    let listadoBalcon: string[] = [];
                    let listadoHabitacion: string[] = [];
                    let devices: Array<Device> = JSON.parse(xmlReq.responseText);
                    for (let o of devices) {
                        const dropdownId = `dropdown-${o.id}`;
                        let singleCardHtml: string = `
                        <div class="col s12 m6 l2">
                            <div class="card" style="background-color:#cd8f56">
                                <div class="card-image">
                                    <img src="./static/images/${o.type == 0 ? 'lightbulb.png' : 'window.png'}">
                                    <span class="card-title">${o.name}</span>
                                    <a class="btn-floating halfway-fab dropdown-trigger red" data-target="${dropdownId}"><i class="material-icons">more_vert</i></a>
                                </div>
                                <div class="card-content">
                                    <p>${o.description}</p>
                                </div>
                                <div class="card-action"> 
                                    ${(o.type == 1) ?
                                `<p class="range-field">
                                        <input type="range" id="cb_${o.id}" miIdBd="${o.id}" min="0" max="100" value="${o.state}">
                                    </p>` :
                                `<div class="switch">
                                        <label style="color:black">
                                            Off
                                            <input id="cb_${o.id}" miIdBd="${o.id}" type="checkbox" ${o.state ? 'checked' : ''}>
                                            <span class="lever"></span>
                                            On
                                        </label>
                                    </div>`
                            }
                                </div>
                            </div>
                        </div>
                        <ul id="${dropdownId}" class="dropdown-content">
                            <li><a href="#!" class="modal-trigger" data-target="modalEdit_${o.id}">Edit</a></li>
                            <li><a href="#!" class="modal-trigger red-text" data-target="modalDelete_${o.id}">Delete</a></li>
                        </ul>
                        <!-- Modal Structure -->
                        <div id="modalDelete_${o.id}" class="modal">
                            <div class="modal-content">
                                <h4>Esta seguro que quiere eliminar el dispositivo ${o.name}?</h4>
                                <p>La elimininacion del dispositivo es permanente.</p>
                            </div>
                            <div class="modal-footer">
                                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancelar</a>
                                <a href="#!" onclick="deleteDevice(${o.id})" class="modal-close waves-effect waves-red btn red lighten-1">BORRAR</a>
                            </div>
                        </div>
                        <!-- Modal Editar -->
                        <div id="modalEdit_${o.id}" class="modal">
                            <div class="modal-content">
                                <h4>Editar Dispositivo</h4>
                                <div class="row">
                                    <form id="formEditarDevice_${o.id}" class="col s12">
                                        <div class="row">
                                            <div class="input-field col s12">
                                                <input id="edit_name_${o.id}" name="name" type="text" value="${o.name}" required>
                                                <label class="active" for="edit_name_${o.id}">Nombre</label>
                                            </div>
                                            <div class="input-field col s12">
                                                <input id="edit_description_${o.id}" name="description" type="text" value="${o.description}">
                                                <label class="active" for="edit_description_${o.id}">Descripción</label>
                                            </div>

                                            <!-- Location Dropdown -->
                                            <div class="input-field col s12">
                                                <input type="hidden" id="edit_location_${o.id}" name="location" value="${o.location}" />
                                                <a class="dropdown-trigger btn" href="#" data-target="dropdownLocacion_${o.id}">
                                                    ${["Living", "Cocina", "Balcón", "Habitación"][o.location]}
                                                </a>
                                                <ul id="dropdownLocacion_${o.id}" class="dropdown-content">
                                                    <li><a href="#!" data-value="0">Living</a></li>
                                                    <li><a href="#!" data-value="1">Cocina</a></li>
                                                    <li><a href="#!" data-value="2">Balcón</a></li>
                                                    <li><a href="#!" data-value="3">Habitación</a></li>
                                                </ul>
                                            </div>

                                            <!-- Type Dropdown -->
                                            <div class="input-field col s12">
                                                <input type="hidden" id="edit_type_${o.id}" name="type" value="${o.type}" />
                                                <a class="dropdown-trigger btn" href="#" data-target="dropdownType_${o.id}">
                                                    ${["Luz", "Persiana"][o.type]}
                                                </a>
                                                <ul id="dropdownType_${o.id}" class="dropdown-content">
                                                    <li><a href="#!" data-value="0">Luz</a></li>
                                                    <li><a href="#!" data-value="1">Persiana</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Cancelar</a>
                                <a href="#!" onclick="editDevice(${o.id})" class="modal-close waves-effect waves-green btn">Guardar</a>
                            </div>
                        </div>`;
                        if (o.location == 0) {
                            listadoLiving.push(singleCardHtml);
                        } else if (o.location == 1) {
                            listadoCocina.push(singleCardHtml);
                        } else if (o.location == 2) {
                            listadoBalcon.push(singleCardHtml);
                        } else if (o.location == 3) {
                            listadoHabitacion.push(singleCardHtml);
                        }
                    }
                    divLiving.innerHTML = wrapInRow(listadoLiving);
                    divCocina.innerHTML = wrapInRow(listadoCocina);
                    divBalcon.innerHTML = wrapInRow(listadoBalcon);
                    divHabitacion.innerHTML = wrapInRow(listadoHabitacion);
                    var elemsDropdown = document.querySelectorAll('.dropdown-trigger');
                    var instancesDropdown = M.Dropdown.init(elemsDropdown);
                    var elemsModals = document.querySelectorAll('.modal');
                    var instancesModals = M.Modal.init(elemsModals);

                    for (let o of devices) {
                        // Evento para actualizar dropdown Locación por cada modal de edición
                        document.querySelectorAll(`#dropdownLocacion_${o.id} li a`).forEach(item => {
                            item.addEventListener('click', function () {
                                const value = this.getAttribute('data-value');
                                const text = this.textContent;

                                const hiddenInput = document.getElementById(`edit_location_${o.id}`) as HTMLInputElement | null;
                                const button = document.querySelector(`[data-target="dropdownLocacion_${o.id}"]`) as HTMLElement | null;

                                if (value && hiddenInput) {
                                    hiddenInput.value = value;
                                }

                                if (text && button) {
                                    button.textContent = text;
                                }
                            });
                        });

                        // Evento para actualizar dropdown Tipo por cada modal de edición
                        document.querySelectorAll(`#dropdownType_${o.id} li a`).forEach(item => {
                            item.addEventListener('click', function () {
                                const value = this.getAttribute('data-value');
                                const text = this.textContent;

                                const hiddenInput = document.getElementById(`edit_type_${o.id}`) as HTMLInputElement | null;
                                const button = document.querySelector(`[data-target="dropdownType_${o.id}"]`) as HTMLElement | null;

                                if (value && hiddenInput) {
                                    hiddenInput.value = value;
                                }

                                if (text && button) {
                                    button.textContent = text;
                                }
                            });
                        });
                        let checkbox = document.getElementById("cb_" + o.id);
                        checkbox.addEventListener("click", this);
                    }
                } else {
                    alert("Fallo la consulta");
                }
            }
        }

        xmlReq.open("GET", "http://localhost:8000/devices", true);
        xmlReq.send();
    }

    public editDevice(id: number): void {
        console.log("Editando dispositivo con ID:", id);
        const form = document.getElementById(`formEditarDevice_${id}`) as HTMLFormElement | null;
        if (!form) {
            console.error('Form no encontrado');
            return;
        }

        const nameInput = form.querySelector<HTMLInputElement>(`#edit_name_${id}`);
        const descriptionInput = form.querySelector<HTMLInputElement>(`#edit_description_${id}`);
        const locationInput = form.querySelector<HTMLInputElement>(`#edit_location_${id}`);
        const typeInput = form.querySelector<HTMLInputElement>(`#edit_type_${id}`);

        if (!nameInput || !descriptionInput || !locationInput || !typeInput) {
            console.error('Uno o más campos no encontrados');
            return;
        }

        const data = {
            name: nameInput.value,
            description: descriptionInput.value,
            location: locationInput.value,
            type: typeInput.value
        };
        const modal = M.Modal.getInstance(document.getElementById(`modalEdit_${id}`));
        modal.close();
        let xmlReq = new XMLHttpRequest();
        xmlReq.onreadystatechange = () => {
            if (xmlReq.readyState == 4) {
                if (xmlReq.status == 200) {
                    console.log("Se edito dispositivo");
                    this.consultarAlServidor();
                } else {
                    alert("Fallo la creacion del dispositivo");
                }
            }
        }
        xmlReq.open("PUT", "http://localhost:8000/devices/" + id, true);
        xmlReq.setRequestHeader("Content-Type", "application/json");
        let device: Device = new Device();
        device.id = id;
        device.name = data.name;
        device.description = data.description;
        device.location = parseInt(data.location);
        device.type = parseInt(data.type);
        console.log(device);
        xmlReq.send(JSON.stringify(device));
    }

    public deleteDevice(id: number): void {
        console.log("Eliminando dispositivo con ID:", id);
        let xmlReq = new XMLHttpRequest();
        xmlReq.onreadystatechange = () => {
            if (xmlReq.readyState == 4) {
                if (xmlReq.status == 200) {
                    console.log("Se borro exitosamente dispositivo");
                    this.consultarAlServidor();
                } else {
                    alert("Fallo al borrar el dispositivo");
                }
            }
        }
        xmlReq.open("DELETE", "http://localhost:8000/devices/", true);
        xmlReq.setRequestHeader("Content-Type", "application/json");
        let device: Device = new Device();
        device.id = id;
        xmlReq.send(JSON.stringify(device));
    }

    public submitAgregarDevice(): void {
        const form = document.getElementById('formAgregarDevice') as HTMLFormElement | null;
        if (!form) {
            console.error('Form no encontrado');
            return;
        }
        const nameInput = form.querySelector<HTMLInputElement>('#name');
        const descriptionInput = form.querySelector<HTMLInputElement>('#description');
        const locationInput = form.querySelector<HTMLInputElement>('#location');
        const typeSelect = form.querySelector<HTMLSelectElement>('#type');

        if (!nameInput || !descriptionInput || !locationInput || !typeSelect) {
            console.error('Uno o mas elementos del formulario no se encontraron');
            return;
        }

        if (nameInput.value == "" || descriptionInput.value == "") {
            console.error('Uno o mas campos obligatorios estan vacios');
            return;
        }

        const data = {
            name: nameInput.value,
            description: descriptionInput.value,
            location: locationInput.value,
            type: typeSelect.value
        };
        console.log('Submitting device:', data);
        const modal = M.Modal.getInstance(document.getElementById('agregarDevice'));
        modal.close();
        let xmlReq = new XMLHttpRequest();
        xmlReq.onreadystatechange = () => {
            if (xmlReq.readyState == 4) {
                if (xmlReq.status == 201) {
                    console.log("Se creo el nuevo dispositivo");
                    this.consultarAlServidor();
                } else {
                    alert("Fallo la creacion del dispositivo");
                }
            }
        }
        xmlReq.open("POST", "http://localhost:8000/devices/", true);
        xmlReq.setRequestHeader("Content-Type", "application/json");
        let device: Device = new Device();
        device.name = data.name;
        device.description = data.description;
        device.location = parseInt(data.location);
        device.type = parseInt(data.type);
        xmlReq.send(JSON.stringify(device));
    }
}


window.addEventListener("load", () => {

    var elemsTabs = document.querySelectorAll('.tabs');
    var instancesTabs = M.Tabs.init(elemsTabs);
    //var elemsModals = document.querySelectorAll('.modal');
    //var instancesModals = M.Modal.init(elemsModals);
    let main: Main = new Main();

    let btnM = document.getElementById("btnMostrar");
    btnM.addEventListener("click", main);
    (window as any).editDevice = (id: number) => main.editDevice(id);
    (window as any).deleteDevice = (id: number) => main.deleteDevice(id);
    (window as any).submitAgregarDevice = () => main.submitAgregarDevice();

    const dropdownItemsLocacion = document.querySelectorAll('#dropdownLocacion li a');
    dropdownItemsLocacion.forEach(item => {
        item.addEventListener('click', () => {
            const value = item.getAttribute('data-value');
            const text = item.textContent;

            const hiddenInput = document.getElementById('location') as HTMLInputElement | null;
            const button = document.querySelector('[data-target="dropdownLocacion"]') as HTMLElement | null;

            if (value && hiddenInput) {
                hiddenInput.value = value;
            }

            if (text && button) {
                button.textContent = text;
            }
        });
    });

    const dropdownItemsType = document.querySelectorAll('#dropdownType li a');
    dropdownItemsType.forEach(item => {
        item.addEventListener('click', function () {
            const value = this.getAttribute('data-value');
            const text = this.textContent;

            const hiddenInput = document.getElementById('type') as HTMLInputElement | null;
            const button = document.querySelector('[data-target="dropdownType"]') as HTMLElement | null;

            if (value && hiddenInput) {
                hiddenInput.value = value;
            }

            if (text && button) {
                button.textContent = text;
            }
        });
    });



    main.consultarAlServidor();
});