const button=document.querySelector('.menu');const nav=document.querySelector('#navigation');function closeMenu(){nav.classList.remove('open');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','メニューを開く')}button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く')});nav.querySelectorAll('a:not(.nav-service-trigger)').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('.nav-service-dropdown.is-open')){closeMenu();button.focus()}});

if(document.querySelector('.hero-classic')){
 const siteHeader=document.querySelector('.header');
 const mobileContact=document.querySelector('.mobile-contact');
 const heroContent=document.querySelector('.hero-content');
 const heroCopy=document.querySelector('.hero-copy');
 const fitHeroCopy=()=>{
  if(!heroCopy)return;
  if(!window.matchMedia('(min-width:651px)').matches){heroCopy.style.removeProperty('--hero-copy-scale');return;}
  const spacing=getComputedStyle(heroContent);
  const available=heroContent.clientHeight-parseFloat(spacing.paddingTop)-parseFloat(spacing.paddingBottom);
  heroCopy.style.setProperty('--hero-copy-scale',Math.min(1,Math.max(0,available)/heroCopy.offsetHeight));
 };
 const syncHeroHeight=()=>{
  document.documentElement.style.setProperty('--site-header-height',siteHeader.getBoundingClientRect().height+'px');
  document.documentElement.style.setProperty('--mobile-contact-height',(mobileContact?.getBoundingClientRect().height||0)+'px');
  requestAnimationFrame(fitHeroCopy);
 };
 syncHeroHeight();
 const heroResizeObserver=new ResizeObserver(syncHeroHeight);
 heroResizeObserver.observe(siteHeader);
 if(mobileContact)heroResizeObserver.observe(mobileContact);
 heroResizeObserver.observe(heroContent);
 if(heroCopy)heroResizeObserver.observe(heroCopy);
 window.addEventListener('resize',syncHeroHeight);
 document.fonts.ready.then(syncHeroHeight);
}

const serviceDropdown=document.querySelector('.nav-service-dropdown');
if(serviceDropdown){
 const trigger=serviceDropdown.querySelector('.nav-service-trigger');
 const setOpen=open=>{serviceDropdown.classList.toggle('is-open',open);trigger.setAttribute('aria-expanded',String(open));};
 serviceDropdown.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch'&&window.matchMedia('(min-width:651px)').matches)setOpen(true);});
 serviceDropdown.addEventListener('pointerleave',event=>{if(event.pointerType!=='touch'&&!serviceDropdown.contains(document.activeElement))setOpen(false);});
 serviceDropdown.addEventListener('focusin',event=>{if(event.target!==trigger||trigger.matches(':focus-visible'))setOpen(true);});
 serviceDropdown.addEventListener('focusout',event=>{if(!serviceDropdown.contains(event.relatedTarget))setOpen(false);});
 trigger.addEventListener('click',event=>{if(window.matchMedia('(max-width:650px)').matches||!window.matchMedia('(any-hover:hover)').matches){event.preventDefault();setOpen(!serviceDropdown.classList.contains('is-open'));}else{setOpen(true);}});
 trigger.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();setOpen(true);serviceDropdown.querySelector('.nav-service-submenu a').focus();}});
 document.addEventListener('pointerdown',event=>{if(!serviceDropdown.contains(event.target))setOpen(false);});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(serviceDropdown.contains(document.activeElement))trigger.focus();setOpen(false);}});
 serviceDropdown.querySelectorAll('.nav-service-submenu a').forEach(link=>link.addEventListener('click',()=>setOpen(false)));
 button.addEventListener('click',()=>{if(button.getAttribute('aria-expanded')==='false')setOpen(false);});
}

document.querySelectorAll('.faq .questions details').forEach(details=>{
 const summary=details.querySelector('summary');
 if(!summary||typeof details.animate!=='function')return;
 let animation=null;
 let expanded=details.open;
 const originalOverflow=details.style.overflow;
 summary.addEventListener('click',event=>{
  event.preventDefault();
  expanded=!expanded;
  const startHeight=details.getBoundingClientRect().height;
  if(animation){animation.cancel();animation=null;}
  details.open=true;
  const style=getComputedStyle(details);
  const closedHeight=summary.getBoundingClientRect().height+parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth)+parseFloat(style.paddingTop)+parseFloat(style.paddingBottom);
  const endHeight=expanded?details.getBoundingClientRect().height:closedHeight;
  details.style.overflow='hidden';
  const current=details.animate([{height:startHeight+'px'},{height:endHeight+'px'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
  animation=current;
  current.onfinish=()=>{
   if(animation!==current)return;
   details.open=expanded;
   animation=null;
   current.cancel();
   details.style.overflow=originalOverflow;
  };
 });
});
