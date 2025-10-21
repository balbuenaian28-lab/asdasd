// ===================================
// Lógica para el acordeón (Sección Folclore)
// ===================================
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const content = header.nextElementSibling;
        const isActive = item.classList.contains('active');

        // Cierra todos los acordeones
        document.querySelectorAll('.accordion-item').forEach(activeItem => {
            activeItem.classList.remove('active');
            activeItem.querySelector('.accordion-content').style.maxHeight = 0;
            activeItem.querySelector('.accordion-content').style.padding = '0 25px';
        });

        // Si no estaba activo, ábrelo
        if (!isActive) {
            item.classList.add('active');
            // Calcula la altura para mostrar el contenido
            content.style.maxHeight = (content.scrollHeight + 50) + 'px'; 
            content.style.padding = '25px';
        }
    });
});


// ===================================
// Lógica del Minijuego "Messi Chutando" - Arquero estático (Original)
// ===================================

// El código que agregaba 'idle-move' al portero al cargar ha sido eliminado.


function lanzarPenal(direccion) {
    const resultadoDiv = document.getElementById('resultado-penal');
    const porteroDiv = document.getElementById('portero-anim');
    const ballDiv = document.getElementById('ball-anim');
    const messageOverlay = document.getElementById('message-overlay');
    const kickBtns = document.querySelectorAll('.kick-btn');

    // Colores originales para el juego
    const COLOR_GOL = "#28a745"; // Verde para un gol
    const COLOR_ATAJADA = "#dc3545"; // Rojo para la acción fallida/parada
    
    // Deshabilitar botones durante la animación
    kickBtns.forEach(btn => btn.disabled = true);
    
    // Reiniciar estilos de animaciones
    ballDiv.className = 'ball'; 
    porteroDiv.className = 'portero'; // Resetear todas las clases del portero (quitando cualquier animación de atajada)
    messageOverlay.classList.remove('show');
    resultadoDiv.textContent = ''; 
    
    // 1. El portero se mueve a una dirección aleatoria
    const direccionesPortero = ['left', 'center', 'right'];
    const atajada = direccionesPortero[Math.floor(Math.random() * direccionesPortero.length)];

    porteroDiv.classList.add(`move-${atajada}`); // Anima al portero a atajar
    ballDiv.style.opacity = '1'; // Mostrar el balón

    // 2. Animar el balón hacia la dirección elegida
    ballDiv.classList.add(`kick-${direccion}`);

    // 3. Determinar resultado después de que la animación termine (600ms)
    setTimeout(() => {
        let mensaje = "";
        let color = "";
        let overlayText = "";

        if (direccion !== atajada) {
            // GOL: Usa el color verde original
            mensaje = "⚽ ¡GOOOOL! ¡La clavaste en el ángulo!";
            color = COLOR_GOL; 
            overlayText = "¡GOL!";
            ballDiv.style.opacity = '0';
        } else {
            // ATAJADA: Usa Rojo original
            mensaje = "🧤 ¡ATAJADA! El arquero voló y la sacó con las uñas.";
            color = COLOR_ATAJADA; 
            overlayText = "¡ATAJÓ!";
            // La bola se detiene
            ballDiv.classList.remove(`kick-${direccion}`);
            
            // Simular dónde se detiene la bola
            if (atajada === 'left') {
                ballDiv.style.left = '18%'; 
                ballDiv.style.bottom = '40px';
            } else if (atajada === 'right') {
                ballDiv.style.left = '82%';
                ballDiv.style.bottom = '40px';
            } else {
                 ballDiv.style.left = '50%';
                 ballDiv.style.bottom = '40px';
            }
        }
        
        resultadoDiv.innerHTML = mensaje;
        resultadoDiv.style.color = color;
        messageOverlay.textContent = overlayText;
        messageOverlay.style.backgroundColor = color; 
        messageOverlay.classList.add('show');
        
        // Re-habilitar botones después de un tiempo para que el usuario pueda ver el resultado
        setTimeout(() => {
             kickBtns.forEach(btn => btn.disabled = false);
             // No se añade ninguna clase de animación 'idle'
        }, 1200);

    }, 600);
} // <--- CIERRE DE LA FUNCIÓN lanzarPenal (Corregido el error de sintaxis)


// ===================================
// Lógica para animaciones al hacer scroll (Intersection Observer)
// ===================================
const scrollFadeIns = document.querySelectorAll('.scroll-fade-in');

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    rootMargin: '0px',
    threshold: 0.1 
});

scrollFadeIns.forEach(el => observer.observe(el));


// ===================================
// Efecto Parallax y Navegación Activa al Scroll
// ===================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateScrollEffects() {
    // 1. Efecto Parallax para el Hero
    const heroBg = document.querySelector('.hero-bg-image');
    if (heroBg) {
        let scrollPosition = window.pageYOffset;
        heroBg.style.transform = 'translateY(' + scrollPosition * 0.4 + 'px)'; 
    }

    // 2. Navegación Activa
    let current = '';
    const navbar = document.querySelector('.navbar');
    const navBarHeight = navbar ? navbar.offsetHeight : 0; 

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navBarHeight;
        if (window.pageYOffset >= sectionTop - 50) { 
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}

// Escuchar el evento de scroll
window.addEventListener('scroll', updateScrollEffects);
// Ejecutar una vez al cargar para establecer la posición inicial
updateScrollEffects();