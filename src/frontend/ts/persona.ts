class Persona implements Mostrable  {
    public nombre: string;
    private dni: number;

    public mostrarInfo(): string {
        return this.obtenerDatos();
    }

    constructor(nombre:string, dni:number) {
        this.nombre = nombre;
        this.dni = dni;
    }

    public obtenerDatos(): string {
        return this.nombre + " - " + this.dni; 
    }
}