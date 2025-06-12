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
            this.per.obtenerDatos();
        } else if (elementoClick.id === "btnMostrar" && object.type === "click") {
            this.consultarAlServidor();
        } else {
            console.log("Pase por el boton");
        }
    }

    public consultarAlServidor(): void {
        let xmlReq = new XMLHttpRequest();

        xmlReq.onreadystatechange = () => {
            if (xmlReq.readyState === 4) {
                if (xmlReq.status === 200) {
                    console.log(xmlReq.responseText);
                    let textArea = document.getElementById("textarea_1");
                    //textArea.innerHTML = xmlReq.responseText;
                    let div = document.getElementById("lista");
                    div.innerHTML = "<h1>Devices</h1>";
                    div.innerHTML += "<ol>";
                    let devices:Array<Device> = JSON.parse(xmlReq.responseText);
                    for (let o of devices) {
                        div.innerHTML += "<li>" + o.id + " - " + o.name + " - " + o.description + " - " + o.state + " - " + "<button id='btnDevice_" + o.id + "'>Accion</button>" + "</li>";
                        console.log(o.id);
                        console.log(o.name);
                        console.log(o.description);
                        console.log(o.state);
                    }
                } else {
                    alert("Fallo la consulta");
                }
            }
        }

        xmlReq.open("GET", "http://localhost:8000/devices", true);
        let oJson = {name:"nombre", passwd:"sdasadas"};
        xmlReq.send(JSON.stringify(oJson));
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