
'use strict';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwIALpqkLwKScGDvDBuh1H70CafQs1PeKpSOK1TKvm49__sQrSB7YdtPKPRXRBKBAAG/exec';


const PARTS = {
  body:       { num: 1,  category: 'Core Structure',        name: 'Body Shell & Chassis',       becomes: 'Construction steel, new vehicle panels',          desc: "Most of your car's weight is steel. It is shredded, melted, and rolled again into TMT bars, sheet metal, and new car bodies. Steel can be recycled repeatedly without losing strength." },
  engine:     { num: 2,  category: 'Powertrain',            name: 'Engine Block & Castings',    becomes: 'New engine parts, pump housings, industrial castings', desc: 'Cast iron and aluminium are separated and remelted. An engine that no longer runs still holds its full metal value. Certified destruction means it cannot be refitted into another vehicle.' },
  wheels:     { num: 3,  category: 'Running Gear',          name: 'Alloy Wheels',               becomes: 'New wheels, auto components, cookware',           desc: 'Aluminium is remelted using a fraction of the energy needed to make it from ore.' },
  tyres:      { num: 4,  category: 'Rubber & Polymers',     name: 'Tyres',                      becomes: 'Rubberised roads, playground surfaces, mats',     desc: 'Tyres are ground into crumb rubber. It goes into road bitumen, sports flooring, and moulded rubber goods instead of being burnt in the open.' },
  battery:    { num: 5,  category: 'Electrical & Chemical', name: 'Battery',                    becomes: 'New batteries',                                    desc: 'Lead is recovered and cast into new battery plates. The plastic case is remoulded and the acid is neutralised.' },
  ev_battery: { num: 6,  category: 'Energy Storage',        name: 'EV Battery Pack',            becomes: 'New cells, stationary energy storage',             desc: 'Packs with usable capacity get a second life storing solar or backup power. The rest are processed to recover lithium, cobalt, and nickel.' },
  catalytic:  { num: 7,  category: 'Exhaust & PGMs',        name: 'Catalytic Converter',        becomes: 'New converters, electronics',                      desc: 'It contains platinum, palladium, and rhodium. These are extracted and refined for reuse, which reduces the need for fresh mining.' },
  glass:      { num: 8,  category: 'Safety Glass',          name: 'Windscreen & Glass',         becomes: 'Fibreglass insulation, glass containers, construction material', desc: 'Glass is separated from its plastic layer, crushed, and remelted or used as aggregate.' },
  wiring:     { num: 9,  category: 'Electrical Conductors', name: 'Wiring Harness',             becomes: 'New cable, motor windings',                        desc: 'Copper is stripped out and refined. It can be recycled without losing conductivity.' },
  plastics:   { num: 10, category: 'Polymers & Plastics',   name: 'Bumpers, Dashboard & Trims', becomes: 'New auto parts, crates, furniture',                desc: 'Plastics are sorted, shredded, and turned into pellets, then moulded into new products.' },
  seats:      { num: 11, category: 'Interior Trim',         name: 'Seats & Upholstery',         becomes: 'Carpet underlay, insulation, padding',             desc: 'Foam is rebonded into cushioning. Fabric is shredded into fibre fill.' },
  radiator:   { num: 12, category: 'Cooling & HVAC',        name: 'Radiator & AC Unit',         becomes: 'New heat exchangers',                              desc: 'Aluminium and copper cores are remelted. Refrigerant gas is captured, not released.' },
  fluids:     { num: 13, category: 'Hazardous Liquids',     name: 'Engine Oil & Fluids',        becomes: 'Re-refined lubricants, industrial fuel',           desc: 'Fluids are drained before dismantling. Used oil is re-refined, so nothing reaches soil or groundwater.' },
  ecu:        { num: 14, category: 'Micro-Electronics',     name: 'ECU & Electronics',          becomes: 'Recovered gold, silver, copper',                   desc: 'Circuit boards go to authorised e-waste recyclers for metal recovery.' }
};

  //  NETWORK DATA

