class Usuario extends Persona {
    private mail: string;

    constructor(nombre:string, dni:number, mail:string) {
        super(nombre, dni);
        this.mail = mail;
    }

    public obtenerDatos():string {
        return this.mail + "-" + super.obtenerDatos();
    }

    public verMail(): string {
        return this.mail;
    }
}