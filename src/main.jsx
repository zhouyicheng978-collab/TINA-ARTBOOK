import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ArrowDown, BookOpen, Compass, Moon, Sparkles } from "lucide-react";
import "./styles.css";

const artworks = [
  "art-01.webp",
  "art-02.webp",
  "art-03.webp",
  "art-04.webp",
  "art-05.webp",
  "art-06.webp",
  "art-07.webp",
  "art-08.webp",
  "art-09.webp",
  "art-10.webp",
  "art-11.webp",
  "art-12.webp",
  "art-13.webp",
  "art-14.webp",
  "art-15.webp",
  "art-16.webp",
  "art-17.webp",
  "art-18.webp",
  "art-19.webp",
  "art-20.webp",
  "art-21.webp",
  "art-22.webp",
  "art-23.webp",
  "art-24.webp"
];

const displayTitles = [
  "Banquo / The Burnt Wing",
  "Blue Rooms and Lost Corridors",
  "Porter Keeps Waiting",
  "The Eye Remembers",
  "Before the Night Comes",
  "Red Cord Archive"
];

function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let animationFrame;
    let particles = [];

    const createParticles = () => {
      const density = Math.min(420, Math.floor((width * height) / 5200));
      particles = Array.from({ length: density }, (_, index) => {
        const band = index % 7;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() > 0.82 ? 2 : 1,
          alpha: 0.18 + Math.random() * 0.5,
          speed: 0.12 + Math.random() * 0.28,
          wave: Math.random() * Math.PI * 2,
          band
        };
      });
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.speed;
        p.y -= p.speed * 0.58;
        p.wave += 0.006;
        if (p.x > width + 12 || p.y < -12) {
          p.x = -12 - Math.random() * 140;
          p.y = height + Math.random() * 120;
        }

        const contour = Math.sin(p.x * 0.006 + p.band) + Math.cos(p.y * 0.008 - p.band);
        const mask = contour > -0.18 || p.band === 0;
        if (!mask) return;

        const shimmer = 0.55 + Math.sin(time * 0.001 + p.wave) * 0.25;
        ctx.fillStyle = `rgba(196, 215, 232, ${p.alpha * shimmer})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      });
      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animationFrame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas className="particle-field" ref={canvasRef} aria-hidden="true" />;
}

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
}

function DraggableBadge() {
  const badgeRef = useRef(null);
  const state = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
    dragging: false,
    pointerOffsetX: 0,
    pointerOffsetY: 0,
    homeX: 0,
    homeY: 0
  });
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let frame;
    const animate = () => {
      const s = state.current;
      const stiffness = s.dragging ? 0.28 : 0.045;
      const damping = s.dragging ? 0.68 : 0.9;
      const ax = (s.targetX - s.x) * stiffness;
      const ay = (s.targetY - s.y) * stiffness;
      s.vx = (s.vx + ax) * damping;
      s.vy = (s.vy + ay) * damping;
      s.x += s.vx;
      s.y += s.vy;

      const nextAngle = Math.max(-12, Math.min(12, s.vx * 1.8 + s.x * 0.018));
      setAngle(nextAngle);

      if (badgeRef.current) {
        badgeRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${nextAngle}deg)`;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const onPointerDown = (event) => {
    const s = state.current;
    const rect = badgeRef.current.getBoundingClientRect();
    s.dragging = true;
    s.homeX = rect.left + rect.width / 2 - s.x;
    s.homeY = rect.top + rect.height / 2 - s.y;
    s.pointerOffsetX = event.clientX - rect.left - rect.width / 2;
    s.pointerOffsetY = event.clientY - rect.top - rect.height / 2;
    badgeRef.current.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    const s = state.current;
    if (!s.dragging) return;
    s.targetX = event.clientX - s.homeX - s.pointerOffsetX;
    s.targetY = event.clientY - s.homeY - s.pointerOffsetY;
  };

  const release = () => {
    const s = state.current;
    s.dragging = false;
    s.targetX = 0;
    s.targetY = 0;
  };

  return (
    <div className="badge-rig" style={{ "--badge-angle": `${angle}deg` }}>
      <div className="lanyard">
        <span />
        <span />
      </div>
      <button
        ref={badgeRef}
        className="badge"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        aria-label="Drag gallery pass"
      >
        <div className="badge-hole" />
        <img className="badge-mark" src="/brand/ma.png" alt="" draggable="false" />
        <p>YICHENG ZHOU</p>
        <small>Archive Pass / Personal Memos</small>
        <div className="badge-lines" />
        <b>GALLERY PASS</b>
      </button>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero section">
      <div className="hero-copy" data-reveal>
        <p className="kicker">Personal Memos / 一个人画册</p>
        <h1>EMBERS<br />IN THE SEA</h1>
        <h2>海水燃烬</h2>
        <div className="intro-block">
          <p>“I invite you to take part in this dream,<br />and we are all co-creators of this dreamscape.”</p>
          <p>“邀请你，参与这场梦，<br />而我们，都是这场梦境的共创者。”</p>
        </div>
        <div className="intro-block muted">
          <p>“Lost souls fill this building, wandering all day long,<br />longing for revenge with broken hearts.<br />Before the night comes,<br />they wish to share some secrets with you.”</p>
          <p>“这幢楼里住着许多失落的恶魂，终日游荡着，<br />怀着破碎的心，渴望复仇。<br />在夜晚来临之前，<br />他们想透露一些秘密给你听。”</p>
        </div>
        <a className="scroll-link" href="#gallery">
          <ArrowDown size={18} />
          Enter Archive
        </a>
      </div>
      <DraggableBadge />
    </section>
  );
}

