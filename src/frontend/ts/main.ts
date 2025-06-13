class Main implements EventListenerObject {

    nombre: string = "Matias";
    per: Persona = new Persona("", 3);

    public mostrarEnConsola(mensaje: string): void {
        console.log(mensaje);
    }

    handleEvent(object: Event): void {
        console.log(object);
        let elementoClick = <HTMLInputElement>object.target;

        if (elementoClick.id === "btn_1") {
            let titulo = document.getElementById("titulo1");
            let texto = <HTMLInputElement>document.getElementById("texto1");

            titulo.innerHTML = "Titulo nuevo";
            let nombre = texto.value;
            texto.hidden = true;
            console.log(texto.setAttribute("otro", "otro valor!"));
            alert("El usuario es: " + nombre);
            let div = document.getElementById("lista");
            div.hidden = true;
        } else if (elementoClick.id === "btnMostrar" && object.type === "click") {
            this.consultarAlServidor();
        } else if (elementoClick.id.startsWith("cb_")) {
            console.log("Pase por el elemento check!!", elementoClick.checked, elementoClick.id);
            console.log(elementoClick.id.substring(3, elementoClick.id.length));
            console.log(elementoClick);
            console.log(elementoClick.getAttribute("miIdBd"));
        }
    }

    public consultarAlServidor(): void {
        let xmlReq = new XMLHttpRequest();

        xmlReq.onreadystatechange = () => {
            if (xmlReq.readyState == 4) {
                if (xmlReq.status == 200) {
                    console.log(xmlReq.responseText);

                    let div = document.getElementById("lista");

                    let listado: string = "";
                    let devices: Array<Device> = JSON.parse(xmlReq.responseText);
                    for (let o of devices) {
                        listado += "<li class='collection-item avatar'>";
                        if (o.type == 1) {
                            listado += `<img src="./static/images/lightbulb.png" alt="" class="circle">`;
                        } else {
                            listado += `<img src="./static/images/window.png" alt="" class="circle">`;
                        }
                        listado += `<span class="title">${o.name}</span>`;
                        listado += `<p>${o.description}</p>`;
                        if (o.state) {
                            listado += `<a href="#!" class="secondary-content">
                                            <div class="switch">
                                                <label>
                                                    Off
                                                    <input id='cb_${o.id}' miIdBd='${o.id}' checked type="checkbox">
                                                    <span class="lever"></span>
                                                    On
                                                </label>
                                            </div>
                                        </a>`
                        } else {
                            listado += `<a href="#!" class="secondary-content">
                                            <div class="switch">
                                                <label>
                                                    Off
                                                    <input id='cb_${o.id}' type="checkbox">
                                                    <span class="lever"></span>
                                                    On
                                                </label>
                                            </div>
                                        </a>`
                        }
                        listado += `</li>`;
                    }
                    div.innerHTML = listado;

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
    let main: Main = new Main();

    let btn = document.getElementById("btn_1");
    // let o: EventListenerObject = main;
    btn.addEventListener("click", main);
    let btnM = document.getElementById("btnMostrar");
    // btnM.addEventListener("mouseover", main);
    btnM.addEventListener("click", main);
});