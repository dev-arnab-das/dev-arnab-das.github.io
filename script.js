$(function () {
  /* ---- Loader ---- */
  setTimeout(() => $("#loader").addClass("hide"), 2000);

  /* ---- AOS ---- */
  AOS.init({
    duration: 700,
    once: true,
    offset: 60,
  });

  /* ---- Custom cursor ---- */
  const cur = $(".cursor"),
    fol = $(".cursor-follower");
  $(document).on("mousemove", function (e) {
    cur.css({
      left: e.clientX,
      top: e.clientY,
    });
    setTimeout(
      () =>
        fol.css({
          left: e.clientX,
          top: e.clientY,
        }),
      80,
    );
  });
  $("a,button,.btn-neon,.glass-card,.filter-btn")
    .on("mouseenter", () => {
      cur.addClass("active");
      fol.addClass("active");
    })
    .on("mouseleave", () => {
      cur.removeClass("active");
      fol.removeClass("active");
    });

  /* ---- Scroll progress ---- */
  $(window).on("scroll", function () {
    const s = $(document).scrollTop();
    const h = $(document).height() - $(window).height();
    $("#scroll-progress").css("width", (s / h) * 100 + "%");
    /* navbar */
    s > 60
      ? $("#navbar").addClass("scrolled")
      : $("#navbar").removeClass("scrolled");
    /* back-top */
    s > 400
      ? $("#back-top").addClass("show")
      : $("#back-top").removeClass("show");
    /* nav active */
    const secs = [
      "about",
      "skills",
      "services",
      "projects",
      "why",
      "testimonials",
      "contact",
    ];
    secs.forEach((id) => {
      const el = $("#" + id);
      if (el.length) {
        const top = el.offset().top - 100,
          bot = top + el.outerHeight();
        if (s >= top && s < bot)
          $(".nav-link")
            .removeClass("active")
            .filter('[href="#' + id + '"]')
            .addClass("active");
      }
    });
    /* stats counter */
    triggerCounters();
    /* skill bars */
    triggerSkillBars();
  });

  /* ---- Theme toggle ---- */
  $("#themeToggle").on("click", function () {
    const cur = $("html").attr("data-theme");
    $("html").attr("data-theme", cur === "dark" ? "light" : "dark");
  });

  /* ---- Typing effect ---- */
  const phrases = [
    "Full Stack Developer",
    "WordPress Developer",
    "Frontend Developer",
    "Ecommerce Developer",
    "UI/UX Designer",
  ];
  let pi = 0,
    ci = 0,
    del = false;

  function type() {
    const p = phrases[pi];
    if (!del) {
      $("#typed-text").text(p.substring(0, ci + 1));
      ci++;
      if (ci === p.length) {
        del = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      $("#typed-text").text(p.substring(0, ci - 1));
      ci--;
      if (ci === 0) {
        del = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(type, del ? 60 : 100);
  }
  type();

  /* ---- Particles ---- */
  (function () {
    const canvas = document.getElementById("particles-canvas");
    const ctx = canvas.getContext("2d");
    let W,
      H,
      pts = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 80; i++)
      pts.push({
        x: Math.random() * 2000,
        y: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.5 + 0.2,
      });

    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,255,${p.a})`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${(1 - d / 120) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  })();

  /* ---- Stats counter ---- */
  let counted = false;

  function triggerCounters() {
    if (counted) return;
    const sec = $("#about");
    if (!sec.length) return;
    if ($(window).scrollTop() + $(window).height() > sec.offset().top + 100) {
      counted = true;
      $(".stat-number").each(function () {
        const $t = $(this),
          target = parseInt($t.data("target"));
        $({
          v: 0,
        }).animate(
          {
            v: target,
          },
          {
            duration: 1800,
            step: function () {
              $t.text(
                Math.floor(this.v) + (target >= 3 && target < 10 ? "" : "+"),
              );
            },
          },
        );
      });
    }
  }

  /* ---- Skill bars ---- */
  let barsTriggered = false;

  function triggerSkillBars() {
    if (barsTriggered) return;
    const sec = $("#skills");
    if (!sec.length) return;
    if ($(window).scrollTop() + $(window).height() > sec.offset().top + 80) {
      barsTriggered = true;
      setTimeout(() => {
        $(".skill-progress").each(function () {
          $(this).css("width", $(this).data("pct") + "%");
        });
      }, 300);
    }
  }

  /* ---- Skills data ---- */
  const skills = [
    {
      name: "HTML5",
      icon: "fab fa-html5",
      pct: 97,
      color: "#e34c26",
    },
    {
      name: "CSS3",
      icon: "fab fa-css3-alt",
      pct: 94,
      color: "#264de4",
    },
    {
      name: "JavaScript",
      icon: "fab fa-js",
      pct: 88,
      color: "#f7df1e",
    },
    {
      name: "jQuery",
      icon: "fas fa-code",
      pct: 90,
      color: "#0769ad",
    },
    {
      name: "Bootstrap 5",
      icon: "fab fa-bootstrap",
      pct: 95,
      color: "#7952b3",
    },
    {
      name: "PHP",
      icon: "fab fa-php",
      pct: 82,
      color: "#777bb3",
    },
    {
      name: "WordPress",
      icon: "fab fa-wordpress",
      pct: 96,
      color: "#21759b",
    },
    {
      name: "Custom WP Dev",
      icon: "fas fa-tools",
      pct: 88,
      color: "#00d4ff",
    },
    {
      name: "Elementor",
      icon: "fas fa-pencil-ruler",
      pct: 93,
      color: "#d30070",
    },
    {
      name: "WooCommerce",
      icon: "fas fa-shopping-cart",
      pct: 91,
      color: "#96588a",
    },
    {
      name: "Shopify",
      icon: "fas fa-store",
      pct: 85,
      color: "#96bf48",
    },
    {
      name: "Node.js",
      icon: "fab fa-node-js",
      pct: 45,
      color: "#68a063",
    },
    {
      name: "Responsive Design",
      icon: "fas fa-mobile-alt",
      pct: 98,
      color: "#00d4ff",
    },
    {
      name: "SEO Optimization",
      icon: "fas fa-search",
      pct: 87,
      color: "#ff6b35",
    },
    {
      name: "Speed Optimization",
      icon: "fas fa-tachometer-alt",
      pct: 85,
      color: "#f59e0b",
    },
    {
      name: "API Integration",
      icon: "fas fa-plug",
      pct: 78,
      color: "#7b2fff",
    },
    {
      name: "Landing Pages",
      icon: "fas fa-file-alt",
      pct: 94,
      color: "#ff2d78",
    },
    {
      name: "Ecommerce Dev",
      icon: "fas fa-shopping-bag",
      pct: 90,
      color: "#00c9a7",
    },
    {
      name: "CMS Development",
      icon: "fas fa-layer-group",
      pct: 88,
      color: "#ffd700",
    },
    {
      name: "UI/UX Design",
      icon: "fas fa-paint-brush",
      pct: 82,
      color: "#e91e63",
    },
  ];
  const sg = $("#skills-grid");
  skills.forEach((s, i) => {
    sg.append(`<div class="col-6 col-md-4 col-lg-3" data-aos="fade-up" data-aos-delay="${(i % 4) * 60}">
    <div class="glass-card skill-card">
      <div class="skill-icon" style="color:${s.color}"><i class="${s.icon}"></i></div>
      <div class="skill-pct">${s.pct}%</div>
      <div class="skill-name">${s.name}</div>
      <div class="skill-bar"><div class="skill-progress" data-pct="${s.pct}"></div></div>
    </div>
  </div>`);
  });

  /* ---- Services data ---- */
  const services = [
    {
      icon: "fas fa-palette",
      title: "Web Design",
      desc: "Stunning, conversion-focused designs that captivate your audience and reflect your brand identity.",
    },
    {
      icon: "fas fa-code",
      title: "Frontend Development",
      desc: "Pixel-perfect, responsive frontends built with modern HTML5, CSS3, JavaScript, and Bootstrap.",
    },
    {
      icon: "fab fa-wordpress",
      title: "WordPress Development",
      desc: "Custom WordPress themes, plugins, and full website solutions tailored to your needs.",
    },
    {
      icon: "fas fa-shopping-cart",
      title: "WooCommerce Store",
      desc: "Feature-rich online stores with seamless payment gateways, product management, and more.",
    },
    {
      icon: "fab fa-shopify",
      title: "Shopify Store Design",
      desc: "Professional Shopify stores designed to maximize conversions and deliver exceptional UX.",
    },
    {
      icon: "fas fa-store",
      title: "Ecommerce Development",
      desc: "End-to-end ecommerce platforms with inventory, orders, and customer management systems.",
    },
    {
      icon: "fas fa-file-alt",
      title: "Landing Page Design",
      desc: "High-converting landing pages optimized for lead generation and marketing campaigns.",
    },
    {
      icon: "fas fa-sync-alt",
      title: "Website Redesign",
      desc: "Transform your outdated website into a modern, high-performing digital experience.",
    },
    {
      icon: "fas fa-tachometer-alt",
      title: "Speed Optimization",
      desc: "Boost Core Web Vitals, page speed, and overall performance for better rankings and UX.",
    },
    {
      icon: "fas fa-search",
      title: "SEO Friendly Website",
      desc: "Technical SEO foundations built into every project for maximum organic visibility.",
    },
    {
      icon: "fas fa-mobile-alt",
      title: "Responsive Design",
      desc: "Flawless experiences across all devices — from smartphones to widescreen desktops.",
    },
    {
      icon: "fas fa-tools",
      title: "Website Maintenance",
      desc: "Ongoing updates, security patches, backups, and performance monitoring for your peace of mind.",
    },
  ];
  const sGrid = $("#services-grid");
  services.forEach((s, i) => {
    sGrid.append(`<div class="col-sm-6 col-lg-4" data-aos="fade-up" data-aos-delay="${(i % 3) * 80}">
    <div class="glass-card service-card h-100">
      <div class="service-icon"><i class="${s.icon}"></i></div>
      <div class="service-title">${s.title}</div>
      <div class="service-desc">${s.desc}</div>
      <div class="service-num">0${i + 1}</div>
    </div>
  </div>`);
  });

  /* ---- Projects data ---- */
  /* =========================
   PROJECT DATA
========================= */

  const projects = [
    {
      image: "images/Forbes.webp",
      title: "Forbes",
      desc: "Professional business and financial media platform delivering market insights, industry news, and corporate updates.",
      tags: ["HTML", "CSS", "BOOTSTRAP", "JAVASCRIPT", "JQUERY"],
      cat: "frontend",
      link: "https://projects.synergynexa.com/forbes/",
    },

    {
      image: "images/faydemand.webp",
      title: "Mutual Fund Website",
      desc: "Modern mutual fund investment platform offering financial insights, fund management, and seamless user experience.",
      tags: ["HTML", "CSS", "BOOTSTRAP", "JAVASCRIPT", "JQUERY"],
      cat: "frontend",
      link: "https://projects.synergynexa.com/faydemand/",
    },

    {
      image: "images/Arteikon.webp",
      title: "Arteikon",
      desc: "Creative eCommerce website showcasing handmade paintings and premium saree collections with seamless online shopping.",
      tags: ["HTML", "CSS", "BOOTSTRAP", "JAVASCRIPT", "JQUERY"],
      cat: ["ecommerce", "frontend"],
      link: "https://arteikon.com/home",
    },

    {
      image: "images/Hindterminals.webp",
      title: "Hindterminals",
      desc: "Professional logistics website designed for freight management, transportation services, and seamless shipment tracking.",
      tags: ["HTML", "CSS", "BOOTSTRAP", "JAVASCRIPT", "JQUERY"],
      cat: "frontend",
      link: "https://www.hindterminals.com/",
    },

    {
      image: "images/Chemist-Nearme.webp",
      title: "Chemist Nearme",
      desc: "Modern pharmacy website offering healthcare products, medicine information, and seamless online ordering services.",
      tags: ["HTML", "CSS", "BOOTSTRAP", "JAVASCRIPT", "JQUERY"],
      cat: ["ecommerce", "frontend"],
      link: "https://projects.synergynexa.com/chemist-nearme/",
    },

    {
      image: "images/sinclus.webp",
      title: "sinclus",
      desc: "Professional engineering, consulting, and marketing service website showcasing innovative business solutions, strategic planning, and digital growth services.",
      tags: ["HTML5", "CSS3"],
      cat: "frontend",
      link: "https://projects.synergynexa.com/sinclus/",
    },

    {
      image: "images/FIP.webp",
      title: "FIP",
      desc: "Professional pilot training website offering aviation courses, flight programs, and modern learning solutions for aspiring pilots.",
      tags: ["HTML", "CSS", "BOOTSTRAP", "JAVASCRIPT", "JQUERY"],
      cat: "frontend",
      link: "https://fip.synergynexa.com/",
    },
    {
      image: "images/sentoorkartoon.webp",
      title: "Sentoor Kartoon",
      desc: "Creative WooCommerce eCommerce website showcasing amazing cartoon-themed products, unique gift items, and a fun shopping experience.",
      tags: ["WORDPRESS", "WOO-COMMERCE", "Speed Optimization"],
      cat: ["wordpress", "woocommerce"],
      link: "https://sentoorkartoon.com/",
    },
    {
      image: "images/RSPN-Ventures.webp",
      title: "RSPN Ventures",
      desc: "Modern real estate website showcasing premium properties, investment opportunities, and seamless property search experiences.",
      tags: ["WORDPRESS", "Elementor", "Speed Optimization"],
      cat: "wordpress",
      link: "https://rspnventures.com/",
    },
    {
      image: "images/aaa.webp",
      title: "AAA Service India",
      desc: "Professional transport and logistics website offering freight solutions, shipment tracking, and efficient supply chain management services.",
      tags: ["WORDPRESS", "Elementor", "Speed Optimization"],
      cat: "wordpress",
      link: "https://projects.synergynexa.com/aaa/",
    },
    {
      image: "images/Intercare.webp",
      title: "Intercare Enterprise",
      desc: "Elegant interior design website showcasing creative spaces, modern décor solutions, and professional design services.",
      tags: ["WORDPRESS", "Elementor", "Speed Optimization"],
      cat: "wordpress",
      link: "https://intercareenterprise.in/",
    },
    {
      image: "images/Vastrtatva.webp",
      title: "Vastrtatva",
      desc: "Elegant WooCommerce saree store showcasing premium ethnic collections, secure online shopping, and a seamless customer experience.",
      tags: ["WORDPRESS", "Woo-Commerce", "Speed Optimization"],
      cat: ["wordpress", "woocommerce"],
      link: "https://www.vastrtatva.com/",
    },
    {
      image: "images/Caslay.webp",
      title: "Caslay",
      desc: "Modern WooCommerce clothing store featuring trendy T-shirts, stylish apparel collections, and a seamless online shopping experience.",
      tags: [
        "WORDPRESS",
        "Woo-Commerce",
        "Design",
        "Elementor",
        "Speed Optimization",
      ],
      cat: ["wordpress", "woocommerce"],
      link: "https://caslay.in/",
    },
  ];

  /* =========================
   LOAD PROJECTS
========================= */

  const pGrid = $("#projects-grid");

  projects.forEach((p, i) => {
    pGrid.append(`

    <div class="col-md-6 col-lg-4 project-item" 
     data-cat="${Array.isArray(p.cat) ? p.cat.join(" ") : p.cat}"
     data-aos="fade-up"
     data-aos-delay="${i * 80}">

      <a href="${p.link}" 
         target="_blank" 
         class="project-card">

        <div class="project-img">

          <img src="${p.image}" alt="${p.title}">

        </div>

        <div class="project-body">

          <h5>${p.title}</h5>

          <p>${p.desc}</p>

          <div class="project-tags">

            ${p.tags
              .map(
                (tag) => `
              <span class="project-tag">
                ${tag}
              </span>
            `,
              )
              .join("")}

          </div>

        </div>

      </a>

    </div>

  `);
  });

  /* =========================
   FILTER PROJECTS
========================= */

  $(".filter-btn").click(function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");

    const filter = $(this).data("filter");

    $(".project-item").each(function () {
      const categories = $(this).data("cat").split(" ");

      if (filter === "all" || categories.includes(filter)) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });

  /* ---- Why choose me ---- */
  const whyItems = [
    {
      icon: "fas fa-bolt",
      title: "Fast Delivery",
      desc: "On-time project delivery with clear milestones and regular progress updates.",
    },
    {
      icon: "fas fa-code",
      title: "Clean Code",
      desc: "Well-structured, documented, and maintainable code following best practices.",
    },
    {
      icon: "fas fa-mobile-alt",
      title: "Mobile Responsive",
      desc: "Pixel-perfect responsive layouts across all screen sizes and devices.",
    },
    {
      icon: "fas fa-search",
      title: "SEO Friendly",
      desc: "Every website is built with solid technical SEO foundations from day one.",
    },
    {
      icon: "fas fa-tachometer-alt",
      title: "Performance First",
      desc: "Optimized for speed with 90+ PageSpeed scores and Core Web Vitals.",
    },
    {
      icon: "fas fa-paint-brush",
      title: "Modern UI/UX",
      desc: "Intuitive interfaces with thoughtful UX that keep users engaged and converting.",
    },
    {
      icon: "fas fa-shield-alt",
      title: "Secure Website",
      desc: "SSL, input validation, and security hardening on every project delivered.",
    },
    {
      icon: "fas fa-heart",
      title: "User Friendly",
      desc: "Delightful user experiences that are easy to navigate and love using.",
    },
  ];
  const wg = $("#why-grid");
  whyItems.forEach((w, i) => {
    wg.append(`<div class="col-12 col-md-3" data-aos="fade-up" data-aos-delay="${(i % 4) * 70}">
    <div class="glass-card why-card h-100">
      <div class="why-icon"><i class="${w.icon}" style="color:var(--accent-1)"></i></div>
      <div class="why-title">${w.title}</div>
      <div class="why-desc">${w.desc}</div>
    </div>
  </div>`);
  });

  /* ---- Testimonials ---- */
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Startup Founder",
      review:
        "Arnab delivered our WordPress website in record time. The design is stunning and the performance is exceptional. Highly recommended!",
      init: "RS",
    },
    {
      name: "Priya Mehta",
      role: "Ecommerce Owner",
      review:
        "My WooCommerce store looks and performs brilliantly. Sales increased by 40% after the redesign. Arnab is a true professional.",
      init: "PM",
    },
    {
      name: "David Wilson",
      role: "Marketing Manager",
      review:
        "The landing pages Arnab built for us convert incredibly well. Clean code, fast delivery, and excellent communication throughout.",
      init: "DW",
    },
    {
      name: "Sneha Patel",
      role: "Hotel Owner",
      review:
        "Our hotel booking website is now bringing consistent organic traffic. SEO-optimized and beautifully designed. Great work!",
      init: "SP",
    },
    {
      name: "James Chen",
      role: "EdTech CEO",
      review:
        "Arnab built our entire LMS platform. The attention to detail and functionality exceeded our expectations. Will hire again!",
      init: "JC",
    },
    {
      name: "Anita Roy",
      role: "Fashion Retailer",
      review:
        "Our Shopify store is absolutely beautiful. Arnab understood our brand perfectly and delivered beyond expectations.",
      init: "AR",
    },
  ];
  const tg = $("#testimonials-grid");
  const dots = $("#testi-dots");
  testimonials.forEach((t, i) => {
    tg.append(`<div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${(i % 3) * 80}">
    <div class="glass-card testimonial-card h-100">
      <div class="stars">★★★★★</div>
      <p class="testimonial-text">"${t.review}"</p>
      <div class="testimonial-author">
        <div class="author-avatar">${t.init}</div>
        <div>
          <div class="author-name">${t.name}</div>
          <div class="author-role">${t.role}</div>
        </div>
      </div>
    </div>
  </div>`);
    dots.append(
      `<div class="dot${i === 0 ? " active" : ""}" data-i="${i}"></div>`,
    );
  });
  /* ---- Contact From Submit ---- */
  $(document).ready(function () {
    $("#contact-form").on("submit", function (e) {
      e.preventDefault();

      const name = $("#f-name").val().trim();
      const email = $("#f-email").val().trim();
      const subject = $("#f-subject").val().trim();
      const message = $("#f-message").val().trim();
      const phone = $("input[name='phone']").val().trim();
      const service = $("input[name='service']").val().trim();

      let valid = true;

      // Name validation
      if (!name) {
        $("#f-name").addClass("is-invalid");
        valid = false;
      } else {
        $("#f-name").removeClass("is-invalid");
      }

      // Email validation
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        $("#f-email").addClass("is-invalid");
        valid = false;
      } else {
        $("#f-email").removeClass("is-invalid");
      }

      // Subject validation
      if (!subject) {
        $("#f-subject").addClass("is-invalid");
        valid = false;
      } else {
        $("#f-subject").removeClass("is-invalid");
      }

      // Message validation
      if (!message) {
        $("#f-message").addClass("is-invalid");
        valid = false;
      } else {
        $("#f-message").removeClass("is-invalid");
      }

      if (!valid) {
        return;
      }

      const btn = $("#submit-btn");

      btn
        .html('<i class="fas fa-spinner fa-spin"></i> Sending...')
        .prop("disabled", true);

      emailjs
        .send("service_wp4fpn3", "template_yi9hnfm", {
          name: name,
          email: email,
          subject: subject,
          phone: phone,
          service: service,
          message: message,
          time: new Date().toLocaleString(),
        })
        .then(function (response) {
          console.log("SUCCESS!", response);

          $("#form-success").show();
          $("#form-error").hide();

          $("#contact-form")[0].reset();

          btn
            .html('<i class="fas fa-paper-plane"></i> Send Message')
            .prop("disabled", false);

          setTimeout(function () {
            $("#form-success").fadeOut();
          }, 5000);
        })
        .catch(function (error) {
          console.error("FAILED...", error);

          $("#form-error").show();
          $("#form-success").hide();

          btn
            .html('<i class="fas fa-paper-plane"></i> Send Message')
            .prop("disabled", false);
        });
    });
  });
  /* ---- Contact From Submit ---- */

  /* ---- Smooth scroll ---- */
  $(document).on("click", 'a[href^="#"]', function (e) {
    const target = $(this.getAttribute("href"));
    if (target.length) {
      e.preventDefault();
      $("html,body").animate(
        { scrollTop: target.offset().top - 60 },
        600,
        "swing",
      );
    }
  });

  /* Re-trigger on load */
  $(window).trigger("scroll");
});
