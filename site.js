(function(){
  'use strict';
  const PHONE='18098246756';
  const $=(q,root=document)=>root.querySelector(q);
  const $$=(q,root=document)=>Array.from(root.querySelectorAll(q));

  const menuToggle=$('#menuToggle');
  const nav=$('#mainNav');
  if(menuToggle&&nav){
    menuToggle.addEventListener('click',()=>nav.classList.toggle('open'));
    $$('a',nav).forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  }

  const checkin=$('#checkin');
  const checkout=$('#checkout');
  const today=new Date();
  const localISO=d=>{
    const y=d.getFullYear();
    const m=String(d.getMonth()+1).padStart(2,'0');
    const day=String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  };
  if(checkin){
    checkin.min=localISO(today);
    checkin.addEventListener('change',()=>{
      if(!checkin.value) return;
      const d=new Date(checkin.value+'T12:00:00');
      d.setDate(d.getDate()+1);
      checkout.min=localISO(d);
      if(!checkout.value || checkout.value<=checkin.value) checkout.value=localISO(d);
    });
  }

  const fmt=v=>{
    if(!v) return '';
    const d=new Date(v+'T12:00:00');
    return new Intl.DateTimeFormat('es-DO',{day:'numeric',month:'long',year:'numeric'}).format(d);
  };
  const openWA=text=>window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`,'_blank','noopener,noreferrer');

  const bookingForm=$('#bookingForm');
  const status=$('#formStatus');
  if(bookingForm){
    bookingForm.addEventListener('submit',e=>{
      e.preventDefault();
      const ci=checkin.value;
      const co=checkout.value;
      if(!ci||!co){ status.textContent='Selecciona la fecha de entrada y salida.'; return; }
      if(co<=ci){ status.textContent='La fecha de salida debe ser posterior a la entrada.'; return; }
      const guests=$('#guests').value;
      const room=$('#roomType').value;
      status.textContent='Abriendo WhatsApp…';
      openWA(`Hola, quisiera consultar disponibilidad en Hotel Kendrick's.\n\nEntrada: ${fmt(ci)}\nSalida: ${fmt(co)}\nHuéspedes: ${guests}\nTipo de habitación: ${room}\n\n¿Me pueden confirmar disponibilidad y tarifa para esas fechas?`);
    });
  }

  $$('.room-select').forEach(btn=>btn.addEventListener('click',()=>{
    const select=$('#roomType');
    if(select) select.value=btn.dataset.room||'Cualquier opción';
    $('#reservar').scrollIntoView({behavior:'smooth',block:'center'});
    setTimeout(()=>checkin&&checkin.focus(),500);
  }));

  $$('.experience-select').forEach(btn=>btn.addEventListener('click',()=>{
    const exp=btn.dataset.experience||'una experiencia en Constanza';
    openWA(`Hola, me interesa consultar información sobre ${exp} durante mi estadía en Constanza. ¿Pueden orientarme sobre disponibilidad, transporte, precio y cómo reservar?`);
  }));

  const lightbox=$('#lightbox');
  const lightboxImg=$('#lightboxImage');
  const close=$('#lightboxClose');
  const closeBox=()=>{ if(!lightbox)return; lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true'); lightboxImg.src=''; };
  $$('.gallery-item').forEach(btn=>btn.addEventListener('click',()=>{
    lightboxImg.src=btn.dataset.full;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
  }));
  if(close) close.addEventListener('click',closeBox);
  if(lightbox) lightbox.addEventListener('click',e=>{ if(e.target===lightbox) closeBox(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeBox(); });
})();
