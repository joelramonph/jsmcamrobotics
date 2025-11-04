// script/app.js

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initCarousel();
    initTeamAccordion();
    initCountdown();
    initCurrentYear();
});

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        // Actualizar aria-expanded para accesibilidad
        const isExpanded = mainNav.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Cerrar menú al hacer clic en un enlace
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Cerrar menú al redimensionar ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !menuToggle.contains(e.target) && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// ============================================
// CAROUSEL
// ============================================
function initCarousel() {
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const dots = document.querySelectorAll('.carousel-indicators .dot');

    if (!carouselInner || carouselItems.length === 0) return;

    let currentIndex = 0;
    const totalItems = carouselItems.length;
    let autoSlideInterval;
    let isTransitioning = false;

    const showSlide = (index) => {
        if (isTransitioning) return;
        isTransitioning = true;

        if (index >= totalItems) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = totalItems - 1;
        } else {
            currentIndex = index;
        }

        const offset = -currentIndex * 100;
        carouselInner.style.transform = `translateX(${offset}%)`;

        // Actualizar indicadores
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        // Actualizar clases active en items
        carouselItems.forEach((item, i) => {
            item.classList.toggle('active', i === currentIndex);
        });

        setTimeout(() => {
            isTransitioning = false;
        }, 600);
    };

    const startAutoSlide = () => {
        autoSlideInterval = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 5000);
    };

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    };

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentIndex - 1);
            resetAutoSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentIndex + 1);
            resetAutoSlide();
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
            const slideTo = parseInt(e.target.dataset.slideTo);
            showSlide(slideTo);
            resetAutoSlide();
        });
    });

    // Soporte para teclado (accesibilidad)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showSlide(currentIndex - 1);
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            showSlide(currentIndex + 1);
            resetAutoSlide();
        }
    });

    // Pausar auto-slide cuando el usuario pasa el mouse
    const carouselSection = document.querySelector('.hero.carousel');
    if (carouselSection) {
        carouselSection.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });

        carouselSection.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }

    // Inicializar
    showSlide(0);
    startAutoSlide();
}

// ============================================
// TEAM ACCORDION
// ============================================
function initTeamAccordion() {
    const expandButtons = document.querySelectorAll('.expand-btn');

    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const memberCard = button.closest('.member-card');
            const memberDetails = memberCard.querySelector('.member-details');

            // Cerrar otros acordeones (opcional)
            document.querySelectorAll('.member-details.active').forEach(detail => {
                if (detail !== memberDetails) {
                    detail.classList.remove('active');
                    const otherButton = detail.closest('.member-card').querySelector('.expand-btn');
                    otherButton.classList.remove('active');
                    otherButton.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle del acordeón actual
            memberDetails.classList.toggle('active');
            button.classList.toggle('active');

            // Actualizar aria-expanded
            const isExpanded = button.classList.contains('active');
            button.setAttribute('aria-expanded', isExpanded);

            // Scroll suave al elemento si se está expandiendo
            if (isExpanded) {
                setTimeout(() => {
                    memberCard.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 300);
            }
        });
    });
}

// ============================================
// COUNTDOWN & CLOCK
// ============================================
function initCountdown() {
    function actualizarRelojYContador() {
        const fechaActual = new Date();
        
        // Contador de días para WRO 2025 (26 de noviembre de 2025)
        const fechaObjetivo = new Date(2025, 10, 26); // Mes 10 = Noviembre
        const diferenciaMs = fechaObjetivo.getTime() - fechaActual.getTime();
        const msEnUnDia = 1000 * 60 * 60 * 24;
        const diasRestantes = Math.floor(diferenciaMs / msEnUnDia);
        
        const elementoContador = document.getElementById('dias-restantes');
        if (elementoContador) {
            if (diasRestantes > 0) {
                elementoContador.textContent = diasRestantes;
            } else if (diasRestantes === 0) {
                elementoContador.textContent = "TODAY!";
                elementoContador.style.animation = 'pulse 1s infinite';
            } else {
                elementoContador.textContent = "Event Completed";
            }
        }
        
        // Reloj digital
        const opcionesFecha = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
        };
        const opcionesHora = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
        };

        const fechaFormato = fechaActual.toLocaleDateString('en-US', opcionesFecha);
        const horaFormato = fechaActual.toLocaleTimeString('en-US', opcionesHora);
        
        const elementoReloj = document.getElementById('reloj-digital');
        if (elementoReloj) {
            elementoReloj.textContent = `${fechaFormato} | ${horaFormato}`;
        }
    }

    // Ejecutar inmediatamente y luego cada segundo
    actualizarRelojYContador();
    setInterval(actualizarRelojYContador, 1000);
}

// ============================================
// CURRENT YEAR (Footer)
// ============================================
function initCurrentYear() {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// ============================================
// SMOOTH SCROLL (Para enlaces internos)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignorar enlaces que son solo "#"
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos que queremos animar
document.querySelectorAll('.member-card, .objective-card, .photo-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// ACTIVE NAV LINK (Highlight según sección visible)
// ============================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    };
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const li = link.parentElement;
                    if (link.getAttribute('href') === `#${id}`) {
                        li.classList.add('active');
                    } else {
                        li.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        navObserver.observe(section);
    });
}

// Inicializar después de cargar el DOM
if (document.querySelector('.main-nav a[href^="#"]')) {
    updateActiveNavLink();
}

// ============================================
// LAZY LOADING DE IMÁGENES (Fallback manual)
// ============================================
if ('loading' in HTMLImageElement.prototype) {
    // El navegador soporta lazy loading nativo
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Implementación manual de lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ============================================
// PERFORMANCE: Reducir movimiento para usuarios con preferencias de accesibilidad
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Deshabilitar animaciones complejas
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}

// ============================================
// PRELOADER (Opcional)
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Si tienes un preloader, ocultarlo aquí
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }, 500);
    }
});

// ============================================
// ERROR HANDLING para imágenes
// ============================================
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn('Error loading image:', this.src);
        
        // Opcional: mostrar un placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.textContent = '🖼️ Image not available';
        placeholder.style.cssText = `
            width: 100%;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(1, 26, 61, 0.5);
            color: var(--neutral-light);
            border-radius: 8px;
        `;
        this.parentNode.insertBefore(placeholder, this);
    });
});

// ============================================
// CONSOLE MESSAGE (Branding)
// ============================================
// console.log(
//     '%c🚀 JSM CAM ROBOTICS %c\n' +
//     'WRO 2025 - Singapore\n' +
//     'Built with passion by the JSM CAM ROBOTICS team\n' +
//     'https://jsmcamrobotics.netlify.app',
//     'color: #066A9E; font-size: 20px; font-weight: bold;',
//     'color: #D7DAD4; font-size: 12px;'
// );