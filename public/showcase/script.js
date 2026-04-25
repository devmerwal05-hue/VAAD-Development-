/* ============================================
   VAAD SHOWCASE — JavaScript Engine
   Smooth scroll, custom cursor, GSAP animations,
   Three.js particles, magnetic buttons,
   horizontal scroll, split-text, preloader
   ============================================ */

// ===== PRELOADER =====
class Preloader {
    constructor() {
        this.el = document.getElementById('preloader');
        this.progress = document.getElementById('preloaderProgress');
        this.counter = document.getElementById('preloaderCounter');
        this.count = 0;
        this.target = 100;
        this.animate();
    }

    animate() {
        const interval = setInterval(() => {
            this.count += Math.random() * 8;
            if (this.count >= this.target) {
                this.count = this.target;
                clearInterval(interval);
                setTimeout(() => this.hide(), 400);
            }
            this.counter.textContent = Math.floor(this.count);
            this.progress.style.width = this.count + '%';
        }, 50);
    }

    hide() {
        gsap.to(this.el, {
            yPercent: -100,
            duration: 1,
            ease: 'power4.inOut',
            onComplete: () => {
                this.el.style.display = 'none';
                document.body.classList.add('loaded');
                initAnimations();
            }
        });
    }
}

// ===== SMOOTH SCROLL (LENIS) =====
let lenis;

function initSmoothScroll() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, { offset: -80 });
                closeMenu();
            }
        });
    });
}

// ===== CUSTOM CURSOR =====
class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('cursor');
        if (!this.cursor || window.innerWidth < 768) return;

        this.dot = this.cursor.querySelector('.cursor-dot');
        this.ring = this.cursor.querySelector('.cursor-ring');
        this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.speed = 0.15;

        this.init();
    }

    init() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mousedown', () => this.cursor.classList.add('clicking'));
        window.addEventListener('mouseup', () => this.cursor.classList.remove('clicking'));

        // Hover states
        const hoverTargets = document.querySelectorAll('a, button, .project-card, .service-card, .magnetic-btn');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hovering'));
        });

        this.render();
    }

    render() {
        this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
        this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

        this.dot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;
        this.ring.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;

        requestAnimationFrame(() => this.render());
    }
}

// ===== MAGNETIC BUTTONS =====
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('[data-magnetic]');
        if (window.innerWidth < 768) return;
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: 'power2.out'
                });

                const inner = btn.querySelector('.magnetic-btn-text');
                if (inner) {
                    gsap.to(inner, {
                        x: x * 0.15,
                        y: y * 0.15,
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                }
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
                const inner = btn.querySelector('.magnetic-btn-text');
                if (inner) {
                    gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
                }
            });
        });
    }
}

// ===== THREE.JS PARTICLES =====
class ParticleField {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.mouse = { x: 0, y: 0 };
        this.clock = new THREE.Clock();

        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    createParticles() {
        const count = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            sizes[i] = Math.random() * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            color: 0xa78bfa,
            size: 0.02,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        this.camera.position.z = 5;
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
    }

