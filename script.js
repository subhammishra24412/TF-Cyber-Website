document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Custom Particle Background Mesh ---
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas.getContext("2d");
    
    let width, height;
    let particles = [];
    
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        
        draw() {
            ctx.fillStyle = "rgba(0, 255, 204, 0.5)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initParticles() {
        particles = [];
        let particleCount = Math.floor((width * height) / 15000); // Responsive count
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Connect near particles with a line mesh
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 204, ${1 - distance/120})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();

    // --- 2. Scroll-Triggered Fade-In Animations (Intersection Observer) ---
    const fadeElements = document.querySelectorAll(".fade-in");
    
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // --- 3. Dynamic Typewriter Animation (CLI Terminal) ---
    const terminalOutput = document.getElementById("terminal-output");
    
    const logMessages = [
        "> Establishing secure neural handshake...",
        "> Handshake verified. Latency: 4ms.",
        "> Booting Core Augmentation protocols...",
        "> Loading kinetic drives [||||||||||99%]",
        "> Overriding pain receptors...",
        "> SYSTEM ONLINE. Welcome to the grid."
    ];
    
    let currentLine = 0;
    let currentChar = 0;
    let isTyping = false;
    
    function typeWriter() {
        if (currentLine < logMessages.length) {
            if (!isTyping) {
                isTyping = true;
                // Create new line element
                const lineDiv = document.createElement("div");
                lineDiv.className = "terminal-line";
                terminalOutput.appendChild(lineDiv);
                
                // Add cursor
                const cursor = document.createElement("span");
                cursor.className = "cursor";
                terminalOutput.appendChild(cursor);
            }
            
            const currentLineText = logMessages[currentLine];
            const lines = document.querySelectorAll(".terminal-line");
            const activeLine = lines[lines.length - 1];
            
            if (currentChar < currentLineText.length) {
                activeLine.textContent += currentLineText.charAt(currentChar);
                currentChar++;
                setTimeout(typeWriter, Math.random() * 50 + 20); // Randomize typing speed
            } else {
                // Line finished
                currentLine++;
                currentChar = 0;
                isTyping = false;
                setTimeout(typeWriter, 400); // Pause before next line
            }
        }
    }
    
    // Start terminal typing when it scrolls into view
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(typeWriter, 500);
                terminalObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    terminalObserver.observe(document.getElementById("terminal"));
});