const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");
const idModal = document.getElementById("idModal");

let arrayPaciente = [];
const clavePacientes = "guia6.pacientes";
let indiceEditado = null;

const limpiarForm = () => {
  inputNombre.value = "";
  inputApellido.value = "";
  inputFechaNacimiento.value = "";
  inputRdMasculino.checked = false;
  inputRdFemenino.checked = false;
  cmbPais.value = 0;
  inputDireccion.value = "";
  inputNombrePais.value = "";
  indiceEditado = null;
  buttonAgregarPaciente.innerHTML = '<i class="bi bi-person-plus-fill"></i> Guardar Datos';
  inputNombre.focus();
};

const addPaciente = function () {
  let nombre = inputNombre.value;
  let apellido = inputApellido.value;
  let fechaNacimiento = inputFechaNacimiento.value;
  let sexo =
    inputRdMasculino.checked == true
      ? "Hombre"
      : inputRdFemenino.checked == true
      ? "Mujer"
      : "";
  let pais = cmbPais.value;
  let labelPais = cmbPais.options[cmbPais.selectedIndex].text;
  let direccion = inputDireccion.value;

  if (
    nombre != "" &&
    apellido != "" &&
    fechaNacimiento != "" &&
    sexo != "" &&
    pais != 0 &&
    direccion != ""
  ) {
    const datos = [...arrayPaciente];
    const paciente = new Array(nombre, apellido, fechaNacimiento, sexo, labelPais, direccion);
    if (indiceEditado === null) datos.push(paciente);
    else datos[indiceEditado] = paciente;

    if (!guardarPacientes(datos)) return;
    mensaje.innerHTML = indiceEditado === null
      ? "Se ha registrado un nuevo paciente"
      : "Se han guardado los cambios";
    toast.show();
    limpiarForm();
    imprimirPacientes();
  } else {
    mensaje.innerHTML = "Faltan campos por completar";
    toast.show();
  }
};

function escaparTexto(valor) {
  const elemento = document.createElement("span");
  elemento.textContent = valor;
  return elemento.innerHTML;
}

function imprimirFilas() {
  let $fila = "";
  let contador = 1;

  arrayPaciente.forEach((element) => {
    $fila += `<tr>
        <td scope="row" class="text-center fw-bold">${contador}</td>
        <td>${escaparTexto(element[0])}</td>
        <td>${escaparTexto(element[1])}</td>
        <td>${escaparTexto(element[2])}</td>
        <td>${escaparTexto(element[3])}</td>
        <td>${escaparTexto(element[4])}</td>
        <td>${escaparTexto(element[5])}</td>
        <td>
          <button id="idBtnEditar${contador}" type="button" class="btn btn-primary" aria-label="Editar">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button id="idBtnEliminar${contador}" type="button" class="btn btn-danger" aria-label="Eliminar">
            <i class="bi bi-trash3-fill"></i>
          </button>
        </td>
      </tr>`;
    contador++;
  });
  return $fila;
}

const imprimirPacientes = () => {
  if (arrayPaciente.length === 0) {
    document.getElementById("idTablaPacientes").textContent = "Ninguno";
    return;
  }

  let $table = `<div class="table-responsive">
      <table class="table table-striped table-hover table-bordered">
        <tr>
          <th scope="col" class="text-center" style="width:5%">#</th>
          <th scope="col" class="text-center" style="width:15%">Nombre</th>
          <th scope="col" class="text-center" style="width:15%">Apellido</th>
          <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
          <th scope="col" class="text-center" style="width:10%">Sexo</th>
          <th scope="col" class="text-center" style="width:10%">Pais</th>
          <th scope="col" class="text-center" style="width:25%">Dirección</th>
          <th scope="col" class="text-center" style="width:10%">Opciones</th>
        </tr>
        ${imprimirFilas()}
      </table>
    </div>`;
  document.getElementById("idTablaPacientes").innerHTML = $table;

  arrayPaciente.forEach((_, indice) => {
    document.getElementById(`idBtnEditar${indice + 1}`).onclick = () => editarPaciente(indice);
    document.getElementById(`idBtnEliminar${indice + 1}`).onclick = () => eliminarPaciente(indice);
  });
};

let contadorGlobalOption = cmbPais.children.length;
const addPais = () => {
  let paisNew = inputNombrePais.value;

  if (paisNew != "") {
    let option = document.createElement("option");
    option.textContent = paisNew;
    option.value = contadorGlobalOption + 1;
    contadorGlobalOption++;
    cmbPais.appendChild(option);
    mensaje.innerHTML = "Pais agregado correctamente";
    toast.show();
  } else {
    mensaje.innerHTML = "Faltan campos por completar";
    toast.show();
  }
};

buttonLimpiarPaciente.onclick = () => {
  limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
  addPaciente();
};

buttonMostrarPaciente.onclick = () => {
  imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
  addPais();
};

idModal.addEventListener("shown.bs.modal", () => {
  inputNombrePais.value = "";
  inputNombrePais.focus();
});

function guardarPacientes(datos) {
  try {
    localStorage.setItem(clavePacientes, JSON.stringify(datos));
    arrayPaciente = datos;
    return true;
  } catch {
    mensaje.textContent = "No se pudieron guardar los cambios.";
    toast.show();
    return false;
  }
}

function cargarPacientes() {
  try {
    const datos = JSON.parse(localStorage.getItem(clavePacientes) ?? "[]");
    arrayPaciente = datos.map(paciente => Array.isArray(paciente)
      ? paciente
      : [paciente.nombre, paciente.apellido, paciente.fecha, paciente.sexo, paciente.pais, paciente.direccion]);
  } catch {
    mensaje.textContent = "No se pudieron leer los pacientes guardados.";
    toast.show();
  }
}

function editarPaciente(indice) {
  const [nombre, apellido, fecha, sexo, pais, direccion] = arrayPaciente[indice];
  indiceEditado = indice;
  inputNombre.value = nombre;
  inputApellido.value = apellido;
  inputFechaNacimiento.value = fecha;
  inputRdMasculino.checked = sexo === "Hombre";
  inputRdFemenino.checked = sexo === "Mujer";
  let opcion = [...cmbPais.options].find(elemento => elemento.text === pais && elemento.value !== "0");
  if (!opcion) {
    opcion = new Option(pais, ++contadorGlobalOption);
    cmbPais.add(opcion);
  }
  cmbPais.value = opcion.value;
  inputDireccion.value = direccion;
  buttonAgregarPaciente.textContent = "Guardar cambios";
  inputNombre.focus();
}

function eliminarPaciente(indice) {
  if (!confirm("¿Eliminar este paciente?")) return;
  if (!guardarPacientes(arrayPaciente.filter((_, posicion) => posicion !== indice))) return;

  if (indiceEditado === indice) limpiarForm();
  else if (indiceEditado !== null && indiceEditado > indice) indiceEditado--;
  imprimirPacientes();
  mensaje.textContent = "Paciente eliminado.";
  toast.show();
}

limpiarForm();
cargarPacientes();
imprimirPacientes();
