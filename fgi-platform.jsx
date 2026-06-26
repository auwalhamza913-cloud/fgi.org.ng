import { useState, useEffect, useRef, useReducer } from "react";

// ═══════════════════════════════════════════════════════
//  DESIGN TOKENS
// ═══════════════════════════════════════════════════════
const T = {
  navy:    "#0D2B4E",
  navyD:   "#081B34",
  navyL:   "#1A3F6F",
  green:   "#1A6B38",
  greenL:  "#22A050",
  gold:    "#E8A000",
  goldL:   "#F5C842",
  white:   "#FFFFFF",
  offW:    "#F4F7FB",
  text:    "#111827",
  muted:   "#4B5563",
  border:  "#E2E8F0",
  danger:  "#DC2626",
  success: "#16A34A",
};

// ═══════════════════════════════════════════════════════
//  INITIAL DATA
// ═══════════════════════════════════════════════════════
const INIT_MENTORS = [
  { id:1, name:"Abubakar Ali Ahmad", role:"Mentor", avatar:"👨‍🎓",
    expertise:["Islamic Education","Life Coaching","Medical Student Guidance","Drug Awareness","Education Awareness","Business Awareness"],
    bio:"A dedicated mentor passionate about Islamic values, life coaching and guiding medical students. Committed to raising a generation that is grounded in faith and excellence.",
    phone:"08163019775", whatsapp:"08163019775", active:true },
  { id:2, name:"Auwal Hamza Alhassan", role:"Mentor", avatar:"👨‍💻",
    expertise:["Crypto Trading","Entrepreneurship","Medical Student","Web Development","UI/UX Design","Graphic Design","Islamic Awareness","Life Coaching"],
    bio:"A multi-skilled mentor combining technology, entrepreneurship and Islamic guidance. Helping youth navigate the digital economy while staying true to their values.",
    phone:"08132521302", whatsapp:"08132521302", active:true },
  { id:3, name:"Urwatu Adamu", role:"Mentor", avatar:"👩‍⚕️",
    expertise:["Healthcare","Business Awareness","Global Politics","Youth Development"],
    bio:"Passionate about healthcare and global awareness, Urwatu empowers youth to think critically about health, business, and the world they live in.",
    phone:"08130676491", whatsapp:"08130676491", active:true },
  { id:4, name:"Nrs. Comrd Sunusi Mamuda", role:"Mentor", avatar:"🧑‍💼",
    expertise:["Information Technology","Healthcare","Psychological Counseling","Mentorship","Personal Development Coaching"],
    bio:"Bridging the gap between technology, health and psychology, Sunusi provides holistic mentorship that addresses mind, career and personal growth.",
    phone:"07045690707", whatsapp:"07045690707", active:true },
  { id:5, name:"Abubakar Adam Muhammad", role:"Mentor", avatar:"👨‍🏫",
    expertise:["Mentorship","Youth Guidance","Personal Development"],
    bio:"Dedicated to guiding the next generation toward purpose, discipline, and success through practical mentorship and community engagement.",
    phone:"07064742296", whatsapp:"07064742296", active:true },
];

const INIT_BLOG = [
  { id:1, title:"FGI Launches Scholarship Program for 50 Students", category:"News",
    date:"2026-06-01", author:"FGI Admin",
    content:"Future Guidance Initiative is proud to announce the launch of its annual scholarship program, benefiting 50 deserving students across Kano, Sokoto, and Abuja. This initiative is part of our commitment to ensuring that financial barriers never stand between talent and education.",
    image:"📰", published:true },
  { id:2, title:"Community Health Outreach: Over 300 Families Reached", category:"Activities",
    date:"2026-05-20", author:"FGI Team",
    content:"Our health awareness team conducted a two-day community health outreach in Gwale LGA, Kano. Medical screenings, free drugs, and health education were provided to over 300 families. We thank all volunteers who made this possible.",
    image:"🏥", published:true },
  { id:3, title:"Youth Entrepreneurship Workshop — Applications Open", category:"Events",
    date:"2026-06-10", author:"FGI Admin",
    content:"FGI is hosting a Youth Entrepreneurship Workshop open to all young people aged 18–35. Learn from experienced mentors, develop your business idea, and access seed funding opportunities. Apply now before slots fill up.",
    image:"💼", published:true },
];

const INIT_EVENTS = [
  { id:1, title:"Annual Youth Empowerment Summit 2026", date:"2026-07-15", location:"Kano State, Nigeria",
    description:"A one-day summit bringing together youth, mentors, and community leaders to discuss education, careers and the future of the Ummah.", image:"🎯", registrations:[] },
  { id:2, title:"Scholarship Award Ceremony", date:"2026-07-28", location:"FGI Community Hall, Abuja",
    description:"Celebration of our 2026 scholarship recipients. Join us as we celebrate excellence and invest in the future.", image:"🎓", registrations:[] },
  { id:3, title:"Free Health Screening Day", date:"2026-08-05", location:"Sokoto Central, Sokoto",
    description:"Free medical screenings, blood pressure checks, diabetes screening and health consultations for community members.", image:"🏥", registrations:[] },
];

const INIT_ACTIVITIES = [
  { id:1, title:"Food Distribution — Ramadan 2026", date:"2026-03-15", location:"Kano, Nigeria",
    description:"Distributed food packages to over 200 families during the blessed month of Ramadan. Alhamdulillah.", image:"🍲" },
  { id:2, title:"Prison Visitation & Rehabilitation", date:"2026-04-10", location:"Goron Dutse Prison, Kano",
    description:"Our team visited incarcerated youth with books, counseling sessions, and Islamic literature to support rehabilitation.", image:"🕊️" },
  { id:3, title:"Orphan Care Program", date:"2026-05-01", location:"Multiple Locations",
    description:"Provided clothing, school materials, and emotional support to 45 orphaned children across our partner orphanages.", image:"👶" },
];

const INIT_BANK = {
  bankName: "First Bank of Nigeria",
  accountName: "Future Guidance Initiative",
  accountNumber: "3012345678",
  whatsapp: "08163019775",
};

const INIT_VOLUNTEERS = [];
const INIT_MESSAGES = [];
const INIT_DONATIONS = [];

// ═══════════════════════════════════════════════════════
//  STORAGE HELPERS
// ═══════════════════════════════════════════════════════
function useStore(key, init) {
  const [data, setData] = useState(init);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(key);
        if (r && r.value) setData(JSON.parse(r.value));
      } catch {}
      setLoaded(true);
    })();
  }, [key]);

  const save = async (val) => {
    setData(val);
    try { await window.storage.set(key, JSON.stringify(val)); } catch {}
  };

  return [data, save, loaded];
}

// ═══════════════════════════════════════════════════════
//  TINY UI PRIMITIVES
// ═══════════════════════════════════════════════════════
const s = {
  btn: (bg=T.navy, fg="#fff", outline=false) => ({
    background: outline ? "transparent" : bg,
    color: outline ? bg : fg,
    border: outline ? `2px solid ${bg}` : "none",
    padding:"10px 24px", borderRadius:50, fontWeight:700, fontSize:14,
    cursor:"pointer", fontFamily:"inherit", transition:"all .18s", display:"inline-block",
  }),
  card: {
    background:T.white, borderRadius:16,
    boxShadow:"0 2px 16px rgba(13,43,78,.09)", padding:24,
  },
  input: {
    width:"100%", border:`1.5px solid ${T.border}`, borderRadius:10,
    padding:"10px 14px", fontSize:14, fontFamily:"inherit",
    outline:"none", color:T.text, background:T.white, boxSizing:"border-box",
  },
  label: { color:T.navy, fontWeight:700, fontSize:13, display:"block", marginBottom:6 },
  tag: (color=T.navy) => ({
    background:`${color}18`, color, borderRadius:50,
    padding:"3px 10px", fontSize:11, fontWeight:600, display:"inline-block",
  }),
};

function Btn({ children, onClick, color=T.navy, fg="#fff", outline=false, style={}, disabled=false }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...s.btn(color,fg,outline), opacity:disabled?.5:1, ...style }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.filter="brightness(1.12)")}
      onMouseLeave={e => (e.currentTarget.style.filter="none")}>
      {children}
    </button>
  );
}

function Input({ label, value, onChange, type="text", placeholder="", textarea=false, select=false, children, required=false }) {
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={s.label}>{label}{required&&<span style={{color:T.danger}}> *</span>}</label>}
      {textarea
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4}
            style={{ ...s.input, resize:"vertical" }} />
        : select
        ? <select value={value} onChange={onChange} style={{ ...s.input }}>{children}</select>
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder}
            style={s.input} required={required} />
      }
    </div>
  );
}

function SectionHead({ eyebrow, title, sub, light=false }) {
  return (
    <div style={{ textAlign:"center", marginBottom:48 }}>
      {eyebrow && <div style={{ ...s.tag(light?T.gold:T.green), letterSpacing:2, fontSize:11, marginBottom:14 }}>{eyebrow}</div>}
      <h2 style={{ color:light?T.white:T.navy, fontFamily:"Georgia,serif", fontSize:"clamp(1.6rem,3vw,2.3rem)", margin:"0 0 12px" }}>{title}</h2>
      {sub && <p style={{ color:light?"rgba(255,255,255,.72)":T.muted, maxWidth:560, margin:"0 auto", lineHeight:1.75 }}>{sub}</p>}
    </div>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)",
      background:T.navy, color:T.white, borderRadius:50, padding:"12px 28px",
      boxShadow:"0 8px 30px rgba(0,0,0,.25)", zIndex:9999, fontSize:14, fontWeight:600,
      animation:"slideUp .3s ease" }}>
      {msg}
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", zIndex:5000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:T.white, borderRadius:20, padding:32, maxWidth:560, width:"100%",
        maxHeight:"85vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,.3)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <h3 style={{ color:T.navy, fontFamily:"Georgia,serif", margin:0 }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:T.muted }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  LOGO
