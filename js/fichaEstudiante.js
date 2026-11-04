const ficha = document.getElementById('ficha');
const resultado = document.getElementById('resultado');
const reglas = {
    carnet: [/^[A-Z]{2}\d{3}$/i, 'Escriba dos letras y tres números, como AB001.'],
    nombre: [/^\p{L}[\p{L}\p{M}]*(?: +\p{L}[\p{L}\p{M}]*)+$/u, 'Escriba el nombre completo usando letras y espacios.'],
    dui: [/^\d{8}-\d$/, 'Use el formato 00000000-0.'],
    nit: [/^\d{4}-\d{6}-\d{3}-\d$/, 'Use el formato 0000-000000-000-0.'],
    nacimiento: [/^\d{2}\/\d{2}\/\d{4}$/, 'Escriba una fecha real en el formato dd/mm/aaaa.'],
    correo: [/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/, 'Escriba un correo como nombre@ejemplo.com.'],
    edad: [/^\d+$/, 'Escriba la edad usando solo números.']
};

function esFechaReal(valor) {
    const [dia, mes, anio] = valor.split('/').map(Number);
    const fecha = new Date(0);
    fecha.setUTCFullYear(anio, mes - 1, dia);
    return anio > 0 && fecha.getUTCFullYear() === anio
        && fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia;
}

ficha.addEventListener('submit', evento => {
    evento.preventDefault();
    for (const [nombre, [patron, mensaje]] of Object.entries(reglas)) {
        const campo = ficha.elements.namedItem(nombre);
        const valor = campo.value.trim();
        const valido = patron.test(valor)
            && (nombre !== 'nacimiento' || esFechaReal(valor))
            && (nombre !== 'correo' || !campo.validity.typeMismatch);
        campo.setCustomValidity(valido ? '' : mensaje);
    }

    const valida = ficha.reportValidity();
    resultado.className = valida ? 'text-success mt-3' : 'text-danger mt-3';
    resultado.textContent = valida ? 'Todos los campos de la ficha son válidos.' : 'Revise los campos señalados.';
});

ficha.addEventListener('input', evento => {
    evento.target.setCustomValidity('');
    resultado.textContent = '';
});
