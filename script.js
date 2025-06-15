document.addEventListener('DOMContentLoaded', function() {
    // Establecer la fecha actual en el campo de fecha
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('visitDate').value = today;

    // Función para manejar las estrellas
    function setupStarRating(starContainer, hiddenInput) {
        const stars = starContainer.querySelectorAll('.fa-star');
        
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                hiddenInput.value = rating;
                
                // Actualizar la apariencia de las estrellas
                stars.forEach(s => {
                    if (s.getAttribute('data-rating') <= rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });

            // Efecto hover
            star.addEventListener('mouseover', function() {
                const rating = this.getAttribute('data-rating');
                stars.forEach(s => {
                    if (s.getAttribute('data-rating') <= rating) {
                        s.style.color = '#FFD700';
                    } else {
                        s.style.color = '#ddd';
                    }
                });
            });

            star.addEventListener('mouseout', function() {
                const currentRating = hiddenInput.value;
                stars.forEach(s => {
                    if (s.getAttribute('data-rating') <= currentRating) {
                        s.style.color = '#FFD700';
                    } else {
                        s.style.color = '#ddd';
                    }
                });
            });
        });
    }

    // Configurar los dos conjuntos de estrellas
    setupStarRating(document.querySelectorAll('.star-rating')[0], document.getElementById('attentionRating'));
    setupStarRating(document.querySelectorAll('.star-rating')[1], document.getElementById('responseRating'));

    // Función para enviar datos a Google Sheets
    async function submitToGoogleSheets(formData) {
        console.log('Enviando datos:', formData); // Debug
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbwwkg3vnQvcIdgIldg3O5A_niiXFcyNRt6XjfULbcwlgMQ1bwT9oUJ4ogTE9BemeBNy/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            console.log('Respuesta recibida:', response); // Debug
            return true;
        } catch (error) {
            console.error('Error al enviar datos:', error);
            return false;
        }
    }

    // Manejar el envío del formulario
    document.getElementById('ratingForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Verificar que todos los campos requeridos estén llenos
        const name = document.getElementById('name').value;
        const attentionRating = document.getElementById('attentionRating').value;
        const responseRating = document.getElementById('responseRating').value;

        if (!name || !attentionRating || !responseRating) {
            alert('Por favor, completa todos los campos requeridos');
            return;
        }

        const formData = {
            nombre: name,
            fechaVisita: document.getElementById('visitDate').value,
            atencionRecibida: attentionRating,
            tiempoRespuesta: responseRating,
            sugerencia: document.getElementById('suggestion').value,
            timestamp: new Date().toISOString()
        };

        console.log('Datos del formulario:', formData); // Debug

        // Intentar enviar los datos a Google Sheets
        const success = await submitToGoogleSheets(formData);
        console.log('Envío exitoso:', success); // Debug
        
        // Verificar si ambas valoraciones son 5 estrellas
        if (parseInt(attentionRating) === 5 && parseInt(responseRating) === 5) {
            // Redirigir a Google Reviews
            window.location.href = 'https://g.page/r/CdkfTf1l_JOeEBM/review';
        } else {
            // Mostrar página de agradecimiento
            const container = document.querySelector('.container');
            container.innerHTML = `
                <div class="thank-you-page">
                    <h1>¡Gracias por tu valoración!</h1>
                    <p>Tu opinión es muy importante para nosotros. Trabajaremos para mejorar nuestros servicios.</p>
                </div>
            `;
        }
    });
}); 