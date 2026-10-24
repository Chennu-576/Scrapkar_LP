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

/*  NETWORK DATA — 5 city hubs, facility names kept from existing data  */
const NETWORK = {
  HYD: { city: 'Hyderabad', badge: 'Authorized Facility', partners: [
    { name: 'Hyderabad EcoScrap RVSF',       loc: 'End-of-life vehicle treatment and documentation service, Medchal.' },
    { name: 'Balanagar Automotive Recovery', loc: 'Passenger car and three-wheeler disposal node, Balanagar.' }
  ]},
  BLR: { city: 'Bangalore', badge: 'Tech-Enabled Hub', partners: [
    { name: 'Bengaluru CleanDrive RVSF',     loc: 'Government authorized RVSF with digital certificate generation, Doddaballapur.' },
    { name: 'Peenya Auto Recycling Node',    loc: 'Commercial fleet and two-wheeler processing, Peenya Industrial Estate.' }
  ]},
  CHN: { city: 'Chennai', badge: 'South India Super Hub', partners: [
    { name: 'Chennai Eco-Dismantling RVSF',  loc: 'Port-connected high-efficiency recycling facility, Sriperumbudur.' },
    { name: 'Coimbatore Shredders RVSF',     loc: 'Engine and heavy casting processing plant, Eachanari.' }
  ]},
  MUM: { city: 'Mumbai', badge: 'Authorized Facility', partners: [
    { name: 'MMR Vehicle Recycling Center',  loc: 'Passenger vehicle and two-wheeler dismantling, Turbhe MIDC, Navi Mumbai.' }
  ]},
  PUN: { city: 'Pune', badge: 'Authorized Facility', partners: [
    { name: 'Mahindra Cero RVSF Processing Unit', loc: 'Automated depollution and heavy shredding, MIDC Chakan.' },
    { name: 'Nagpur Vidarbha Clean Metals RVSF',  loc: 'Commercial vehicle and fleet recovery hub, Butibori.' }
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
  const panel = document.getElementById('recyclePanel');
  const catEl = document.getElementById('partCategory');
  const nameEl = document.getElementById('partName');
  const becomesEl = document.getElementById('partBecomes');
  const descEl = document.getElementById('partDesc');

  const update = key => {
    const p = PARTS[key];
    if (!p) return;
    hotspots.forEach(h => h.classList.toggle('is-active', h.dataset.part === key));
    
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
}

/* NETWORK — 5 city hubs */
function initNetwork() {
  const hubs = document.querySelectorAll('.hub');
  const select = document.getElementById('stateSelect');
  const card = document.getElementById('facilityCard');
  const cityEl = document.getElementById('facCity');
  const badgeEl = document.getElementById('facBadge');
  const listEl = document.getElementById('facList');

  const render = code => {
    const d = NETWORK[code];
    if (!d) return;
    hubs.forEach(h => h.classList.toggle('is-active', h.dataset.state === code));
    if (select && select.value !== code) select.value = code;
    card.style.opacity = '0.35';
    card.style.transform = 'translateY(6px)';
    setTimeout(() => {
      cityEl.textContent  = d.city;
      badgeEl.textContent = d.badge;
      listEl.innerHTML = d.partners.map(p => `
        <div class="facility__item">
          <span class="facility__icon">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          <div class="facility__item-body">
            <h4>${p.name}</h4>
            <p>${p.loc}</p>
          </div>
        </div>
      `).join('');
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100);
  };

  hubs.forEach(h => {
    h.addEventListener('mouseenter', () => render(h.dataset.state));
    h.addEventListener('click',      () => render(h.dataset.state));
    h.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); render(h.dataset.state); }
    });
  });
  if (select) select.addEventListener('change', e => render(e.target.value));
  render('HYD');
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
      toast('Thank you. Our RVSF team will approach you within 7 days.', 'success');
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