const NETWORK = {
  MH: { state:'Maharashtra', title:'Western Region Scrapping Facilities', partners:[
    { name:'Mahindra Cero RVSF Processing Unit', reg:'RVSF/MH/2022/001', loc:'MIDC Chakan Industrial Zone, Pune, Maharashtra', cap:'Automated Depollution & Heavy Shredding' },
    { name:'MMR Vehicle Recycling Center', reg:'RVSF/MH/2023/004', loc:'Turbhe MIDC, Navi Mumbai, Maharashtra', cap:'Passenger Vehicle & 2-Wheeler Dismantling' },
    { name:'Nagpur Vidarbha Clean Metals RVSF', reg:'RVSF/MH/2023/007', loc:'Butibori Industrial Area, Nagpur, Maharashtra', cap:'Commercial Vehicle & Fleet Recovery Hub' }
  ]},
  DL: { state:'Delhi-NCR', title:'Capital Region Scrapping Facilities', partners:[
    { name:'Maruti Suzuki Toyotsu RVSF (MSTI)', reg:'RVSF/UP/2021/001', loc:'Sector 80, Phase II, Noida, Delhi-NCR', cap:'High-Capacity Shredding & Depollution Unit' },
    { name:'Delhi SafeScrap RVSF Hub', reg:'RVSF/DL/2022/002', loc:'Okhla Industrial Area, Phase II, New Delhi', cap:'15-Year Petrol / 10-Year Diesel Legal Surrender' },
    { name:'Gurugram Automotive Recovery', reg:'RVSF/HR/2022/005', loc:'IMT Manesar, Gurugram, Haryana', cap:'Battery Extraction & High-Purity Metal Recovery' }
  ]},
  KA: { state:'Karnataka', title:'Southern Region Scrapping Facilities', partners:[
    { name:'Bengaluru CleanDrive RVSF', reg:'RVSF/KA/2023/001', loc:'Doddaballapur Industrial Area, Bengaluru', cap:'Digital VAHAN De-Registration & Instant COD' },
    { name:'Peenya Auto Recycling Node', reg:'RVSF/KA/2023/003', loc:'Peenya Industrial Estate, Bengaluru', cap:'Commercial Fleet & Two-Wheeler Processing' }
  ]},
  TN: { state:'Tamil Nadu', title:'Tamil Nadu Scrapping Facilities', partners:[
    { name:'Chennai Eco-Dismantling RVSF', reg:'RVSF/TN/2023/001', loc:'Sriperumbudur Industrial Corridor, Chennai', cap:'Port-Connected Bulk Vehicle Shredding Facility' },
    { name:'Coimbatore Shredders RVSF', reg:'RVSF/TN/2023/005', loc:'Eachanari Industrial Suburb, Coimbatore', cap:'Heavy Casting & Alloy Segregation Plant' }
  ]},
  TS: { state:'Telangana', title:'Hyderabad & Telangana Facilities', partners:[
    { name:'Hyderabad EcoScrap RVSF', reg:'RVSF/TS/2023/001', loc:'Medchal Industrial Area, Hyderabad', cap:'Automated Fluid Drainage & Hydraulic Compacting' },
    { name:'Balanagar Automotive Recovery Unit', reg:'RVSF/TS/2023/003', loc:'Balanagar Industrial Area, Hyderabad', cap:'Passenger Car & Three-Wheeler Disposal Node' }
  ]},
  GJ: { state:'Gujarat', title:'Gujarat Industrial Scrapping Hubs', partners:[
    { name:'Sanand High-Tech Shredding RVSF', reg:'RVSF/GJ/2022/001', loc:'Sanand GIDC Automotive Corridor, Ahmedabad', cap:'100% Zero-Landfill Certified Shredding Plant' },
    { name:'Surat Eco-Metals Recycling Facility', reg:'RVSF/GJ/2023/004', loc:'Hazira Industrial Belt, Surat', cap:'Heavy Commercial & Industrial Fleet Scrapping' }
  ]},
  UP: { state:'Uttar Pradesh', title:'Uttar Pradesh RVSF Facilities', partners:[
    { name:'Lucknow Smart Recycle RVSF', reg:'RVSF/UP/2022/003', loc:'Chinhat Industrial Area, Lucknow', cap:'State Capital End-of-Life Vehicle Center' },
    { name:'Sahibabad Bulk Vehicle Scrap Hub', reg:'RVSF/UP/2023/008', loc:'Sahibabad Industrial Area, Ghaziabad', cap:'Commercial Bus, Truck & LCV Retirement Facility' }
  ]},
  HR: { state:'Haryana', title:'Haryana State Scrapping Network', partners:[
    { name:'Faridabad Green Shredding RVSF', reg:'RVSF/HR/2022/001', loc:'Sector 59 IMT, Faridabad', cap:'Ferrous & Non-Ferrous Closed-Loop Processing' },
    { name:'Rohtak Auto Recycling Depot', reg:'RVSF/HR/2023/006', loc:'IMT Rohtak, Haryana', cap:'MoRTH Verified Regional Collection Depot' }
  ]},
  RJ: { state:'Rajasthan', title:'Rajasthan Regional Facilities', partners:[
    { name:'Tata Motors Re.Wi.Re Scrapping Facility', reg:'RVSF/RJ/2023/001', loc:'Jaipur Industrial Zone, Rajasthan', cap:'Automated Passenger & Commercial Dismantling' },
    { name:'Alwar Green Metal Yard', reg:'RVSF/RJ/2023/004', loc:'Matsya Industrial Area, Alwar', cap:'End-of-Life Vehicle Verification & COD Issuance' }
  ]}
};

