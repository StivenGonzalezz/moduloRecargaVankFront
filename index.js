document.getElementById('form-checkout__personType').addEventListener('change', e => {
    const personTypesElement = document.getElementById('form-checkout__personType');
    updateSelectOptions(personTypesElement.value);
 });
 function updateSelectOptions(selectedValue){
    
    const naturalDocTypes = [
        new Option('C.C', 'CC'),
        new Option('C.E.', 'CE')
    ];
    const juridicaDocTypes = [
        new Option('NIT', 'NIT')
    ];
    const idDocTypes = document.getElementById('form-checkout__identificationType');
    
    if(selectedValue === 'natural') {
        idDocTypes.options.length = 0;
        naturalDocTypes.forEach(item => idDocTypes.options.add(item, undefined));
    } else {
        idDocTypes.options.length = 0;
        juridicaDocTypes.forEach(item => idDocTypes.options.add(item, undefined));
 }
}

function setPse() {
    fetch('http://localhost:3000/api/payment/paymentMethods', {body: JSON.stringify({id:"pse"}), method: "POST", headers:{"Content-Type": "application/json"}})
        .then(async function(response) {
            const paymentMethods = await response.json();
            console.log(paymentMethods);
            const banksListElement = document.getElementById('banksList');
            const selectElement = document.createElement('select');
            selectElement.name = 'financialInstitution';

            paymentMethods.result.forEach(bank => {
                const option = document.createElement('option');
                option.value = bank.id;
                option.textContent = bank.description;
                selectElement.appendChild(option);
            });

            banksListElement.appendChild(selectElement);

        }).catch(function(reason) {
            console.error('Failed to get payment methods', reason);
        });
}

(function initCheckout() {
    try {
        const docTypeElement = document.getElementById('form-checkout__identificationType');
        setPse();
        updateSelectOptions('natural')
    }catch(e) {
        return console.error('Error getting identificationTypes: ', e);
}
})();


document.getElementById('form-checkout').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío del formulario para que puedas procesar los datos
    
    // Captura los datos del formulario
    const formData = new FormData(this);
  
    // Convierte los datos a un objeto para acceder fácilmente
    const formValues = Object.fromEntries(formData.entries());
  
    console.log(formValues); // { name: "valor", email: "valor", age: "valor", gender: "valor" }
    fetch('http://localhost:3000/api/payment/sendPayment', {body: JSON.stringify(formValues), method: "POST", headers:{"Content-Type": "application/json"}})
    .then(async function(response) {
        const responsePayment = await response.json();
        console.log(responsePayment);

    }).catch(function(reason) {
        console.error('Failed to get payment methods', reason);
    });

  });