// ═══════════════════════════════════════════════════════
function Logo({ size=44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <defs>
        <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={T.navyD}/>
          <stop offset="100%" stopColor={T.navyL}/>
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="39" fill="url(#lg1)"/>
      <circle cx="40" cy="40" r="37" fill="none" stroke={T.gold} strokeWidth="1.2" opacity=".6"/>
      <text x="40" y="48" textAnchor="middle" fill={T.gold}
        fontSize="26" fontWeight="900" fontFamily="Georgia,serif">FGI</text>
      <text x="40" y="60" textAnchor="middle" fill="rgba(255,255,255,.55)"
        fontSize="7.5" fontFamily="sans-serif" letterSpacing="1.5">INITIATIVE</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════
//  NAVBAR
// ═══════════════════════════════════════════════════════
const NAV = ["Home","Programs","Mentors","AI Mentor","Events","Activities","Blog","Donate","Contact"];

function Navbar({ page, setPage, isAdmin, setIsAdmin }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = (p) => { setPage(p); setOpen(false); window.scrollTo(0,0); };

  return (
    <>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000,
        background: scrolled ? T.navyD : "rgba(8,27,52,.95)",
        backdropFilter:"blur(14px)",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,.3)" : "none",
        transition:"all .3s" }}>
        <div style={{ maxWidth:1240, margin:"0 auto", padding:"0 20px",
          display:"flex", alignItems:"center", justifyContent:"space-between", height:64 }}>

          <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => go("Home")}>
            <Logo size={42} />
            <div style={{ display:"flex", flexDirection:"column" }}>
              <span style={{ color:T.gold, fontFamily:"Georgia,serif", fontWeight:900, fontSize:17, lineHeight:1 }}>FGI</span>
              <span style={{ color:"rgba(176,196,222,.7)", fontSize:9, letterSpacing:1.8 }}>FUTURE GUIDANCE INITIATIVE</span>
            </div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:2 }} className="fgi-desktop">
            {NAV.map(n => (
              <button key={n} onClick={() => go(n)}
                style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"inherit",
                  color: page===n ? T.gold : "rgba(176,196,222,.85)",
                  fontWeight: page===n ? 700 : 500, fontSize:13, padding:"6px 11px",
                  borderRadius:8, borderBottom: page===n ? `2px solid ${T.gold}` : "2px solid transparent",
                  transition:"all .15s" }}>
                {n}
              </button>
            ))}
            {isAdmin
              ? <Btn onClick={() => go("Admin")} color={T.danger} style={{ padding:"7px 16px", fontSize:12, marginLeft:8 }}>⚙ Admin</Btn>
              : <Btn onClick={() => go("AdminLogin")} color={T.gold} fg={T.navyD} style={{ padding:"7px 16px", fontSize:12, marginLeft:8 }}>Admin Login</Btn>
            }
            <Btn onClick={() => go("Donate")} color={T.gold} fg={T.navyD} style={{ padding:"7px 16px", fontSize:12 }}>Donate ₦</Btn>
          </div>

          <button onClick={() => setOpen(!open)} className="fgi-ham"
            style={{ display:"none", background:"none", border:"none", color:T.white, fontSize:26, cursor:"pointer" }}>
            {open ? "✕" : "☰"}
          </button>
        </div>

        {open && (
          <div style={{ background:T.navyD, borderTop:`1px solid rgba(255,255,255,.07)`, padding:"8px 0 16px" }}>
            {[...NAV,"Admin"].map(n => (
              <div key={n} onClick={() => go(n)}
                style={{ padding:"11px 24px", color: page===n ? T.gold : T.white,
                  fontWeight: page===n ? 700 : 400, cursor:"pointer", fontSize:15,
                  borderLeft: page===n ? `3px solid ${T.gold}` : "3px solid transparent" }}>
                {n}
              </div>
            ))}
          </div>
        )}
      </nav>
      <style>{`.fgi-desktop{}.fgi-ham{} @media(max-width:900px){.fgi-desktop{display:none!important}.fgi-ham{display:block!important}}`}</style>
    </>
  );
}