/* ==========================================================================
   INIT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initStats();
  initVehicleRows();
  initCalculator();
  initRecycle();
  initNetwork();
  initFAQ();
  initContactForm();
  initModal();
  initStickyCta();
  initTestimonials();
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

/* HEADER */
function initHeader() {
  const header = document.getElementById('siteHeader');
  const burger = document.getElementById('hamburger');
  const nav = document.getElementById('primaryNav');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }));
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* STATS */
function initStats() {
  const section = document.getElementById('stats');
  if (!section) return;
  const nums = section.querySelectorAll('.stat__num');
  let done = false;
  const animate = el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (target === 0) { el.textContent = '0'; return; }
    const start = performance.now();
    const dur = 1600;
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(2, -10 * p);
      el.textContent = Math.floor(eased * target);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  };
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting && !done) {
        done = true;
        nums.forEach(animate);
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  obs.observe(section);
}

/* VEHICLE ROWS */
function initVehicleRows() {
  document.querySelectorAll('.vrow').forEach(row => {
    const type = row.dataset.type;
    const cta = row.querySelector('.vrow__cta');
    if (!cta || !type) return;
    cta.addEventListener('click', () => {
      const sel = document.getElementById('calcType');
      if (sel) sel.value = type;
    });
  });
}

/* CALCULATOR */
function initCalculator() {
  const form = document.getElementById('calcForm');
  if (!form) return;
  const phone = document.getElementById('calcPhone');
  const phoneError = document.getElementById('calcPhoneError');
  phone.addEventListener('input', () => {
    phone.value = phone.value.replace(/\D/g, '').slice(0, 10);
    if (phone.value.length === 10) {
      phone.classList.remove('is-error');
      phoneError.classList.remove('is-visible');
    }
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const type = document.getElementById('calcType');
    const make = document.getElementById('calcMake');
    const model = document.getElementById('calcModel');
    const year = document.getElementById('calcYear');
    const city = document.getElementById('calcCity');
    let ok = true;
    [type, make, model, year, city].forEach(f => {
      if (!f.value.trim()) { f.classList.add('is-error'); ok = false; }
      else f.classList.remove('is-error');
    });
    const phoneOk = /^[6-9]\d{9}$/.test(phone.value);
    if (!phoneOk) {
      phone.classList.add('is-error');
      phoneError.classList.add('is-visible');
      ok = false;
    } else {
      phone.classList.remove('is-error');
      phoneError.classList.remove('is-visible');
    }
    if (!ok) { toast('Please fill all required fields correctly.', 'error'); return; }
    const est = estimate(type.value);
    openModal({
      summary: `${make.value.trim()} ${model.value.trim()} (${year.value}) · ${city.value.trim()}`,
      range: `${est.min} – ${est.max}`,
      metal: est.metal,
      component: est.component,
      tax: est.tax
    });
    const cf = {
      name: document.getElementById('fullName'),
      phone: document.getElementById('phone'),
      city: document.getElementById('city'),
      notes: document.getElementById('notes')
    };
    if (cf.phone) cf.phone.value = phone.value;
    if (cf.city) cf.city.value = city.value.trim();
    if (cf.notes) cf.notes.value = `${make.value.trim()} ${model.value.trim()} (${year.value}) — estimate ${est.min}–${est.max}`;
    sendLead({
      source: 'Scrap Value Calculator',
      vehicleType: type.value,
      make: make.value.trim(),
      model: model.value.trim(),
      year: year.value,
      city: city.value.trim(),
      phone: phone.value,
      estimatedRange: `${est.min} – ${est.max}`
    });
  });
}

