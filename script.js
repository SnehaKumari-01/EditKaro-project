
    // ===== Custom Cursor =====
    const cursor = document.querySelector('.cursor');
    const dot = document.querySelector('.cursor-dot');
    window.addEventListener('mousemove', (e)=>{
      const {clientX:x, clientY:y} = e;
      cursor.style.transform = `translate(${x}px, ${y}px)`;
      dot.style.transform = `translate(${x}px, ${y}px)`;
    });

    // ===== Smooth Scroll via Lenis =====
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // ===== Theme toggle (light/dark-ish) =====
    const toggle = document.getElementById('themeToggle');
    toggle.addEventListener('click', ()=>{
      const dark = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() === '#0a0b10';
      if(dark){
        document.documentElement.style.setProperty('--bg', '#f7f8ff');
        document.documentElement.style.setProperty('--panel', '#ffffff');
        document.documentElement.style.setProperty('--text', '#0a0b10');
        document.documentElement.style.setProperty('--card', '#ffffff');
        document.documentElement.style.setProperty('--glass', 'rgba(0,0,0,.04)');
        document.documentElement.style.setProperty('--border', 'rgba(0,0,0,.1)');
      } else {
        document.documentElement.style.setProperty('--bg', '#0a0b10');
        document.documentElement.style.setProperty('--panel', '#0f111a');
        document.documentElement.style.setProperty('--text', '#e6f0ff');
        document.documentElement.style.setProperty('--card', '#121522');
        document.documentElement.style.setProperty('--glass', 'rgba(255,255,255,.06)');
        document.documentElement.style.setProperty('--border', 'rgba(255,255,255,.08)');
      }
    });

    // ===== Year =====
    document.getElementById('year').textContent = new Date().getFullYear();

    // ===== Magnetic socials =====
    document.querySelectorAll('.magnetic').forEach(el=>{
      const strength = 18;
      el.addEventListener('mousemove', (e)=>{
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width/2);
        const y = e.clientY - (r.top + r.height/2);
        el.style.transform = `translate(${x/strength}px, ${y/strength}px)`;
      });
      el.addEventListener('mouseleave', ()=>{ el.style.transform = 'translate(0,0)'; });
    });

    // ===== hero card =====
    const tiltEl = document.querySelector('[data-tilt]');
    if(tiltEl){
      tiltEl.addEventListener('mousemove', (e)=>{
        const r = tiltEl.getBoundingClientRect();
        const rx = ((e.clientY - r.top)/r.height - 0.5) * -8;
        const ry = ((e.clientX - r.left)/r.width - 0.5) * 8;
        tiltEl.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      tiltEl.addEventListener('mouseleave', ()=> tiltEl.style.transform = 'rotateX(0) rotateY(0)');
    }

    // ===== GSAP Animations =====
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.from('.kicker',{ y:20, opacity:0, duration:.6, ease:'power2.out' });
    gsap.from('.title',{ y:26, opacity:0, duration:.8, delay:.1, ease:'power3.out' });
    gsap.from('.lead',{ y:24, opacity:0, duration:.8, delay:.2, ease:'power3.out' });
    gsap.from('.hero-cta',{ y:20, opacity:0, duration:.8, delay:.3, ease:'power3.out' });
    gsap.from('.hero-card',{ opacity:0, scale:.92, duration:.9, delay:.25, ease:'power3.out' });

    gsap.utils.toArray('.parallax').forEach(el=>{
      const speed = parseFloat(el.dataset.speed || 0);
      gsap.to(el,{
        yPercent: speed * 100,
        ease:'none',
        scrollTrigger:{
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    gsap.utils.toArray('.card').forEach((card)=>{
      const speed = parseFloat(card.dataset.speed || 0.3);
      // Parallax motion
      gsap.to(card,{
        yPercent: speed * 80,
        ease:'none',
        scrollTrigger:{
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
      gsap.from(card,{
        opacity:0,
        y:40,
        duration:.8,
        ease:'power3.out',
        scrollTrigger:{ trigger:card, start:'top 85%' }
      });
    });
    

    gsap.utils.toArray('.section-title, .about-section, .stats-section').forEach(el => {
        gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    });

    gsap.utils.toArray('.about-section .parallax').forEach(el => {
      const speed = parseFloat(el.dataset.speed || 0);
      gsap.to(el, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    gsap.utils.toArray('.service-card').forEach(card => {
        gsap.from(card, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none',
            }
        });
    });

    gsap.utils.toArray('.stat-number').forEach(stat => {
      const value = stat.dataset.count;
      const isDecimal = value.includes('.');
      const targetValue = parseFloat(value);
      const hasPlus = value.endsWith('+');

      let startValue = 0;
      if (isDecimal) {
          startValue = 0.0;
      }

      gsap.to(stat, {
          duration: 2,
          scrollTrigger: {
              trigger: stat,
              start: 'top 80%',
              toggleActions: 'play none none none',
          },
          innerHTML: targetValue,
          roundProps: isDecimal ? undefined : 'innerHTML',
          onUpdate: function() {
              let currentVal = this.targets()[0].innerHTML;
              if (isDecimal) {
                  this.targets()[0].innerHTML = parseFloat(currentVal).toFixed(1);
              } else {
                  this.targets()[0].innerHTML = Math.round(currentVal);
              }
          },
          onComplete: function() {
            if (hasPlus) {
                this.targets()[0].innerHTML += '+';
            }
          }
      });
    });


    document.querySelectorAll('.card, .service-card, .stat').forEach(c=>{
      c.addEventListener('mousemove', (e)=>{
        const r = c.getBoundingClientRect();
        const rx = ((e.clientY - r.top)/r.height - 0.5) * -6;
        const ry = ((e.clientX - r.left)/r.width - 0.5) * 6;
        c.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      c.addEventListener('mouseleave', ()=> c.style.transform = 'rotateX(0) rotateY(0)');
    });


    const track = document.getElementById('marqueeTrack');
    let offset = 0; let baseSpeed = 0.6; let boost = 0;

    function loop(){
      offset -= (baseSpeed + boost);
      track.style.transform = `translateX(${offset}px)`;
      if(Math.abs(offset) > track.scrollWidth/2){ offset = 0; }
      requestAnimationFrame(loop);
    }
    loop();
   
    lenis.on('scroll', (e)=>{ boost = Math.min(3, Math.abs(e.velocity)*0.4); clearTimeout(window._mto); window._mto=setTimeout(()=> boost=0, 150); });

    // ===== Filter Logic =====
    const chips = document.querySelectorAll('.chip');
    const cards = document.querySelectorAll('.card');
    const nextCat = document.getElementById('nextCat');
    const prevCat = document.getElementById('prevCat');
    const nextLabel = document.getElementById('nextLabel');

    const categories = Array.from(chips).map(c=>c.dataset.filter);
    let currentIndex = 0;

    function showCategory(index, direction='next'){
      chips.forEach(c=>c.classList.remove('active'));
      const cat = categories[index];
      const chip = chips[index];
      chip.classList.add('active');

      // Animate cards horizontally
      gsap.to(cards, {
        x: direction==='next'?100:-100,
        opacity:0,
        duration:.3,
        stagger:.02,
        onComplete:()=>{
          cards.forEach(card=>{
            const show = cat==='all' || card.dataset.cat.includes(cat);
            card.style.display = show? 'block':'none';
          });
          gsap.fromTo(cards, {x:direction==='next'?-100:100,opacity:0}, {x:0,opacity:1,duration:.4,stagger:.03});
        }
      });

      // label
      const nextIdx = (index+1)%categories.length;
      nextLabel.textContent = `Next: ${categories[nextIdx][0].toUpperCase()}${categories[nextIdx].slice(1)}`;
      nextLabel.classList.add('show');
      setTimeout(()=> nextLabel.classList.remove('show'), 1200);
    }

    chips.forEach((chip,i)=> chip.addEventListener('click', ()=>{
      currentIndex = i;
      showCategory(currentIndex);
    }));

    nextCat.addEventListener('click', ()=>{
      currentIndex = (currentIndex-1+categories.length)%categories.length;
      showCategory(currentIndex,'prev');
    });
    prevCat.addEventListener('click', ()=>{
      currentIndex = (currentIndex+1)%categories.length;
      showCategory(currentIndex,'next');
    });

    // ===== Lightbox =====
    const lb = document.getElementById('lightbox');
    const lbVideo = document.getElementById('lightboxVideo');
    document.querySelectorAll('.open').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const src = btn.dataset.video;
        const mediaContainer = document.getElementById('lightboxMediaContainer');
        mediaContainer.innerHTML = '';
        
        if (src.includes('youtube.com') || src.includes('youtu.be')) {
            const iframe = document.createElement('iframe');
            iframe.src = src + '?autoplay=1';
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('frameborder', '0');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.aspectRatio = '16/9';
            mediaContainer.appendChild(iframe);
        } else {
            const video = document.createElement('video');
            video.src = src;
            video.setAttribute('controls', '');
            video.setAttribute('playsinline', '');
            video.style.width = '100%';
            video.style.height = 'auto';
            video.style.aspectRatio = '16/9';
            mediaContainer.appendChild(video);
            video.play().catch(()=>{});
        }
        lb.classList.add('active');
      })
    });
    document.getElementById('closeLightbox').addEventListener('click', ()=>{
      const mediaContainer = document.getElementById('lightboxMediaContainer');
      mediaContainer.innerHTML = '';
      lb.classList.remove('active');
    });
    lb.addEventListener('click', (e)=>{ if(e.target === lb) { const mediaContainer = document.getElementById('lightboxMediaContainer'); mediaContainer.innerHTML = ''; lb.classList.remove('active'); } });

 
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        const v = entry.target; if(!(v instanceof HTMLVideoElement)) return;
        if(entry.isIntersecting){ v.play().catch(()=>{}); } else { v.pause(); }
      })
    },{ threshold:.5 });
    document.querySelectorAll('.thumb video').forEach(v=> io.observe(v));