    animate() {
        const elapsed = this.clock.getElapsedTime();

        if (this.particles) {
            this.particles.rotation.y = elapsed * 0.05;
            this.particles.rotation.x = elapsed * 0.02;

            // Mouse influence
            this.particles.rotation.y += this.mouse.x * 0.01;
            this.particles.rotation.x += this.mouse.y * 0.01;
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }
}

// ===== GSAP ANIMATIONS =====
function initAnimations() {
    // Register plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // --- Hero Entrance ---
    const heroTl = gsap.timeline({ delay: 0.2 });

    heroTl.to('.hero-title-word', {
        y: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'power4.out',
    })
    .to('.hero-overline', {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
    }, '-=0.8')
    .to('.hero-sub', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
    }, '-=0.6')
    .to('.hero-cta-row', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
    }, '-=0.5')
    .to('.hero-scroll-indicator', {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
    }, '-=0.4');

    // --- Reveal Text on Scroll ---
    gsap.utils.toArray('.reveal-text').forEach(el => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            }
        });
    });

    // --- Counter Animation ---
    gsap.utils.toArray('.stat-number').forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        const obj = { value: 0 };

        gsap.to(obj, {
            value: target,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
            onUpdate: () => {
                el.textContent = Math.floor(obj.value);
            }
        });
    });

    // --- Horizontal Scroll ---
    const horizontalSection = document.getElementById('horizontalScroll');
    const horizontalTrack = horizontalSection?.querySelector('.horizontal-track');

    if (horizontalTrack) {
        const totalWidth = horizontalTrack.scrollWidth - window.innerWidth + 100;

        gsap.to(horizontalTrack, {
            x: -totalWidth,
            ease: 'none',
            scrollTrigger: {
                trigger: horizontalSection,
                start: 'top top',
                end: () => `+=${totalWidth}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });
    }

    // --- Parallax Background ---
    gsap.to('#parallaxBg', {
        y: -100,
        ease: 'none',
        scrollTrigger: {
            trigger: '.parallax-break',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
        }
    });

    // --- Service Cards Stagger ---
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 60,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            }
        });
    });

    // --- Award Items Stagger ---
    gsap.utils.toArray('.award-item').forEach((item, i) => {
        gsap.from(item, {
            opacity: 0,
            x: -30,
            duration: 0.6,
            delay: i * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
            }
        });
    });

    // --- Nav Background on Scroll ---
    ScrollTrigger.create({
        start: 100,
        onUpdate: (self) => {
            document.getElementById('nav').classList.toggle('scrolled', self.direction === 1 && self.scroll() > 100);
        }
    });
}

// ===== MOBILE MENU =====
function initMenu() {
    const btn = document.getElementById('menuBtn');
    const overlay = document.getElementById('menuOverlay');

    if (!btn || !overlay) return;

    btn.addEventListener('click', () => {
        const isActive = overlay.classList.contains('active');
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    });
}

function openMenu() {
    document.getElementById('menuBtn').classList.add('active');
    document.getElementById('menuOverlay').classList.add('active');
    if (lenis) lenis.stop();
}

function closeMenu() {
    document.getElementById('menuBtn')?.classList.remove('active');
    document.getElementById('menuOverlay')?.classList.remove('active');
    if (lenis) lenis.start();
}

// ===== TESTIMONIALS =====
class TestimonialSlider {
    constructor() {
        this.data = [
            {
                text: "VAAD delivered something we didn't even know we needed. The immersive web experience transformed our brand perception overnight.",
                name: "Sarah Chen",
                role: "VP Design, Meridian Corp"
            },
            {
                text: "Working with VAAD felt like glimpsing the future. Their attention to micro-interactions and scroll-driven storytelling set a new standard for our industry.",
                name: "Marcus Rivera",
                role: "Creative Director, Aether Studios"
            },
            {
                text: "From the first pitch to the final deploy, VAAD maintained an obsessive level of craft. Our conversion rate increased 340% after launch.",
                name: "Lena Petrova",
                role: "CMO, Prism Commerce"
            }
        ];

        this.current = 0;
        this.textEl = document.getElementById('testimonialText');
        this.nameEl = document.getElementById('testimonialName');
        this.roleEl = document.getElementById('testimonialRole');
        this.currentEl = document.getElementById('testimonialCurrent');
        this.totalEl = document.getElementById('testimonialTotal');

        const prev = document.getElementById('prevTestimonial');
        const next = document.getElementById('nextTestimonial');

        if (prev) prev.addEventListener('click', () => this.prev());
        if (next) next.addEventListener('click', () => this.next());

        if (this.totalEl) this.totalEl.textContent = this.data.length;
    }

    update() {
        const item = this.data[this.current];
        if (!item) return;

        gsap.to([this.textEl, this.nameEl, this.roleEl], {
            opacity: 0,
            y: 20,
            duration: 0.3,
            stagger: 0.05,
            onComplete: () => {
                this.textEl.textContent = item.text;
                this.nameEl.textContent = item.name;
                this.roleEl.textContent = item.role;
                this.currentEl.textContent = this.current + 1;

                gsap.to([this.textEl, this.nameEl, this.roleEl], {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'power2.out'
                });
            }
        });
    }

    next() {
        this.current = (this.current + 1) % this.data.length;
        this.update();
    }

    prev() {
        this.current = (this.current - 1 + this.data.length) % this.data.length;
        this.update();
    }
}

// ===== FOOTER CLOCK =====
function initClock() {
    const el = document.getElementById('footerTime');
    if (!el) return;

    const update = () => {
        const now = new Date();
        const options = {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        el.textContent = `IST ${now.toLocaleTimeString('en-US', options)}`;
    };

    update();
    setInterval(update, 1000);
}

// ===== MARQUEE SPEED ON SCROLL =====
function initMarqueeScroll() {
    const marquee = document.querySelector('.marquee-track');
    if (!marquee) return;

    let speed = 1;

    ScrollTrigger.create({
        trigger: '.marquee-section',
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
            speed = 1 + Math.abs(self.getVelocity() / 5000);
            gsap.to(marquee, {
                '--speed': speed,
                duration: 0.5,
            });
            marquee.style.animationDuration = (30 / speed) + 's';
        }
    });
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    // Start preloader
    new Preloader();

    // Smooth scroll
    initSmoothScroll();

    // Custom cursor
    new CustomCursor();

    // Magnetic buttons
    new MagneticButtons();

    // Three.js particles
    new ParticleField();

    // Mobile menu
    initMenu();

    // Testimonials
    new TestimonialSlider();

    // Footer clock
    initClock();

    // Marquee scroll speed
    initMarqueeScroll();
});