function estimate(type) {
  const map = {
    car_hatchback:    { min: 18000, max: 24000, metal: 14000, comp: 4000, tax: 'Up to 25%' },
    car_sedan:        { min: 22000, max: 30000, metal: 17000, comp: 5000, tax: 'Up to 25%' },
    car_suv:          { min: 28000, max: 38000, metal: 21000, comp: 7000, tax: 'Up to 25%' },
    two_wheeler:      { min: 4500,  max: 7500,  metal: 3200,  comp: 1300, tax: 'Up to 15%' },
    three_wheeler:    { min: 12000, max: 18000, metal: 9000,  comp: 3000, tax: 'Up to 20%' },
    commercial_lcv:   { min: 40000, max: 65000, metal: 32000, comp: 8000, tax: 'Up to 25%' },
    commercial_truck: { min: 90000, max: 180000,metal: 75000, comp: 15000,tax: 'Up to 25%' },
    electric_vehicle: { min: 25000, max: 45000, metal: 16000, comp: 9000, tax: 'Up to 25%' },
    fleet_bulk:       { min: 50000, max: 120000,metal: 40000, comp: 10000,tax: 'Up to 25%' }
  };
  const r = map[type] || map.car_hatchback;
  const f = n => '₹' + n.toLocaleString('en-IN');
  return { min: f(r.min), max: f(r.max), metal: f(r.metal), component: f(r.comp), tax: r.tax };
}

/* RECYCLE HOTSPOTS — hover a dot updates right panel */
function initRecycle() {
  const hotspots = document.querySelectorAll('.hotspot');
  const pills = document.querySelectorAll('.pill');
  const panel = document.getElementById('recyclePanel');
  const catEl = document.getElementById('partCategory');
  const nameEl = document.getElementById('partName');
  const becomesEl = document.getElementById('partBecomes');
  const descEl = document.getElementById('partDesc');

  const update = key => {
    const p = PARTS[key];
    if (!p) return;
    hotspots.forEach(h => h.classList.toggle('is-active', h.dataset.part === key));
    pills.forEach(p2 => p2.classList.toggle('is-active', p2.dataset.part === key));
    panel.style.opacity = '0.35';
    panel.style.transform = 'translateY(6px)';
    setTimeout(() => {
      catEl.textContent = `${p.num} · ${p.category}`;
      nameEl.textContent = p.name;
      becomesEl.textContent = p.becomes;
      descEl.textContent = p.desc;
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0)';
    }, 110);
  };

  hotspots.forEach(h => {
    const key = h.dataset.part;
    h.addEventListener('mouseenter', () => update(key));
    h.addEventListener('focus',      () => update(key));
    h.addEventListener('click',      () => update(key));
  });
  pills.forEach(p => p.addEventListener('click', () => update(p.dataset.part)));
}

