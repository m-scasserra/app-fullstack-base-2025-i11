window.addEventListener("load", () => {

    let current_value = document.getElementById("textarea_1") as HTMLInputElement;
    let new_value = "Hola mundo!!!" + "\n" + current_value.value;
    document.getElementById("textarea_1").innerHTML = new_value;

    let btn = document.getElementById("btn_1");

    btn.addEventListener("click", () => {
        alert("Se hizo click");
    });
});