// ═══════════════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════════════
function HomePage({ setPage, mentors, events, blog, activities }) {
  const stats = [
    { n:"5,000+", l:"Lives Impacted" },
    { n:"200+",   l:"Youth Empowered" },
    { n:"5",      l:"Expert Mentors" },
    { n:"8+",     l:"Active Programs" },
  ];

  return (
    <>
      {/* HERO */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative", overflow:"hidden",
        background:`linear-gradient(135deg, ${T.navyD} 0%, ${T.navyL} 55%, #0a3d1f 100%)` }}>
        {/* decorative blobs */}
        <div style={{ position:"absolute", width:500, height:500, borderRadius:"50%",
          background:"rgba(232,160,0,.06)", top:-100, right:-100, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%",
          background:"rgba(26,107,56,.12)", bottom:0, left:-80, pointerEvents:"none" }}/>

        <div style={{ maxWidth:1100, margin:"0 auto", padding:"130px 24px 80px", textAlign:"center", position:"relative" }}>
          <Logo size={100} />

          <div style={{ margin:"28px auto 0", display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(232,160,0,.14)", border:`1px solid rgba(232,160,0,.35)`,
            borderRadius:50, padding:"6px 20px", color:T.gold, fontSize:12, fontWeight:700, letterSpacing:2 }}>
            MENTORSHIP · EDUCATION · EMPOWERMENT
          </div>

          <h1 style={{ color:T.white, fontFamily:"Georgia,serif", fontSize:"clamp(2rem,5.5vw,4rem)",
            lineHeight:1.18, margin:"28px auto 20px", maxWidth:820 }}>
            Guiding Minds.{" "}
            <span style={{ color:T.gold }}>Empowering Lives.</span>
            <br/>Building the Future.
          </h1>

          <p style={{ color:"rgba(176,196,222,.85)", fontSize:"clamp(1rem,2vw,1.18rem)",
            maxWidth:600, margin:"0 auto 44px", lineHeight:1.8 }}>
            Future Guidance Initiative — a non-profit dedicated to education, mentorship,
            humanitarian aid and community development across Nigeria.
          </p>

          <div style={{ display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center", marginBottom:56 }}>
            <Btn onClick={() => setPage("AI Mentor")} color={T.gold} fg={T.navyD} style={{ fontSize:15, padding:"13px 30px" }}>🎓 Get Mentorship</Btn>
            <Btn onClick={() => setPage("Mentors")} color="transparent" fg={T.white} outline style={{ fontSize:15, padding:"13px 30px", border:`2px solid rgba(255,255,255,.5)` }}>Meet Our Mentors</Btn>
            <Btn onClick={() => setPage("Volunteer")} color={T.green} style={{ fontSize:15, padding:"13px 30px" }}>🤝 Volunteer</Btn>
            <Btn onClick={() => setPage("Donate")} color={T.gold} fg={T.navyD} style={{ fontSize:15, padding:"13px 30px" }}>❤ Support FGI</Btn>
          </div>

          {/* Stats bar */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20, maxWidth:680, margin:"0 auto",
            background:"rgba(255,255,255,.07)", backdropFilter:"blur(8px)",
            border:"1px solid rgba(255,255,255,.12)", borderRadius:20, padding:"22px 32px" }}>
            {stats.map(({n,l}) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ color:T.gold, fontSize:"1.8rem", fontWeight:900, fontFamily:"Georgia,serif", lineHeight:1 }}>{n}</div>
                <div style={{ color:"rgba(176,196,222,.75)", fontSize:11, marginTop:5, letterSpacing:.4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ padding:"80px 24px", background:T.white }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:56, alignItems:"center" }}>
          <div>
            <div style={{ ...s.tag(T.green), letterSpacing:2, fontSize:11, marginBottom:16 }}>ABOUT FGI</div>
            <h2 style={{ color:T.navy, fontFamily:"Georgia,serif", fontSize:"clamp(1.6rem,3vw,2.4rem)", marginBottom:20 }}>
              A Community Built on Faith, Knowledge & Service
            </h2>
            <p style={{ color:T.muted, lineHeight:1.85, marginBottom:16 }}>
              Future Guidance Initiative (FGI) is a Nigerian non-profit organization founded to transform lives through
              education, mentorship, and humanitarian service. We believe that every person — regardless of background —
              deserves guidance, opportunity, and a pathway to a dignified life.
            </p>
            <p style={{ color:T.muted, lineHeight:1.85, marginBottom:28 }}>
              From scholarship support and youth empowerment to orphan care and prison rehabilitation, FGI's programs
              address the whole person — mind, body, and spirit.
            </p>
            <div style={{ display:"flex", gap:12 }}>
              <Btn onClick={() => setPage("Programs")} color={T.navy}>Our Programs</Btn>
              <Btn onClick={() => setPage("Contact")} color={T.green} outline>Get Involved</Btn>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[
              { icon:"🎯", t:"Mission", d:"Guide, empower and support through education, mentorship and humanitarian services." },
              { icon:"🌅", t:"Vision", d:"Build a knowledgeable, empowered and successful generation." },
              { icon:"🕌", t:"Values", d:"Faith, integrity, compassion, community and excellence in all we do." },
              { icon:"🌍", t:"Reach", d:"Active across Kano, Abuja, Sokoto and growing communities nationwide." },
            ].map(b => (
              <div key={b.t} style={{ ...s.card, background:T.offW }}>
                <div style={{ fontSize:28, marginBottom:10 }}>{b.icon}</div>
                <div style={{ color:T.navy, fontWeight:700, marginBottom:6, fontSize:14 }}>{b.t}</div>
                <div style={{ color:T.muted, fontSize:12.5, lineHeight:1.65 }}>{b.d}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:700px){.fgi-about-grid{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* PROGRAMS PREVIEW */}
      <ProgramsPage setPage={setPage} preview />

      {/* MENTORS PREVIEW */}
      <section style={{ padding:"80px 24px", background:T.white }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <SectionHead eyebrow="HUMAN MENTORS" title="Meet Our Mentors" sub="Real people, real guidance — dedicated professionals giving their time to lift others." />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:20, marginBottom:36 }}>
            {mentors.slice(0,4).map(m => <MentorCard key={m.id} m={m} compact />)}
          </div>
          <div style={{ textAlign:"center" }}>
            <Btn onClick={() => setPage("Mentors")} color={T.navy}>View All Mentors</Btn>
          </div>
        </div>
      </section>

      {/* LATEST EVENTS */}
      {events.length > 0 && (
        <section style={{ padding:"80px 24px", background:T.offW }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <SectionHead eyebrow="UPCOMING" title="Events & Programs" sub="Join us — every event is an opportunity to connect, learn and grow." />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20, marginBottom:32 }}>
              {events.slice(0,3).map(ev => <EventCard key={ev.id} ev={ev} setPage={setPage} />)}
            </div>
            <div style={{ textAlign:"center" }}>
              <Btn onClick={() => setPage("Events")} color={T.navy}>All Events</Btn>
            </div>
          </div>
        </section>
      )}

      {/* LATEST BLOG */}
      {blog.filter(b=>b.published).length > 0 && (
        <section style={{ padding:"80px 24px", background:T.white }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <SectionHead eyebrow="LATEST" title="News & Updates" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20, marginBottom:32 }}>
              {blog.filter(b=>b.published).slice(0,3).map(p => <BlogCard key={p.id} post={p} />)}
            </div>
            <div style={{ textAlign:"center" }}>
              <Btn onClick={() => setPage("Blog")} color={T.navy}>Read More</Btn>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section style={{ padding:"80px 24px", background:`linear-gradient(135deg, ${T.navyD}, ${T.navyL})` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <SectionHead eyebrow="SUCCESS STORIES" title="Lives Transformed" sub="Every testimony is proof that guidance changes everything." light />
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
            {[
              { q:"FGI's mentorship helped me get into medical school. I didn't just get advice — I got a second family.", name:"Aisha M.", loc:"Kano", icon:"👩‍🎓" },
              { q:"The scholarship program changed my life. I was about to drop out. Today I'm in my final year.", name:"Yusuf A.", loc:"Abuja", icon:"👨‍💻" },
              { q:"During Ramadan, FGI's food packages were a lifeline for my family. May Allah bless them infinitely.", name:"A Family", loc:"Sokoto", icon:"🙏" },
            ].map((t,i) => (
              <div key={i} style={{ ...s.card, background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.1)" }}>
                <div style={{ fontSize:36, color:T.gold, fontFamily:"Georgia,serif", lineHeight:1 }}>"</div>
                <p style={{ color:"rgba(255,255,255,.85)", fontSize:14, lineHeight:1.8, fontStyle:"italic", margin:"8px 0 20px" }}>{t.q}</p>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:30 }}>{t.icon}</span>
                  <div>
                    <div style={{ color:T.gold, fontWeight:700, fontSize:14 }}>{t.name}</div>
                    <div style={{ color:"rgba(176,196,222,.6)", fontSize:12 }}>{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <NewsletterBar />
    </>
  );
}

// ═══════════════════════════════════════════════════════
//  PROGRAMS PAGE
// ═══════════════════════════════════════════════════════
const PROGRAMS = [
  { icon:"📚", title:"Education & Scholarships", color:T.navy,
    items:["Academic guidance","Scholarship grants","Student mentorship","Study skills workshops"] },
  { icon:"🏥", title:"Health Awareness", color:T.green,
    items:["Community health campaigns","Free medical screenings","Health education","Drug awareness"] },
  { icon:"🍲", title:"Food & Humanitarian Aid", color:"#92400E",
    items:["Ramadan food packages","Emergency relief","Nutritional support","Vulnerable families"] },
  { icon:"👶", title:"Orphan Care & Welfare", color:"#6D28D9",
    items:["School materials","Emotional support","Clothing & shelter","Partner orphanages"] },
  { icon:"⚙️", title:"Career & Skills Dev.", color:T.navyL,
    items:["Vocational training","Career mentorship","Entrepreneurship","Digital skills"] },
  { icon:"🕊️", title:"Prison Visitation", color:"#475569",
    items:["Rehabilitation support","Islamic literature","Counseling sessions","Reintegration"] },
  { icon:"🌱", title:"Youth Empowerment", color:T.green,
    items:["Leadership training","Youth summits","Confidence building","Community service"] },
  { icon:"💼", title:"Business Awareness", color:"#B45309",
    items:["Entrepreneurship talks","Business mentorship","Financial literacy","Networking"] },
];

function ProgramsPage({ setPage, preview=false }) {
  const list = preview ? PROGRAMS.slice(0,6) : PROGRAMS;
  return (
    <section style={{ padding:preview ? "80px 24px" : "100px 24px 80px", background:preview ? T.offW : T.offW }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        {preview
          ? <SectionHead eyebrow="OUR PROGRAMS" title="What We Do" sub="Six pillars of community transformation — each a commitment to human dignity." />
          : <>
              <div style={{ textAlign:"center", marginBottom:48, paddingTop:20 }}>
                <SectionHead eyebrow="FGI PROGRAMS" title="All Programs" sub="Comprehensive support for individuals and communities across every stage of life." />
              </div>
            </>
        }
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))", gap:22 }}>
          {list.map(p => (
            <div key={p.title} style={{ ...s.card, borderTop:`4px solid ${p.color}`, cursor:"default" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(13,43,78,.16)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=s.card.boxShadow; }}>
              <div style={{ fontSize:36, marginBottom:14 }}>{p.icon}</div>
              <h3 style={{ color:p.color, fontFamily:"Georgia,serif", fontSize:17, marginBottom:12 }}>{p.title}</h3>
              <ul style={{ color:T.muted, fontSize:13, paddingLeft:18, lineHeight:2, margin:0 }}>
                {p.items.map(it => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
        {preview && (
          <div style={{ textAlign:"center", marginTop:36 }}>
            <Btn onClick={() => setPage("Programs")} color={T.navy}>View All Programs</Btn>
          </div>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
//  MENTOR CARD & PAGE
// ═══════════════════════════════════════════════════════
function MentorCard({ m, compact=false }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{ ...s.card, textAlign:"center",
      transition:"transform .18s, box-shadow .18s" }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 10px 28px rgba(13,43,78,.16)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=s.card.boxShadow; }}>
      <div style={{ fontSize:compact?48:56, marginBottom:10 }}>{m.avatar}</div>
      <h3 style={{ color:T.navy, fontFamily:"Georgia,serif", fontSize:compact?15:18, marginBottom:4 }}>{m.name}</h3>
      <div style={{ color:T.green, fontSize:12, fontWeight:700, marginBottom:12 }}>{m.role}</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, justifyContent:"center", marginBottom:12 }}>
        {m.expertise.slice(0,compact?3:m.expertise.length).map(e => (
          <span key={e} style={s.tag(T.navy)}>{e}</span>
        ))}
      </div>
      {!compact && (
        <>
          <p style={{ color:T.muted, fontSize:13, lineHeight:1.7, marginBottom:16, textAlign:"left" }}>{m.bio}</p>
          <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
            <a href={`https://wa.me/234${m.whatsapp.replace(/^0/,"")}`} target="_blank" rel="noopener noreferrer"
              style={{ ...s.btn(T.green), textDecoration:"none", fontSize:13, padding:"8px 16px" }}>
              💬 WhatsApp
            </a>
            <a href={`tel:${m.phone}`}
              style={{ ...s.btn(T.navy, T.white, true), textDecoration:"none", fontSize:13, padding:"8px 16px",
                border:`2px solid ${T.navy}`, borderRadius:50 }}>
              📞 Call
            </a>
          </div>
        </>
      )}
      {compact && (
        <div style={{ marginTop:8 }}>
          <a href={`https://wa.me/234${m.whatsapp.replace(/^0/,"")}`} target="_blank" rel="noopener noreferrer"
            style={{ ...s.btn(T.green), textDecoration:"none", fontSize:12, padding:"6px 14px" }}>
            💬 WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

function MentorsPage({ mentors, setPage }) {
  const [selected, setSelected] = useState(null);
  return (
    <section style={{ paddingTop:80, minHeight:"100vh" }}>
      <div style={{ background:`linear-gradient(135deg,${T.navyD},${T.navyL})`, padding:"60px 24px 50px", textAlign:"center" }}>
        <Logo size={64} />
        <h1 style={{ color:T.white, fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", margin:"20px 0 12px" }}>
          Our Mentors
        </h1>
        <p style={{ color:"rgba(176,196,222,.8)", maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
          Real people committed to your growth. Each mentor brings unique expertise — contact them directly or use our AI Mentor for instant guidance.
        </p>
      </div>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"56px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:24 }}>
          {mentors.filter(m=>m.active).map(m => <MentorCard key={m.id} m={m} />)}
        </div>
        <div style={{ textAlign:"center", marginTop:48,
          background:T.offW, borderRadius:20, padding:36 }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🤖</div>
          <h3 style={{ color:T.navy, fontFamily:"Georgia,serif", marginBottom:10 }}>Need Instant Guidance?</h3>
          <p style={{ color:T.muted, marginBottom:20 }}>Our AI Mentor is available 24/7 for education, career and personal development advice.</p>
          <Btn onClick={() => setPage("AI Mentor")} color={T.navy}>Chat with AI Mentor</Btn>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
//  AI MENTOR
// ═══════════════════════════════════════════════════════
function AIMentorPage() {
  const [msgs, setMsgs] = useState([
    { role:"assistant", content:"Assalamu Alaikum wa Rahmatullahi wa Barakatuh! 🌟\n\nI'm the FGI AI Mentor — your guide for education, career planning, personal development, and life decisions.\n\nWhether you need study advice, career direction, scholarship information, or just someone to talk to about your future — I'm here for you 24/7. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role:"user", content:input.trim() };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          system:`You are the FGI AI Mentor — a warm, encouraging, and professional mentor for Future Guidance Initiative (FGI), a Nigerian non-profit. You specialize in:
- Education advice and study strategies
- Career guidance and planning (medicine, technology, entrepreneurship, etc.)
- Islamic values and life coaching
- Personal development and self-improvement
- FGI scholarships, programs, and services
- Youth empowerment and community development

Personality: Empathetic, motivating, deeply caring, grounded in Islamic values but welcoming to everyone. Speak warmly — like a wise older sibling or trusted mentor. Use occasional relevant emojis. Be concise but thorough. When relevant, mention FGI services like scholarships, mentors, volunteering, or donations. Always encourage and remind users of their potential and Allah's mercy.

Our real mentors available for WhatsApp contact:
- Abubakar Ali Ahmad: Islamic Education, Life Coaching, Medical guidance — 08163019775
- Auwal Hamza Alhassan: Tech, Crypto, Entrepreneurship, UI/UX — 08132521302
- Urwatu Adamu: Healthcare, Business, Global Politics — 08130676491
- Sunusi Mamuda: IT, Healthcare, Psychological Counseling — 07045690707
- Abubakar Adam Muhammad: Mentorship, Youth Guidance — 07064742296`,
          messages: newMsgs.map(m => ({ role:m.role, content:m.content }))
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "I'm here to help. Please try asking again.";
      setMsgs(prev => [...prev, { role:"assistant", content:reply }]);
    } catch {
      setMsgs(prev => [...prev, { role:"assistant", content:"Sorry, I'm having trouble connecting right now. Please try again in a moment, or reach out to our human mentors directly via WhatsApp." }]);
    }
    setLoading(false);
  };

  const quickPrompts = [
    "How do I improve my academic performance?",
    "Career advice for a medical student",
    "How to start a business in Nigeria?",
    "FGI scholarship information",
    "How to manage stress and anxiety?",
    "Best study techniques for exams",
  ];

  return (
    <section style={{ background:`linear-gradient(135deg,${T.navyD},#0a3d1f)`, minHeight:"100vh", paddingTop:80 }}>
      <div style={{ maxWidth:800, margin:"0 auto", padding:"40px 20px 60px" }}>
        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:72, height:72, borderRadius:"50%",
            background:`linear-gradient(135deg,${T.gold},${T.goldL})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:32, margin:"0 auto 14px",
            boxShadow:`0 0 0 8px rgba(232,160,0,.18)` }}>🤖</div>
          <h2 style={{ color:T.white, fontFamily:"Georgia,serif", fontSize:26, marginBottom:6 }}>FGI AI Mentor</h2>
          <p style={{ color:"rgba(176,196,222,.75)", fontSize:14 }}>Your 24/7 guide — powered by Claude AI</p>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginTop:8,
            background:"rgba(34,160,80,.2)", border:"1px solid rgba(34,160,80,.4)",
            borderRadius:50, padding:"4px 14px", color:T.greenL, fontSize:11, fontWeight:700 }}>
            <span style={{ width:6, height:6, background:T.greenL, borderRadius:"50%", display:"inline-block", animation:"pulse 2s infinite" }}/>
            ONLINE — AVAILABLE 24/7
          </div>
        </div>

        {/* Chat window */}
        <div style={{ background:"rgba(255,255,255,.05)", backdropFilter:"blur(16px)",
          border:"1px solid rgba(255,255,255,.1)", borderRadius:24, overflow:"hidden",
          boxShadow:"0 20px 60px rgba(0,0,0,.3)" }}>

          {/* Messages */}
          <div style={{ height:420, overflowY:"auto", padding:"24px 20px 0", scrollBehavior:"smooth" }}>
            {msgs.map((m,i) => (
              <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:18 }}>
                {m.role==="assistant" && (
                  <div style={{ width:34, height:34, borderRadius:"50%",
                    background:`linear-gradient(135deg,${T.gold},${T.goldL})`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:18, flexShrink:0, marginRight:10, marginTop:2 }}>🤖</div>
                )}
                <div style={{
                  maxWidth:"75%", padding:"13px 17px", borderRadius:18,
                  background: m.role==="user"
                    ? `linear-gradient(135deg,${T.gold},${T.goldL})`
                    : "rgba(255,255,255,.1)",
                  color: m.role==="user" ? T.navyD : T.white,
                  fontSize:14, lineHeight:1.7, whiteSpace:"pre-wrap",
                  borderBottomRightRadius: m.role==="user" ? 4 : 18,
                  borderBottomLeftRadius: m.role==="assistant" ? 4 : 18,
                }}>
                  {m.content}
                </div>
                {m.role==="user" && (
                  <div style={{ width:32, height:32, borderRadius:"50%", background:T.navyL,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:16, marginLeft:10, marginTop:2, flexShrink:0 }}>👤</div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", marginBottom:18 }}>
                <div style={{ width:34, height:34, borderRadius:"50%",
                  background:`linear-gradient(135deg,${T.gold},${T.goldL})`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:18, marginRight:10 }}>🤖</div>
                <div style={{ background:"rgba(255,255,255,.1)", borderRadius:18, borderBottomLeftRadius:4,
                  padding:"13px 20px", color:"rgba(255,255,255,.5)", fontSize:14 }}>
                  ✦ Thinking…
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          {/* Input */}
          <div style={{ padding:18, borderTop:"1px solid rgba(255,255,255,.08)", display:"flex", gap:10 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && !e.shiftKey && send()}
              placeholder="Ask about education, career, scholarships…"
              style={{ flex:1, background:"rgba(255,255,255,.08)", border:"1px solid rgba(255,255,255,.15)",
                borderRadius:50, padding:"12px 20px", color:T.white, fontSize:14,
                outline:"none", fontFamily:"inherit" }} />
            <Btn onClick={send} disabled={loading} color={T.gold} fg={T.navyD}
              style={{ padding:"12px 22px" }}>Send</Btn>
          </div>
        </div>

        {/* Quick prompts */}
        <div style={{ marginTop:18, display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
          {quickPrompts.map(q => (
            <button key={q} onClick={() => setInput(q)}
              style={{ background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.14)",
                borderRadius:50, padding:"7px 15px", color:"rgba(176,196,222,.8)", fontSize:12,
                cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,.14)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,.07)"}>
              {q}
            </button>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
//  EVENTS
// ═══════════════════════════════════════════════════════
function EventCard({ ev, setPage }) {
  const [registered, setRegistered] = useState(false);
  return (
    <div style={{ ...s.card, cursor:"default" }}
      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="none"; }}>
      <div style={{ fontSize:48, marginBottom:14, textAlign:"center" }}>{ev.image}</div>
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
        <span style={s.tag(T.green)}>{ev.date}</span>
        <span style={s.tag(T.navy)}>📍 {ev.location}</span>
      </div>
      <h3 style={{ color:T.navy, fontFamily:"Georgia,serif", fontSize:17, marginBottom:10 }}>{ev.title}</h3>
      <p style={{ color:T.muted, fontSize:13, lineHeight:1.7, marginBottom:16 }}>{ev.description}</p>
      <Btn onClick={() => setRegistered(!registered)}
        color={registered ? T.success : T.navy}
        style={{ width:"100%", textAlign:"center" }}>
        {registered ? "✓ Registered!" : "Register for Event"}
      </Btn>
    </div>
  );
}

function EventsPage({ events, setPage }) {
  return (
    <section style={{ paddingTop:80, minHeight:"100vh" }}>
      <div style={{ background:`linear-gradient(135deg,${T.navyD},${T.navyL})`, padding:"60px 24px 50px", textAlign:"center" }}>
        <h1 style={{ color:T.white, fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", marginBottom:12 }}>Events & Programs</h1>
        <p style={{ color:"rgba(176,196,222,.8)", maxWidth:500, margin:"0 auto" }}>Join us — every event is an opportunity to connect, learn and grow together.</p>
      </div>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"56px 24px" }}>
        {events.length === 0
          ? <div style={{ textAlign:"center", padding:60, color:T.muted }}>No upcoming events. Check back soon!</div>
          : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:24 }}>
              {events.map(ev => <EventCard key={ev.id} ev={ev} setPage={setPage} />)}
            </div>
        }
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
//  ACTIVITIES
// ═══════════════════════════════════════════════════════
function ActivitiesPage({ activities }) {
  return (
    <section style={{ paddingTop:80, minHeight:"100vh" }}>
      <div style={{ background:`linear-gradient(135deg,${T.green},#0a3d1f)`, padding:"60px 24px 50px", textAlign:"center" }}>
        <h1 style={{ color:T.white, fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", marginBottom:12 }}>Our Activities</h1>
        <p style={{ color:"rgba(255,255,255,.75)", maxWidth:500, margin:"0 auto" }}>Real stories of impact — communities touched, lives changed.</p>
      </div>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"56px 24px" }}>
        {activities.length === 0
          ? <div style={{ textAlign:"center", padding:60, color:T.muted }}>No activities yet. Check back soon!</div>
          : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:24 }}>
              {activities.map(a => (
                <div key={a.id} style={s.card}>
                  <div style={{ fontSize:52, textAlign:"center", marginBottom:14 }}>{a.image}</div>
                  <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                    <span style={s.tag(T.green)}>{a.date}</span>
                    <span style={s.tag(T.navy)}>📍 {a.location}</span>
                  </div>
                  <h3 style={{ color:T.navy, fontFamily:"Georgia,serif", fontSize:17, marginBottom:10 }}>{a.title}</h3>
                  <p style={{ color:T.muted, fontSize:13, lineHeight:1.75 }}>{a.description}</p>
                </div>
              ))}
            </div>
        }
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
//  BLOG
// ═══════════════════════════════════════════════════════
function BlogCard({ post }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div style={{ ...s.card, cursor:"pointer", transition:"transform .18s, box-shadow .18s" }}
        onClick={() => setOpen(true)}
        onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 10px 28px rgba(13,43,78,.15)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=s.card.boxShadow; }}>
        <div style={{ fontSize:48, textAlign:"center", marginBottom:14 }}>{post.image}</div>
        <div style={{ display:"flex", gap:8, marginBottom:12 }}>
          <span style={s.tag(T.green)}>{post.category}</span>
          <span style={s.tag(T.navy)}>{post.date}</span>
        </div>
        <h3 style={{ color:T.navy, fontFamily:"Georgia,serif", fontSize:16, marginBottom:10, lineHeight:1.4 }}>{post.title}</h3>
        <p style={{ color:T.muted, fontSize:13, lineHeight:1.65 }}>{post.content.slice(0,140)}…</p>
        <div style={{ color:T.green, fontSize:13, fontWeight:700, marginTop:12 }}>Read more →</div>
      </div>
      {open && (
        <Modal title={post.title} onClose={() => setOpen(false)}>
          <div style={{ display:"flex", gap:8, marginBottom:16 }}>
            <span style={s.tag(T.green)}>{post.category}</span>
            <span style={s.tag(T.navy)}>{post.date}</span>
            <span style={{ color:T.muted, fontSize:12, padding:"3px 0" }}>By {post.author}</span>
          </div>
          <div style={{ fontSize:52, textAlign:"center", marginBottom:20 }}>{post.image}</div>
          <p style={{ color:T.text, lineHeight:1.85, fontSize:15 }}>{post.content}</p>
        </Modal>
      )}
    </>
  );
}

function BlogPage({ blog }) {
  const [cat, setCat] = useState("All");
  const cats = ["All", ...new Set(blog.filter(b=>b.published).map(b=>b.category))];
  const filtered = blog.filter(b => b.published && (cat==="All" || b.category===cat));
  return (
    <section style={{ paddingTop:80, minHeight:"100vh" }}>
      <div style={{ background:`linear-gradient(135deg,${T.navyD},${T.navyL})`, padding:"60px 24px 50px", textAlign:"center" }}>
        <h1 style={{ color:T.white, fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", marginBottom:12 }}>News & Blog</h1>
        <p style={{ color:"rgba(176,196,222,.8)", maxWidth:500, margin:"0 auto" }}>Updates, articles and success stories from FGI.</p>
      </div>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"48px 24px" }}>
        <div style={{ display:"flex", gap:10, marginBottom:36, flexWrap:"wrap" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ ...s.btn(cat===c ? T.navy : "transparent", cat===c ? T.white : T.navy, cat!==c),
                padding:"7px 18px", fontSize:13 }}>
              {c}
            </button>
          ))}
        </div>
        {filtered.length === 0
          ? <div style={{ textAlign:"center", padding:60, color:T.muted }}>No posts in this category yet.</div>
          : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))", gap:22 }}>
              {filtered.map(p => <BlogCard key={p.id} post={p} />)}
            </div>
        }
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
//  DONATE
// ═══════════════════════════════════════════════════════
function DonatePage({ bankInfo, saveDonation, setToast }) {
  const [amount, setAmount] = useState(5000);
  const [custom, setCustom] = useState("");
  const [program, setProgram] = useState("General Fund");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  const presets = [1000,2500,5000,10000,25000,50000];
  const programs = ["General Fund","Education & Scholarships","Food Aid","Orphan Care","Health Programs","Youth Empowerment"];

  const handleDonate = () => {
    if (!name || !phone) { setToast("Please enter your name and phone number."); return; }
    saveDonation({ id:Date.now(), name, phone, amount:custom||amount, program, date:new Date().toLocaleDateString(), method:"Bank Transfer" });
    setDone(true);
  };

  const fmt = (n) => `₦${Number(n).toLocaleString()}`;

  return (
    <section style={{ paddingTop:80, minHeight:"100vh" }}>
      <div style={{ background:`linear-gradient(135deg,${T.navyD},${T.navyL})`, padding:"60px 24px 50px", textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:12 }}>❤️</div>
        <h1 style={{ color:T.white, fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", marginBottom:12 }}>Support FGI</h1>
        <p style={{ color:"rgba(176,196,222,.8)", maxWidth:520, margin:"0 auto", lineHeight:1.75 }}>
          Every Naira you give funds education, feeds families, and shapes futures. Your sadaqah keeps giving.
        </p>
      </div>

      <div style={{ maxWidth:1000, margin:"0 auto", padding:"56px 24px",
        display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:36, alignItems:"start" }}>

        {/* Bank details */}
        <div>
          <div style={{ ...s.card, marginBottom:20, border:`2px solid ${T.gold}` }}>
            <h3 style={{ color:T.navy, fontFamily:"Georgia,serif", fontSize:18, marginBottom:20 }}>🏦 Bank Transfer Details</h3>
            {[
              { l:"Bank Name", v:bankInfo.bankName },
              { l:"Account Name", v:bankInfo.accountName },
              { l:"Account Number", v:bankInfo.accountNumber },
            ].map(d => (
              <div key={d.l} style={{ padding:"12px 0", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between" }}>
                <span style={{ color:T.muted, fontSize:13 }}>{d.l}</span>
                <span style={{ color:T.navy, fontWeight:700, fontSize:14 }}>{d.v}</span>
              </div>
            ))}
            <p style={{ color:T.muted, fontSize:12, marginTop:14, lineHeight:1.6 }}>
              After transferring, send your receipt to our WhatsApp for confirmation and acknowledgement.
            </p>
          </div>

          <div style={{ ...s.card, background:T.green, border:"none" }}>
            <h4 style={{ color:T.white, fontFamily:"Georgia,serif", marginBottom:8 }}>💬 WhatsApp Donation</h4>
            <p style={{ color:"rgba(255,255,255,.8)", fontSize:13, marginBottom:16 }}>
              Prefer to coordinate via WhatsApp? Chat with our team directly.
            </p>
            <a href={`https://wa.me/234${bankInfo.whatsapp.replace(/^0/,"")}`} target="_blank" rel="noopener noreferrer"
              style={{ ...s.btn(T.white, T.green), textDecoration:"none", display:"inline-block" }}>
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Donation form */}
        {done ? (
          <div style={{ ...s.card, textAlign:"center", padding:48 }}>
            <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
            <h3 style={{ color:T.green, fontFamily:"Georgia,serif", fontSize:22, marginBottom:10 }}>JazakAllahu Khairan!</h3>
            <p style={{ color:T.muted, lineHeight:1.75 }}>
              Your intended donation of <strong>{fmt(custom||amount)}</strong> to <strong>{program}</strong> has been recorded.
              Please complete the bank transfer and send your receipt to our WhatsApp for confirmation.
            </p>
            <Btn onClick={() => { setDone(false); setName(""); setPhone(""); }} color={T.navy} style={{ marginTop:20 }}>Donate Again</Btn>
          </div>
        ) : (
          <div style={s.card}>
            <h3 style={{ color:T.navy, fontFamily:"Georgia,serif", marginBottom:20 }}>Make a Donation</h3>

            <Input label="Your Name" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" required />
            <Input label="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="08XXXXXXXXX" required />

            <div style={{ marginBottom:16 }}>
              <label style={s.label}>Donate Towards</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {programs.map(p => (
                  <button key={p} onClick={() => setProgram(p)}
                    style={{ border:`2px solid ${program===p?T.navy:T.border}`,
                      background:program===p?T.navy:"transparent",
                      color:program===p?T.white:T.muted, borderRadius:50,
                      padding:"5px 13px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={s.label}>Choose Amount (₦)</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:12 }}>
                {presets.map(p => (
                  <button key={p} onClick={() => { setAmount(p); setCustom(""); }}
                    style={{ border:`2px solid ${amount===p&&!custom?T.gold:T.border}`,
                      background:amount===p&&!custom?`${T.gold}18`:"transparent",
                      color:T.navy, borderRadius:12, padding:"12px 4px", fontSize:15,
                      fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                    {fmt(p)}
                  </button>
                ))}
              </div>
              <input type="number" placeholder="Enter custom amount (₦)" value={custom}
                onChange={e => { setCustom(e.target.value); setAmount(0); }}
                style={{ ...s.input, border:`2px solid ${custom?T.gold:T.border}` }} />
            </div>

            <div style={{ background:`${T.gold}12`, border:`1px solid ${T.gold}35`,
              borderRadius:12, padding:"12px 16px", marginBottom:20 }}>
              <p style={{ color:T.navy, fontSize:13, margin:0 }}>
                💡 <strong>{fmt(custom||amount)}</strong> can{" "}
                {(custom||amount)>=50000?"sponsor a student's full year tuition":
                  (custom||amount)>=10000?"fund food packages for 5 families":
                  (custom||amount)>=5000?"provide school supplies for 3 students":
                  "support one family's health consultation"}.
              </p>
            </div>

            <Btn onClick={handleDonate} color={T.gold} fg={T.navyD} style={{ width:"100%", padding:"14px", fontSize:16 }}>
              Confirm Donation of {fmt(custom||amount)} →
            </Btn>
            <p style={{ color:T.muted, fontSize:11, textAlign:"center", marginTop:10 }}>
              🔒 Transparent & accountable. Zakat-eligible programs marked separately.
            </p>
          </div>
        )}
      </div>
      <style>{`@media(max-width:700px){.fgi-donate-grid{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
//  VOLUNTEER
// ═══════════════════════════════════════════════════════
function VolunteerPage({ saveVolunteer, setToast }) {
  const [form, setForm] = useState({ name:"",phone:"",email:"",location:"",skills:"",interest:"",availability:"" });
  const [done, setDone] = useState(false);

  const areas = ["Education & Tutoring","Healthcare Outreach","Food Distribution","Orphan Care","Prison Visits","IT & Web","Fundraising","Media & Design","Admin Support"];

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.email) { setToast("Please fill in all required fields."); return; }
    saveVolunteer({ id:Date.now(), ...form, date:new Date().toLocaleDateString() });
    setDone(true);
  };

  return (
    <section style={{ paddingTop:80, minHeight:"100vh" }}>
      <div style={{ background:`linear-gradient(135deg,${T.green},#0a3d1f)`, padding:"60px 24px 50px", textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:12 }}>🤝</div>
        <h1 style={{ color:T.white, fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", marginBottom:12 }}>Become a Volunteer</h1>
        <p style={{ color:"rgba(255,255,255,.78)", maxWidth:500, margin:"0 auto" }}>
          Give your time, share your skills, transform lives. Every hour of service is a sadaqah jariyah.
        </p>
      </div>
      <div style={{ maxWidth:680, margin:"0 auto", padding:"56px 24px" }}>
        {done ? (
          <div style={{ ...s.card, textAlign:"center", padding:60 }}>
            <div style={{ fontSize:64, marginBottom:16 }}>🌟</div>
            <h3 style={{ color:T.green, fontFamily:"Georgia,serif", fontSize:24, marginBottom:12 }}>Application Received!</h3>
            <p style={{ color:T.muted, lineHeight:1.8 }}>
              JazakAllahu Khairan, <strong>{form.name}</strong>! Your volunteer application has been submitted.
              Our team will reach out within 3–5 working days, in sha Allah.
            </p>
            <Btn onClick={() => { setDone(false); setForm({ name:"",phone:"",email:"",location:"",skills:"",interest:"",availability:"" }); }}
              color={T.green} style={{ marginTop:24 }}>Apply Again</Btn>
          </div>
        ) : (
          <div style={s.card}>
            <h3 style={{ color:T.navy, fontFamily:"Georgia,serif", marginBottom:24 }}>Volunteer Application Form</h3>
            <Input label="Full Name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Your full name" required />
            <Input label="Phone / WhatsApp" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="08XXXXXXXXX" required />
            <Input label="Email Address" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} type="email" placeholder="your@email.com" required />
            <Input label="Location (State / City)" value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} placeholder="e.g. Kano, Nigeria" />
            <Input label="Skills & Experience" value={form.skills} onChange={e=>setForm(p=>({...p,skills:e.target.value}))} placeholder="e.g. teaching, coding, nursing…" textarea />

            <div style={{ marginBottom:16 }}>
              <label style={s.label}>Area of Interest</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {areas.map(a => (
                  <button key={a} onClick={() => setForm(p=>({...p,interest:a}))}
                    style={{ border:`2px solid ${form.interest===a?T.green:T.border}`,
                      background:form.interest===a?`${T.green}15`:"transparent",
                      color:form.interest===a?T.green:T.muted, borderRadius:50,
                      padding:"6px 14px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <Input label="Availability" value={form.availability} onChange={e=>setForm(p=>({...p,availability:e.target.value}))} select>
              <option value="">Select availability</option>
              <option>Weekdays only</option>
              <option>Weekends only</option>
              <option>Both weekdays & weekends</option>
              <option>Flexible / as needed</option>
            </Input>

            <Btn onClick={handleSubmit} color={T.green} style={{ width:"100%", padding:"14px", fontSize:15, marginTop:8 }}>
              Submit Application →
            </Btn>
          </div>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
//  CONTACT
// ═══════════════════════════════════════════════════════
function ContactPage({ saveMessage, setToast }) {
  const [form, setForm] = useState({ name:"",email:"",phone:"",subject:"",message:"" });
  const [sent, setSent] = useState(false);

  const handle = () => {
    if (!form.name || !form.email || !form.message) { setToast("Please fill required fields."); return; }
    saveMessage({ id:Date.now(), ...form, date:new Date().toLocaleDateString(), read:false });
    setSent(true);
  };

  return (
    <section style={{ paddingTop:80, minHeight:"100vh" }}>
      <div style={{ background:`linear-gradient(135deg,${T.navyD},${T.navyL})`, padding:"60px 24px 50px", textAlign:"center" }}>
        <h1 style={{ color:T.white, fontFamily:"Georgia,serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", marginBottom:12 }}>Contact Us</h1>
        <p style={{ color:"rgba(176,196,222,.8)", maxWidth:500, margin:"0 auto" }}>We're here to listen, guide and support you.</p>
      </div>
      <div style={{ maxWidth:1060, margin:"0 auto", padding:"56px 24px",
        display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:40, alignItems:"start" }}>

        <div>
          <h3 style={{ color:T.navy, fontFamily:"Georgia,serif", fontSize:20, marginBottom:24 }}>Get in Touch</h3>
          {[
            { icon:"📧", l:"Email", v:"info@futureguidanceinitiative.org" },
            { icon:"📞", l:"Phone", v:"08163019775" },
            { icon:"💬", l:"WhatsApp", v:"08163019775" },
            { icon:"📍", l:"Location", v:"Nigeria (Nationwide)" },
            { icon:"🕐", l:"Hours", v:"Mon–Fri: 8am–6pm" },
          ].map(c => (
            <div key={c.l} style={{ display:"flex", gap:14, marginBottom:18 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${T.navy}12`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{c.icon}</div>
              <div>
                <div style={{ color:T.navy, fontWeight:700, fontSize:13 }}>{c.l}</div>
                <div style={{ color:T.muted, fontSize:13, marginTop:2 }}>{c.v}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop:28 }}>
            <h4 style={{ color:T.navy, marginBottom:14 }}>Follow FGI</h4>
            <div style={{ display:"flex", gap:10 }}>
              {["𝕏","f","in","▶","📸"].map(icon => (
                <button key={icon} style={{ width:38, height:38, borderRadius:10, background:T.navy,
                  color:T.white, border:"none", fontSize:14, cursor:"pointer", fontWeight:700 }}>{icon}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={s.card}>
          {sent ? (
            <div style={{ textAlign:"center", padding:"40px 20px" }}>
              <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
              <h3 style={{ color:T.success, fontFamily:"Georgia,serif" }}>Message Sent!</h3>
              <p style={{ color:T.muted, marginTop:10 }}>We'll respond within 24–48 hours, in sha Allah.</p>
              <Btn onClick={() => { setSent(false); setForm({ name:"",email:"",phone:"",subject:"",message:"" }); }}
                color={T.navy} style={{ marginTop:20 }}>Send Another</Btn>
            </div>
          ) : (
            <>
              <h3 style={{ color:T.navy, fontFamily:"Georgia,serif", marginBottom:22 }}>Send a Message</h3>
              <Input label="Full Name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Your name" required />
              <Input label="Email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} type="email" placeholder="your@email.com" required />
              <Input label="Phone" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="08XXXXXXXXX" />
              <Input label="Subject" value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} placeholder="How can we help?" />
              <Input label="Message" value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} textarea placeholder="Tell us how we can help you…" required />
              <Btn onClick={handle} color={T.navy} style={{ width:"100%", padding:"13px", fontSize:15 }}>Send Message →</Btn>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
//  ADMIN LOGIN
// ═══════════════════════════════════════════════════════
function AdminLogin({ setIsAdmin, setPage, setToast }) {
  const [u, setU] = useState(""); const [p, setP] = useState("");
  const login = () => {
    if (u === "fgiadmin" && p === "FGI@2026") { setIsAdmin(true); setPage("Admin"); }
    else setToast("Invalid credentials. Try: fgiadmin / FGI@2026");
  };
  return (
    <section style={{ paddingTop:80, minHeight:"100vh", display:"flex", alignItems:"center",
      background:`linear-gradient(135deg,${T.navyD},${T.navyL})` }}>
      <div style={{ maxWidth:400, margin:"0 auto", padding:24, width:"100%" }}>
        <div style={{ ...s.card, textAlign:"center" }}>
          <Logo size={64} />
          <h2 style={{ color:T.navy, fontFamily:"Georgia,serif", margin:"20px 0 6px" }}>Admin Login</h2>
          <p style={{ color:T.muted, fontSize:13, marginBottom:28 }}>FGI Management Panel</p>
          <Input label="Username" value={u} onChange={e=>setU(e.target.value)} placeholder="fgiadmin" />
          <Input label="Password" value={p} onChange={e=>setP(e.target.value)} type="password" placeholder="••••••••" />
          <Btn onClick={login} color={T.navy} style={{ width:"100%", padding:"12px", fontSize:15 }}>Login to Admin Panel</Btn>
          <p style={{ color:T.muted, fontSize:11, marginTop:14 }}>Demo: fgiadmin / FGI@2026</p>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════
//  ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════
function AdminPanel({
  mentors, saveMentors,
  blog, saveBlog,
  events, saveEvents,
  activities, saveActivities,
  volunteers, messages,
  donations, bankInfo, saveBankInfo,
  setIsAdmin, setPage, setToast,
}) {
  const [tab, setTab] = useState("overview");

  const TABS = [
    { id:"overview",    icon:"📊", label:"Overview" },
    { id:"mentors",     icon:"👥", label:"Mentors" },
    { id:"blog",        icon:"📰", label:"Blog" },
    { id:"events",      icon:"📅", label:"Events" },
    { id:"activities",  icon:"🌿", label:"Activities" },
    { id:"volunteers",  icon:"🤝", label:"Volunteers" },
    { id:"messages",    icon:"💬", label:"Messages" },
    { id:"donations",   icon:"💰", label:"Donations" },
    { id:"bank",        icon:"🏦", label:"Bank Info" },
  ];

  return (
    <section style={{ paddingTop:64, minHeight:"100vh", background:T.offW }}>
      <div style={{ display:"flex", minHeight:"calc(100vh - 64px)" }}>
        {/* Sidebar */}
        <div style={{ width:220, background:T.navyD, padding:"24px 0", flexShrink:0 }}>
          <div style={{ padding:"0 20px 24px", borderBottom:"1px solid rgba(255,255,255,.08)" }}>
            <Logo size={40} />
            <div style={{ color:T.gold, fontWeight:700, fontSize:13, marginTop:10 }}>FGI Admin Panel</div>
          </div>
          <div style={{ padding:"16px 0" }}>
            {TABS.map(t => (
              <div key={t.id} onClick={() => setTab(t.id)}
                style={{ padding:"11px 20px", cursor:"pointer", display:"flex", alignItems:"center", gap:10,
                  background: tab===t.id ? "rgba(232,160,0,.15)" : "transparent",
                  borderLeft: tab===t.id ? `3px solid ${T.gold}` : "3px solid transparent",
                  color: tab===t.id ? T.gold : "rgba(176,196,222,.8)", fontSize:13,
                  transition:"all .15s" }}>
                <span>{t.icon}</span> {t.label}
                {t.id==="messages" && messages.filter(m=>!m.read).length > 0 && (
                  <span style={{ background:T.danger, color:T.white, borderRadius:50, padding:"1px 6px", fontSize:10, marginLeft:"auto" }}>
                    {messages.filter(m=>!m.read).length}
                  </span>
                )}
                {t.id==="volunteers" && volunteers.length > 0 && (
                  <span style={{ background:T.green, color:T.white, borderRadius:50, padding:"1px 6px", fontSize:10, marginLeft:"auto" }}>
                    {volunteers.length}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div style={{ padding:"16px 20px", borderTop:"1px solid rgba(255,255,255,.08)" }}>
            <Btn onClick={() => { setIsAdmin(false); setPage("Home"); }} color={T.danger}
              style={{ width:"100%", fontSize:12, padding:"8px" }}>Logout</Btn>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex:1, padding:"32px 28px", overflowY:"auto" }}>
          {tab==="overview" && <AdminOverview mentors={mentors} blog={blog} events={events} activities={activities} volunteers={volunteers} messages={messages} donations={donations} />}
          {tab==="mentors" && <AdminMentors mentors={mentors} saveMentors={saveMentors} setToast={setToast} />}
          {tab==="blog" && <AdminBlog blog={blog} saveBlog={saveBlog} setToast={setToast} />}
          {tab==="events" && <AdminEvents events={events} saveEvents={saveEvents} setToast={setToast} />}
          {tab==="activities" && <AdminActivities activities={activities} saveActivities={saveActivities} setToast={setToast} />}
          {tab==="volunteers" && <AdminVolunteers volunteers={volunteers} />}
          {tab==="messages" && <AdminMessages messages={messages} />}
          {tab==="donations" && <AdminDonations donations={donations} />}
          {tab==="bank" && <AdminBank bankInfo={bankInfo} saveBankInfo={saveBankInfo} setToast={setToast} />}
        </div>
      </div>
    </section>
  );
}

function AdminOverview({ mentors, blog, events, activities, volunteers, messages, donations }) {
  const totalDonated = donations.reduce((s,d) => s + Number(d.amount||0), 0);
  const cards = [
    { icon:"👥", label:"Mentors", val:mentors.filter(m=>m.active).length, color:T.navy },
    { icon:"📰", label:"Blog Posts", val:blog.filter(b=>b.published).length, color:T.green },
    { icon:"📅", label:"Events", val:events.length, color:T.gold },
    { icon:"🤝", label:"Volunteers", val:volunteers.length, color:"#7C3AED" },
    { icon:"💬", label:"Messages", val:messages.length, color:T.navyL },
    { icon:"💰", label:"Donations ₦", val:totalDonated.toLocaleString(), color:T.success },
  ];
  return (
    <div>
      <h2 style={{ color:T.navy, fontFamily:"Georgia,serif", marginBottom:24 }}>Dashboard Overview</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16, marginBottom:32 }}>
        {cards.map(c => (
          <div key={c.label} style={{ ...s.card, borderLeft:`4px solid ${c.color}`, padding:"20px 18px" }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{c.icon}</div>
            <div style={{ color:c.color, fontSize:"1.6rem", fontWeight:900, fontFamily:"Georgia,serif" }}>{c.val}</div>
            <div style={{ color:T.muted, fontSize:12 }}>{c.label}</div>
          </div>
        ))}
      </div>
      <div style={{ ...s.card }}>
        <h3 style={{ color:T.navy, fontFamily:"Georgia,serif", marginBottom:16 }}>Recent Activity</h3>
        {[
          ...messages.slice(-3).map(m => ({ t:`📩 New message from ${m.name}`, d:m.date })),
          ...volunteers.slice(-3).map(v => ({ t:`🤝 Volunteer: ${v.name}`, d:v.date })),
          ...donations.slice(-3).map(d => ({ t:`💰 Donation ₦${Number(d.amount).toLocaleString()} by ${d.name}`, d:d.date })),
        ].slice(0,8).map((a,i) => (
          <div key={i} style={{ padding:"10px 0", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", fontSize:13 }}>
            <span style={{ color:T.text }}>{a.t}</span>
            <span style={{ color:T.muted }}>{a.d}</span>
          </div>
        ))}
        {messages.length===0 && volunteers.length===0 && donations.length===0 && (
          <p style={{ color:T.muted, textAlign:"center", padding:20 }}>No recent activity yet.</p>
        )}
      </div>
    </div>
  );
}

// ── Admin Mentors ─────────────────────────────────────
function AdminMentors({ mentors, saveMentors, setToast }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = { name:"", role:"Mentor", avatar:"👤", expertise:[], bio:"", phone:"", whatsapp:"", active:true };
  const [form, setForm] = useState(blank);
  const expertInput = useRef("");

  const openAdd = () => { setForm(blank); setAdding(true); setEditing(null); };
  const openEdit = (m) => { setForm({...m}); setEditing(m.id); setAdding(true); };
  const del = (id) => { saveMentors(mentors.filter(m=>m.id!==id)); setToast("Mentor deleted."); };
  const toggle = (id) => saveMentors(mentors.map(m => m.id===id ? {...m,active:!m.active} : m));

  const save = () => {
    if (!form.name || !form.phone) { setToast("Name and phone are required."); return; }
    if (editing) {
      saveMentors(mentors.map(m => m.id===editing ? {...form,id:editing} : m));
      setToast("Mentor updated!");
    } else {
      saveMentors([...mentors, { ...form, id:Date.now() }]);
      setToast("Mentor added!");
    }
    setAdding(false); setEditing(null);
  };

  const addExpertise = (val) => {
    if (val && !form.expertise.includes(val)) setForm(p => ({...p, expertise:[...p.expertise,val]}));
  };
  const remExpertise = (val) => setForm(p => ({...p, expertise:p.expertise.filter(e=>e!==val)}));

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h2 style={{ color:T.navy, fontFamily:"Georgia,serif", margin:0 }}>Mentor Management</h2>
        <Btn onClick={openAdd} color={T.green}>+ Add Mentor</Btn>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
        {mentors.map(m => (
          <div key={m.id} style={{ ...s.card, opacity:m.active?1:.6 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:32 }}>{m.avatar}</span>
              <span style={s.tag(m.active?T.success:T.muted)}>{m.active?"Active":"Inactive"}</span>
            </div>
            <div style={{ color:T.navy, fontWeight:700, fontSize:15, marginBottom:4 }}>{m.name}</div>
            <div style={{ color:T.muted, fontSize:12, marginBottom:10 }}>{m.phone}</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:14 }}>
              {m.expertise.slice(0,3).map(e => <span key={e} style={s.tag(T.navy)}>{e}</span>)}
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              <Btn onClick={() => openEdit(m)} color={T.navy} style={{ fontSize:12, padding:"6px 14px" }}>Edit</Btn>
              <Btn onClick={() => toggle(m.id)} color={m.active?T.muted:T.green} style={{ fontSize:12, padding:"6px 14px" }}>
                {m.active?"Deactivate":"Activate"}
              </Btn>
              <Btn onClick={() => del(m.id)} color={T.danger} style={{ fontSize:12, padding:"6px 14px" }}>Delete</Btn>
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <Modal title={editing ? "Edit Mentor" : "Add New Mentor"} onClose={() => setAdding(false)}>
          <Input label="Full Name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Mentor name" required />
          <Input label="Role" value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))} placeholder="e.g. Mentor" />
          <Input label="Avatar Emoji" value={form.avatar} onChange={e=>setForm(p=>({...p,avatar:e.target.value}))} placeholder="👤" />
          <Input label="Phone" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="08XXXXXXXXX" required />
          <Input label="WhatsApp" value={form.whatsapp} onChange={e=>setForm(p=>({...p,whatsapp:e.target.value}))} placeholder="08XXXXXXXXX" />
          <Input label="Biography" value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} textarea placeholder="Short bio…" />
          <div style={{ marginBottom:16 }}>
            <label style={s.label}>Expertise Areas</label>
            <div style={{ display:"flex", gap:8, marginBottom:8 }}>
              <input ref={expertInput} placeholder="Add expertise" style={{ ...s.input, flex:1 }} />
              <Btn onClick={() => { addExpertise(expertInput.current.value); expertInput.current.value=""; }} color={T.green} style={{ padding:"8px 16px", fontSize:13 }}>Add</Btn>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {form.expertise.map(e => (
                <span key={e} style={{ ...s.tag(T.navy), cursor:"pointer" }} onClick={() => remExpertise(e)}>{e} ✕</span>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn onClick={save} color={T.green} style={{ flex:1 }}>Save Mentor</Btn>
            <Btn onClick={() => setAdding(false)} color={T.muted} style={{ flex:1 }}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Admin Blog ────────────────────────────────────────
function AdminBlog({ blog, saveBlog, setToast }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = { title:"", category:"News", content:"", author:"FGI Admin", date:new Date().toISOString().slice(0,10), image:"📰", published:false };
  const [form, setForm] = useState(blank);

  const cats = ["News","Events","Activities","Success Stories","Health","Education"];

  const del = (id) => { saveBlog(blog.filter(b=>b.id!==id)); setToast("Post deleted."); };
  const togglePub = (id) => saveBlog(blog.map(b => b.id===id ? {...b,published:!b.published} : b));
  const openEdit = (p) => { setForm({...p}); setEditing(p.id); setAdding(true); };

  const save = () => {
    if (!form.title || !form.content) { setToast("Title and content required."); return; }
    if (editing) {
      saveBlog(blog.map(b => b.id===editing ? {...form,id:editing} : b));
      setToast("Post updated!");
    } else {
      saveBlog([...blog, { ...form, id:Date.now() }]);
      setToast("Post created!");
    }
    setAdding(false); setEditing(null);
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h2 style={{ color:T.navy, fontFamily:"Georgia,serif", margin:0 }}>Blog Management</h2>
        <Btn onClick={() => { setForm(blank); setEditing(null); setAdding(true); }} color={T.green}>+ New Post</Btn>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {blog.map(p => (
          <div key={p.id} style={{ ...s.card, display:"flex", justifyContent:"space-between", alignItems:"center", gap:16 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", gap:8, marginBottom:6 }}>
                <span style={s.tag(T.green)}>{p.category}</span>
                <span style={s.tag(p.published?T.success:T.muted)}>{p.published?"Published":"Draft"}</span>
                <span style={{ color:T.muted, fontSize:12 }}>{p.date}</span>
              </div>
              <div style={{ color:T.navy, fontWeight:700, fontSize:14, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.title}</div>
            </div>
            <div style={{ display:"flex", gap:8, flexShrink:0 }}>
              <Btn onClick={() => openEdit(p)} color={T.navy} style={{ fontSize:12, padding:"6px 12px" }}>Edit</Btn>
              <Btn onClick={() => togglePub(p.id)} color={p.published?T.muted:T.success} style={{ fontSize:12, padding:"6px 12px" }}>
                {p.published?"Unpublish":"Publish"}
              </Btn>
              <Btn onClick={() => del(p.id)} color={T.danger} style={{ fontSize:12, padding:"6px 12px" }}>Del</Btn>
            </div>
          </div>
        ))}
        {blog.length===0 && <div style={{ textAlign:"center", padding:40, color:T.muted }}>No posts yet. Create your first post!</div>}
      </div>

      {adding && (
        <Modal title={editing ? "Edit Post" : "New Blog Post"} onClose={() => setAdding(false)}>
          <Input label="Title" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Post title…" required />
          <Input label="Category" value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} select>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </Input>
          <Input label="Author" value={form.author} onChange={e=>setForm(p=>({...p,author:e.target.value}))} placeholder="Author name" />
          <Input label="Date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} type="date" />
          <Input label="Image Emoji" value={form.image} onChange={e=>setForm(p=>({...p,image:e.target.value}))} placeholder="📰" />
          <Input label="Content" value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))} textarea placeholder="Write your post content…" />
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <input type="checkbox" id="pub" checked={form.published} onChange={e=>setForm(p=>({...p,published:e.target.checked}))} />
            <label htmlFor="pub" style={{ color:T.navy, fontSize:14, cursor:"pointer" }}>Publish immediately</label>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn onClick={save} color={T.green} style={{ flex:1 }}>Save Post</Btn>
            <Btn onClick={() => setAdding(false)} color={T.muted} style={{ flex:1 }}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Admin Events ──────────────────────────────────────
function AdminEvents({ events, saveEvents, setToast }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = { title:"", description:"", date:"", location:"", image:"🎯", registrations:[] };
  const [form, setForm] = useState(blank);

  const del = (id) => { saveEvents(events.filter(e=>e.id!==id)); setToast("Event deleted."); };
  const openEdit = (ev) => { setForm({...ev}); setEditing(ev.id); setAdding(true); };
  const save = () => {
    if (!form.title || !form.date) { setToast("Title and date required."); return; }
    if (editing) {
      saveEvents(events.map(e => e.id===editing ? {...form,id:editing} : e));
      setToast("Event updated!");
    } else {
      saveEvents([...events, { ...form, id:Date.now(), registrations:[] }]);
      setToast("Event created!");
    }
    setAdding(false); setEditing(null);
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h2 style={{ color:T.navy, fontFamily:"Georgia,serif", margin:0 }}>Event Management</h2>
        <Btn onClick={() => { setForm(blank); setEditing(null); setAdding(true); }} color={T.green}>+ New Event</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
        {events.map(ev => (
          <div key={ev.id} style={s.card}>
            <div style={{ fontSize:40, marginBottom:12 }}>{ev.image}</div>
            <div style={{ color:T.navy, fontWeight:700, fontSize:15, marginBottom:6 }}>{ev.title}</div>
            <div style={{ color:T.muted, fontSize:12, marginBottom:10 }}>📅 {ev.date} · 📍 {ev.location}</div>
            <div style={{ color:T.muted, fontSize:12, marginBottom:14 }}>👥 {(ev.registrations||[]).length} registrations</div>
            <div style={{ display:"flex", gap:8 }}>
              <Btn onClick={() => openEdit(ev)} color={T.navy} style={{ fontSize:12, padding:"6px 12px" }}>Edit</Btn>
              <Btn onClick={() => del(ev.id)} color={T.danger} style={{ fontSize:12, padding:"6px 12px" }}>Delete</Btn>
            </div>
          </div>
        ))}
        {events.length===0 && <div style={{ color:T.muted, padding:40, textAlign:"center" }}>No events yet.</div>}
      </div>

      {adding && (
        <Modal title={editing ? "Edit Event" : "New Event"} onClose={() => setAdding(false)}>
          <Input label="Title" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Event title" required />
          <Input label="Date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} type="date" required />
          <Input label="Location" value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} placeholder="City, State" />
          <Input label="Image Emoji" value={form.image} onChange={e=>setForm(p=>({...p,image:e.target.value}))} placeholder="🎯" />
          <Input label="Description" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} textarea placeholder="Event details…" />
          <div style={{ display:"flex", gap:10 }}>
            <Btn onClick={save} color={T.green} style={{ flex:1 }}>Save Event</Btn>
            <Btn onClick={() => setAdding(false)} color={T.muted} style={{ flex:1 }}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Admin Activities ──────────────────────────────────
function AdminActivities({ activities, saveActivities, setToast }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = { title:"", description:"", date:"", location:"", image:"🌿" };
  const [form, setForm] = useState(blank);

  const del = (id) => { saveActivities(activities.filter(a=>a.id!==id)); setToast("Activity deleted."); };
  const openEdit = (a) => { setForm({...a}); setEditing(a.id); setAdding(true); };
  const save = () => {
    if (!form.title) { setToast("Title required."); return; }
    if (editing) {
      saveActivities(activities.map(a => a.id===editing ? {...form,id:editing} : a));
      setToast("Activity updated!");
    } else {
      saveActivities([...activities, { ...form, id:Date.now() }]);
      setToast("Activity added!");
    }
    setAdding(false); setEditing(null);
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h2 style={{ color:T.navy, fontFamily:"Georgia,serif", margin:0 }}>Activities Management</h2>
        <Btn onClick={() => { setForm(blank); setEditing(null); setAdding(true); }} color={T.green}>+ Add Activity</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
        {activities.map(a => (
          <div key={a.id} style={s.card}>
            <div style={{ fontSize:40, marginBottom:12 }}>{a.image}</div>
            <div style={{ color:T.navy, fontWeight:700, fontSize:15, marginBottom:6 }}>{a.title}</div>
            <div style={{ color:T.muted, fontSize:12, marginBottom:10 }}>📅 {a.date} · 📍 {a.location}</div>
            <div style={{ display:"flex", gap:8 }}>
              <Btn onClick={() => openEdit(a)} color={T.navy} style={{ fontSize:12, padding:"6px 12px" }}>Edit</Btn>
              <Btn onClick={() => del(a.id)} color={T.danger} style={{ fontSize:12, padding:"6px 12px" }}>Delete</Btn>
            </div>
          </div>
        ))}
        {activities.length===0 && <div style={{ color:T.muted, padding:40, textAlign:"center" }}>No activities yet.</div>}
      </div>
      {adding && (
        <Modal title={editing ? "Edit Activity" : "Add Activity"} onClose={() => setAdding(false)}>
          <Input label="Title" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Activity title" required />
          <Input label="Date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} type="date" />
          <Input label="Location" value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} placeholder="City, State" />
          <Input label="Image Emoji" value={form.image} onChange={e=>setForm(p=>({...p,image:e.target.value}))} placeholder="🌿" />
          <Input label="Description" value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} textarea placeholder="What happened, how many were reached…" />
          <div style={{ display:"flex", gap:10 }}>
            <Btn onClick={save} color={T.green} style={{ flex:1 }}>Save</Btn>
            <Btn onClick={() => setAdding(false)} color={T.muted} style={{ flex:1 }}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Admin Volunteers ──────────────────────────────────
function AdminVolunteers({ volunteers }) {
  return (
    <div>
      <h2 style={{ color:T.navy, fontFamily:"Georgia,serif", marginBottom:24 }}>Volunteer Applications ({volunteers.length})</h2>
      {volunteers.length===0
        ? <div style={{ textAlign:"center", padding:60, color:T.muted }}>No volunteer applications yet.</div>
        : <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {volunteers.map(v => (
              <div key={v.id} style={{ ...s.card }}>
                <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:12 }}>
                  <div>
                    <div style={{ color:T.navy, fontWeight:700, fontSize:16 }}>{v.name}</div>
                    <div style={{ color:T.muted, fontSize:12, marginTop:2 }}>Applied: {v.date}</div>
                  </div>
                  <span style={s.tag(T.green)}>{v.interest || "General"}</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12, fontSize:13 }}>
                  <div><span style={{ color:T.muted }}>📞 </span><span style={{ color:T.text }}>{v.phone}</span></div>
                  <div><span style={{ color:T.muted }}>📧 </span><span style={{ color:T.text }}>{v.email}</span></div>
                  <div><span style={{ color:T.muted }}>📍 </span><span style={{ color:T.text }}>{v.location}</span></div>
                  <div><span style={{ color:T.muted }}>🕐 </span><span style={{ color:T.text }}>{v.availability}</span></div>
                </div>
                {v.skills && <div style={{ color:T.muted, fontSize:12, marginTop:10 }}>Skills: {v.skills}</div>}
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// ── Admin Messages ────────────────────────────────────
function AdminMessages({ messages }) {
  return (
    <div>
      <h2 style={{ color:T.navy, fontFamily:"Georgia,serif", marginBottom:24 }}>Messages ({messages.length})</h2>
      {messages.length===0
        ? <div style={{ textAlign:"center", padding:60, color:T.muted }}>No messages yet.</div>
        : <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {[...messages].reverse().map(m => (
              <div key={m.id} style={{ ...s.card, borderLeft:`4px solid ${T.navy}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:10 }}>
                  <div>
                    <span style={{ color:T.navy, fontWeight:700 }}>{m.name}</span>
                    <span style={{ color:T.muted, fontSize:12, marginLeft:12 }}>{m.email}</span>
                    {m.phone && <span style={{ color:T.muted, fontSize:12, marginLeft:10 }}>· {m.phone}</span>}
                  </div>
                  <span style={{ color:T.muted, fontSize:12 }}>{m.date}</span>
                </div>
                {m.subject && <div style={{ color:T.navy, fontWeight:600, fontSize:13, marginBottom:8 }}>Re: {m.subject}</div>}
                <div style={{ color:T.text, fontSize:13, lineHeight:1.75 }}>{m.message}</div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// ── Admin Donations ───────────────────────────────────
function AdminDonations({ donations }) {
  const total = donations.reduce((s,d) => s + Number(d.amount||0), 0);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h2 style={{ color:T.navy, fontFamily:"Georgia,serif", margin:0 }}>Donations</h2>
        <div style={{ ...s.card, padding:"12px 20px", borderLeft:`4px solid ${T.gold}` }}>
          <div style={{ color:T.muted, fontSize:12 }}>Total Recorded</div>
          <div style={{ color:T.navy, fontWeight:900, fontSize:20 }}>₦{total.toLocaleString()}</div>
        </div>
      </div>
      {donations.length===0
        ? <div style={{ textAlign:"center", padding:60, color:T.muted }}>No donations recorded yet.</div>
        : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[...donations].reverse().map(d => (
              <div key={d.id} style={{ ...s.card, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ color:T.navy, fontWeight:700 }}>{d.name}</div>
                  <div style={{ color:T.muted, fontSize:12 }}>{d.phone} · {d.date} · {d.method}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ color:T.success, fontWeight:900, fontSize:17 }}>₦{Number(d.amount).toLocaleString()}</div>
                  <span style={s.tag(T.green)}>{d.program}</span>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// ── Admin Bank ────────────────────────────────────────
function AdminBank({ bankInfo, saveBankInfo, setToast }) {
  const [form, setForm] = useState({...bankInfo});
  const save = () => { saveBankInfo(form); setToast("Bank information updated!"); };
  return (
    <div>
      <h2 style={{ color:T.navy, fontFamily:"Georgia,serif", marginBottom:24 }}>Bank Information</h2>
      <div style={{ maxWidth:500 }}>
        <div style={s.card}>
          <Input label="Bank Name" value={form.bankName} onChange={e=>setForm(p=>({...p,bankName:e.target.value}))} placeholder="First Bank of Nigeria" />
          <Input label="Account Name" value={form.accountName} onChange={e=>setForm(p=>({...p,accountName:e.target.value}))} placeholder="Future Guidance Initiative" />
          <Input label="Account Number" value={form.accountNumber} onChange={e=>setForm(p=>({...p,accountNumber:e.target.value}))} placeholder="3012345678" />
          <Input label="WhatsApp Number" value={form.whatsapp} onChange={e=>setForm(p=>({...p,whatsapp:e.target.value}))} placeholder="08XXXXXXXXX" />
          <Btn onClick={save} color={T.green} style={{ width:"100%", padding:"12px" }}>Update Bank Details</Btn>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  FOOTER & SHARED
// ═══════════════════════════════════════════════════════
function NewsletterBar() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section style={{ background:`linear-gradient(90deg,${T.green},${T.greenL})`, padding:"48px 24px", textAlign:"center" }}>
      <h3 style={{ color:T.white, fontFamily:"Georgia,serif", fontSize:22, marginBottom:8 }}>Stay Connected with FGI</h3>
      <p style={{ color:"rgba(255,255,255,.8)", marginBottom:24, fontSize:14 }}>Get updates on programs, events and success stories.</p>
      {done ? (
        <p style={{ color:T.white, fontWeight:700 }}>✅ Subscribed! JazakAllahu Khairan.</p>
      ) : (
        <div style={{ display:"flex", maxWidth:460, margin:"0 auto", gap:10 }}>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email address"
            style={{ flex:1, border:"2px solid rgba(255,255,255,.4)", borderRadius:50,
              padding:"11px 20px", background:"rgba(255,255,255,.15)",
              color:T.white, fontSize:14, fontFamily:"inherit", outline:"none" }} />
          <Btn onClick={() => email && setDone(true)} color={T.white} fg={T.green}>Subscribe</Btn>
        </div>
      )}
    </section>
  );
}

function Footer({ setPage }) {
  const cols = [
    { title:"Programs", links:["Education","Health","Food Aid","Orphan Care","Career Dev","Prison Rehab"] },
    { title:"Get Involved", links:["Volunteer","Donate","Become a Mentor","Partner with FGI","Newsletter"] },
    { title:"Organization", links:["About Us","Our Mentors","Blog","Events","Activities","Contact"] },
  ];
  return (
    <footer style={{ background:T.navyD, color:"rgba(176,196,222,.75)", padding:"56px 24px 28px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.3fr repeat(3,1fr)", gap:40, marginBottom:48 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
              <Logo size={44} />
              <div>
                <div style={{ color:T.gold, fontWeight:900, fontFamily:"Georgia,serif", fontSize:18 }}>FGI</div>
                <div style={{ fontSize:9, color:"rgba(176,196,222,.5)", letterSpacing:1.5 }}>FUTURE GUIDANCE INITIATIVE</div>
              </div>
            </div>
            <p style={{ fontSize:13, lineHeight:1.75, marginBottom:16 }}>
              Mentorship · Education · Empowerment<br/>
              Building the future, one life at a time.
            </p>
            <div style={{ fontSize:13 }}>
              <div>📞 08163019775</div>
              <div style={{ marginTop:4 }}>📧 info@futureguidanceinitiative.org</div>
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <h4 style={{ color:T.white, fontWeight:700, marginBottom:16, fontSize:14 }}>{col.title}</h4>
              {col.links.map(l => (
                <div key={l} style={{ padding:"4px 0", fontSize:13, cursor:"pointer", transition:"color .15s" }}
                  onMouseEnter={e=>e.target.style.color=T.gold}
                  onMouseLeave={e=>e.target.style.color="rgba(176,196,222,.75)"}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,.07)", paddingTop:22,
          display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12, fontSize:12 }}>
          <span>© 2026 Future Guidance Initiative. All rights reserved.</span>
          <div style={{ display:"flex", gap:16 }}>
            <span style={{ cursor:"pointer" }}>Privacy Policy</span>
            <span style={{ cursor:"pointer" }}>Terms of Use</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function WAFloat() {
  return (
    <a href="https://wa.me/2348163019775" target="_blank" rel="noopener noreferrer"
      title="Chat with FGI on WhatsApp"
      style={{ position:"fixed", bottom:24, right:24, zIndex:990,
        width:54, height:54, borderRadius:"50%", background:"#25D366",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:26, textDecoration:"none", boxShadow:"0 4px 20px rgba(37,211,102,.5)",
        transition:"transform .2s" }}
      onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12)"}
      onMouseLeave={e=>e.currentTarget.style.transform="none"}>
      💬
    </a>
  );
}

// ═══════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("Home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToastMsg] = useState(null);

  const [mentors, saveMentors]       = useStore("fgi_mentors",    INIT_MENTORS);
  const [blog, saveBlog]             = useStore("fgi_blog",       INIT_BLOG);
  const [events, saveEvents]         = useStore("fgi_events",     INIT_EVENTS);
  const [activities, saveActivities] = useStore("fgi_activities", INIT_ACTIVITIES);
  const [volunteers, saveVolunteers] = useStore("fgi_volunteers", INIT_VOLUNTEERS);
  const [messages, setMessages]      = useStore("fgi_messages",   INIT_MESSAGES);
  const [donations, setDonations]    = useStore("fgi_donations",  INIT_DONATIONS);
  const [bankInfo, saveBankInfo]     = useStore("fgi_bank",       INIT_BANK);

  const saveMessage  = (m) => setMessages(prev => [...prev, m]);
  const saveVolunteer = (v) => saveVolunteers(prev => [...prev, v]);
  const saveDonation  = (d) => setDonations(prev => [...prev, d]);

  const setToast = (msg) => { setToastMsg(msg); };

  const changePage = (p) => { setPage(p); window.scrollTo(0,0); };

  const renderPage = () => {
    switch(page) {
      case "Home":       return <HomePage setPage={changePage} mentors={mentors} events={events} blog={blog} activities={activities} />;
      case "Programs":   return <ProgramsPage setPage={changePage} />;
      case "Mentors":    return <MentorsPage mentors={mentors} setPage={changePage} />;
      case "AI Mentor":  return <AIMentorPage />;
      case "Events":     return <EventsPage events={events} setPage={changePage} />;
      case "Activities": return <ActivitiesPage activities={activities} />;
      case "Blog":       return <BlogPage blog={blog} />;
      case "Donate":     return <DonatePage bankInfo={bankInfo} saveDonation={saveDonation} setToast={setToast} />;
      case "Volunteer":  return <VolunteerPage saveVolunteer={saveVolunteer} setToast={setToast} />;
      case "Contact":    return <ContactPage saveMessage={saveMessage} setToast={setToast} />;
      case "AdminLogin": return <AdminLogin setIsAdmin={setIsAdmin} setPage={changePage} setToast={setToast} />;
      case "Admin":      return isAdmin
        ? <AdminPanel
            mentors={mentors} saveMentors={saveMentors}
            blog={blog} saveBlog={saveBlog}
            events={events} saveEvents={saveEvents}
            activities={activities} saveActivities={saveActivities}
            volunteers={volunteers} messages={messages}
            donations={donations}
            bankInfo={bankInfo} saveBankInfo={saveBankInfo}
            setIsAdmin={setIsAdmin} setPage={changePage} setToast={setToast}
          />
        : <AdminLogin setIsAdmin={setIsAdmin} setPage={changePage} setToast={setToast} />;
      default:           return <HomePage setPage={changePage} mentors={mentors} events={events} blog={blog} activities={activities} />;
    }
  };

  const showFooter = !["Admin","AdminLogin"].includes(page);

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif", minHeight:"100vh", color:T.text }}>
      <Navbar page={page} setPage={changePage} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <main>{renderPage()}</main>
      {showFooter && <Footer setPage={changePage} />}
      <WAFloat />
      {toast && <Toast msg={toast} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