/* NETWORK */
function initNetwork() {
  const states = document.querySelectorAll('.state');
  const hubs = document.querySelectorAll('.hub');
  const select = document.getElementById('stateSelect');
  const card = document.getElementById('facilityCard');
  const stateEl = document.getElementById('facState');
  const titleEl = document.getElementById('facTitle');
  const listEl = document.getElementById('facList');

  const render = code => {
    const d = NETWORK[code];
    if (!d) return;
    states.forEach(s => s.classList.toggle('is-active', s.dataset.state === code));
    hubs.forEach(h => h.classList.toggle('is-active', h.dataset.state === code));
    if (select && select.value !== code) select.value = code;
    card.style.opacity = '0.35';
    card.style.transform = 'translateY(6px)';
    setTimeout(() => {
      stateEl.textContent = d.state;
      titleEl.textContent = d.title;
      listEl.innerHTML = d.partners.map(p => `
        <div class="facility__item">
          <div class="facility__item-head">
            <h4>${p.name}</h4>
            <span class="facility__reg">${p.reg}</span>
          </div>
          <span class="facility__loc">${p.loc}</span>
          <span class="facility__cap">${p.cap}</span>
        </div>
      `).join('');
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100);
  };

  states.forEach(s => {
    s.addEventListener('mouseenter', () => render(s.dataset.state));
    s.addEventListener('click',      () => render(s.dataset.state));
  });
  hubs.forEach(h => {
    h.addEventListener('mouseenter', () => render(h.dataset.state));
    h.addEventListener('click',      () => render(h.dataset.state));
    h.setAttribute('tabindex', '0');
    h.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); render(h.dataset.state); }
    });
  });
  if (select) select.addEventListener('change', e => render(e.target.value));
  render('MH');
}

/* FAQ */
function initFAQ() {
  const items = document.querySelectorAll('.faq__item');
  const search = document.getElementById('faqSearch');
  const clear = document.getElementById('faqClear');
  const empty = document.getElementById('faqEmpty');
  items.forEach(item => {
    const summary = item.querySelector('summary');
    summary.addEventListener('click', () => {
      items.forEach(other => { if (other !== item) other.removeAttribute('open'); });
    });
  });
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.toLowerCase().trim();
      clear.hidden = !q;
      let count = 0;
      items.forEach(item => {
        const txt = item.textContent.toLowerCase();
        if (!q || txt.includes(q)) { item.style.display = ''; count++; }
        else item.style.display = 'none';
      });
      empty.hidden = count > 0;
    });
    clear.addEventListener('click', () => {
      search.value = '';
      clear.hidden = true;
      items.forEach(i => i.style.display = '');
      empty.hidden = true;
      search.focus();
    });
  }
}

/* CONTACT FORM */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const name = document.getElementById('fullName');
  const phone = document.getElementById('phone');
  const city = document.getElementById('city');
  const notes = document.getElementById('notes');
  const honeypot = document.getElementById('honeypot');
  const btn = document.getElementById('contactSubmit');
  const nameErr = document.getElementById('fullNameError');
  const phoneErr = document.getElementById('phoneError');
  const cityErr = document.getElementById('cityError');

  phone.addEventListener('input', () => {
    phone.value = phone.value.replace(/\D/g, '').slice(0, 10);
    if (phone.value.length === 10) {
      phone.classList.remove('is-error');
      phoneErr.classList.remove('is-visible');
    }
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (honeypot.value) return;
    let ok = true;
    if (!name.value.trim()) { name.classList.add('is-error'); nameErr.classList.add('is-visible'); ok = false; }
    else { name.classList.remove('is-error'); nameErr.classList.remove('is-visible'); }
    if (!city.value.trim()) { city.classList.add('is-error'); cityErr.classList.add('is-visible'); ok = false; }
    else { city.classList.remove('is-error'); cityErr.classList.remove('is-visible'); }
    const phoneOk = /^[6-9]\d{9}$/.test(phone.value);
    if (!phoneOk) { phone.classList.add('is-error'); phoneErr.classList.add('is-visible'); ok = false; }
    else { phone.classList.remove('is-error'); phoneErr.classList.remove('is-visible'); }
    if (!ok) { toast('Please fill all required fields correctly.', 'error'); return; }

    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span>Sending…</span>';

    const payload = {
      source: 'Callback Form',
      fullName: name.value.trim(),
      phone: phone.value,
      city: city.value.trim(),
      notes: notes.value.trim()
    };

    try {
      await sendLead(payload);
      toast('Thank you. Our RVSF team will approach you with in 7 days.', 'success');
      form.reset();
    } catch (err) {
      toast('Submission failed. Please try again or email contactrvsf@mplgroup.in.', 'error');
      console.error(err);
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
  });
}