function Fortune() {
  return (
    <section className="fortune section">
      <div className="fortune-inner" data-reveal>
        <div className="section-icon"><Moon size={18} /></div>
        <h2>Fortune favors the brave.</h2>
        <h3>天佑勇者</h3>
        <p className="cn-line">命运总是眷顾勇敢的人。</p>
        <blockquote>
          Do not swear by the moon, for it is fickle.
          <span>不要指着月亮起誓，它自己都变化无常。</span>
        </blockquote>
        <p className="moon-note">We trust that the moon shall guide us.<br />We shall be intimate with darkness.</p>
        <p className="moon-note cn">相信月亮的指引<br />拥抱黑暗。</p>
      </div>
    </section>
  );
}

function Gallery() {
  const curated = useMemo(
    () =>
      artworks.map((name, index) => ({
        name,
        title: displayTitles[index % displayTitles.length],
        size: index % 9 === 0 ? "wide" : index % 7 === 0 ? "tall" : index % 5 === 0 ? "small" : "normal"
      })),
    []
  );

  return (
    <section id="gallery" className="gallery section">
      <div className="gallery-heading" data-reveal>
        <div className="section-icon"><BookOpen size={18} /></div>
        <p className="kicker">HUA / Archive Plates</p>
        <h2>Images That Keep Their Secrets</h2>
        <p>画册被整理成一个缓慢展开的私人档案，像夜里的房间、信件、证词和未完成的梦。</p>
      </div>
      <div className="art-grid">
        {curated.map((art, index) => (
          <figure className={`art-card ${art.size}`} data-reveal key={art.name} style={{ "--delay": `${(index % 8) * 70}ms` }}>
            <img src={`/artbook-web/${encodeURIComponent(art.name)}`} alt={art.name.replace(/\.[^.]+$/, "")} loading="lazy" />
            <figcaption>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{art.title}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="closing section">
      <div className="closing-copy" data-reveal>
        <div className="section-icon"><Compass size={18} /></div>
        <p>
          And so, let go.<br />
          When the dream comes to an end,<br />
          stop trying so hard to distinguish the real from the unreal.<br />
          Stop insisting on naming every love and every pain.<br />
          Let everything remain in memory, softly blurred.<br />
          Images speak in silence,<br />
          yet they leave behind whatever you wish to keep.<br />
          Enter the dream. Lose yourself. Leave.<br />
          Bless the brave.<br />
          Until we meet again.
        </p>
        <p className="cn">
          于是放下。<br />
          当梦境终结时，<br />
          不再用力去辨别真实与虚幻，<br />
          不再执意表达爱或痛。<br />
          开始允许一切模糊地留存在记忆中。<br />
          图像无言，会留下你想留下的东西。<br />
          入梦，迷失，离开。<br />
          天佑勇者，后会有期。
        </p>
        <div className="seal">
          <Sparkles size={15} />
          EMBERS IN THE SEA / 海水燃烬
        </div>
      </div>
    </section>
  );
}

function App() {
  useReveal();

  return (
    <>
      <ParticleField />
      <div className="site-shell">
        <header className="topbar">
          <a href="#" className="brand">MA / HUA</a>
          <nav>
            <a href="#gallery">Archive</a>
            <a href="#gallery">画册</a>
          </nav>
        </header>
        <main>
          <Hero />
          <Fortune />
          <Gallery />
          <Closing />
        </main>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
