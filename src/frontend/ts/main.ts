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
            console.log("Pase por el elemento check!!", elementoClick.checked, elementoClick.id);
            let xmlReq = new XMLHttpRequest();
            xmlReq.onreadystatechange = () => {
                if (xmlReq.readyState == 4) {
                    if (xmlReq.status == 200) {
                        console.log("Se actualizo el estado del dispositivo");
                    } else {
                        alert("Fallo la actualizacion del estado del dispositivo");
                    }
                }
            }
            xmlReq.open("PUT", "http://localhost:8000/devices/" + elementoClick.id.substring(3, elementoClick.id.length), true);
            xmlReq.setRequestHeader("Content-Type", "application/json");
            let device: Device = new Device();
            device.id = parseInt(elementoClick.id.substring(3, elementoClick.id.length));
            device.state = elementoClick.checked;
            console.log(device);
            xmlReq.send(JSON.stringify(device));
        }
    }

    public consultarAlServidor(): void {
        let xmlReq = new XMLHttpRequest();

        xmlReq.onreadystatechange = () => {
            if (xmlReq.readyState == 4) {
                if (xmlReq.status == 200) {
                    console.log(xmlReq.responseText);

                    let divTodos = document.getElementById("swipe-lista-todos");
                    let divLiving = document.getElementById("swipe-lista-living");
                    let divCocina = document.getElementById("swipe-lista-cocina");
                    let divBalcon = document.getElementById("swipe-lista-balcon");

                    let listadoTodos: string[] = [];
                    let listadoLiving: string[] = [];
                    let listadoCocina: string[] = [];
                    let listadoBalcon: string[] = [];
                    let devices: Array<Device> = JSON.parse(xmlReq.responseText);
                    let listado: string = `<div class="row">`;
                    for (let o of devices) {
                        let singleCardHtml: string = `
                        <div class="col s12 m6 l2">
                            <div class="card">
                                <div class="card-image">
                                    <img src="./static/images/${o.type == 0 ? 'lightbulb.png' : 'window.png'}">
                                    <span class="card-title">${o.name}</span>
                                </div>
                                <div class="card-content">
                                    <p>${o.description}</p>
                                </div>
                                <div class="card-action"> <div class="switch">
                                        <label>
                                            Off
                                            <input id='cb_${o.id}' miIdBd='${o.id}' type="checkbox" ${o.state ? 'checked' : ''}>
                                            <span class="lever"></span>
                                            On
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                        listadoTodos.push(singleCardHtml);
                        if (o.location == 0) {
                            listadoLiving.push(singleCardHtml);
                        } else if (o.location == 1) {
                            listadoCocina.push(singleCardHtml);
                        } else if (o.location == 2) {
                            listadoBalcon.push(singleCardHtml);
                        }
                    }
                    divTodos.innerHTML = wrapInRow(listadoTodos);
                    divLiving.innerHTML = wrapInRow(listadoLiving);
                    divCocina.innerHTML = wrapInRow(listadoCocina);
                    divBalcon.innerHTML = wrapInRow(listadoBalcon);

                    for (let o of devices) {
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

    public mostrarInfo(): string {
        return "Estoy en el MAIN!";
    }
}

window.addEventListener("load", () => {

    var elems = document.querySelectorAll('.tabs');
    var instances = M.Tabs.init(elems);
    let main: Main = new Main();

    let btnM = document.getElementById("btnMostrar");
    btnM.addEventListener("click", main);
    main.consultarAlServidor();
});