async function sendLead(payload) {
  if (!APPS_SCRIPT_URL) {
    console.info('[Scrapkar] Backend URL not configured. Payload:', payload);
    return { ok: true, simulated: true };
  }
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, notificationRecipient: 'contactrvsf@mplgroup.in' })
    });
    return { ok: true };
  } catch (err) {
    console.error('[Scrapkar] Send failed:', err);
    throw err;
  }
}

/* MODAL */
function initModal() {
  const modal = document.getElementById('valuationModal');
  modal.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => closeModal());
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
  const recalc = modal.querySelector('[data-recalc]');
  if (recalc) recalc.addEventListener('click', () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
  });
}
function openModal({ summary, range, metal, component, tax }) {
  document.getElementById('modalSummary').textContent = summary;
  document.getElementById('modalRange').textContent = range;
  document.getElementById('modalMetal').textContent = metal;
  document.getElementById('modalComponent').textContent = component;
  document.getElementById('modalTax').textContent = tax;
  document.getElementById('valuationModal').classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('valuationModal').classList.remove('is-open');
  document.body.style.overflow = '';
}

/* STICKY MOBILE CTA */
function initStickyCta() {
  const cta = document.getElementById('stickyCta');
  const hero = document.getElementById('hero');
  if (!cta || !hero) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting || window.innerWidth > 768) cta.style.display = 'none';
      else cta.style.display = 'flex';
    });
  }, { threshold: 0.05 });
  obs.observe(hero);
}

/* TESTIMONIALS — auto-advance every 30 seconds */
function initTestimonials() {
  const track = document.getElementById('tTrack');
  const dotsWrap = document.getElementById('tDots');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');
  if (!track) return;

  const slides = track.querySelectorAll('.testimonial__slide');
  const total = slides.length;
  let current = 0;
  let timer = null;
  const INTERVAL = 30000;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'testimonial__dot' + (i === 0 ? ' is-active' : '');
    d.setAttribute('aria-label', `Go to review ${i + 1}`);
    d.addEventListener('click', () => go(i));
    dotsWrap.appendChild(d);
  });
  const dots = dotsWrap.querySelectorAll('.testimonial__dot');

  const show = idx => {
    slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  };
  const next = () => go((current + 1) % total);
  const prev = () => go((current - 1 + total) % total);
  const go = idx => { current = idx; show(current); restart(); };
  const restart = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  };

  const container = document.getElementById('testimonial');
  container.addEventListener('mouseenter', () => { if (timer) clearInterval(timer); });
  container.addEventListener('mouseleave', restart);

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  show(0);
  restart();
}

/* TOAST */
function toast(message, type = 'success') {
  const stack = document.getElementById('toastStack');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'error' ? ' is-error' : '');
  const icon = type === 'error'
    ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
    : '<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
  el.innerHTML = `${icon}<span>${message}</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'all 0.3s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    setTimeout(() => el.remove(), 320);
  }, 4600);
}