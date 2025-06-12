class Persona {
    public nombre: string;
    private dni: number;

    constructor(nombre:string, dni:number) {
        this.nombre = nombre;
        this.dni = dni;
    }

    public obtenerDatos(): string {
        return this.nombre + " - " + this.dni; 
    }
}