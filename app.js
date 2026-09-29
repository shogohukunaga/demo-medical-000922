(()=>{
 'use strict';
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const header=$('.header'),dock=$('.schedule-dock'),dockButton=$('.schedule-tab');
 function onScroll(){const fold=scrollY>420;header.classList.toggle('compact',fold);dock.classList.toggle('folded',fold);dockButton.setAttribute('aria-expanded',String(!fold||dock.classList.contains('open')))}
 addEventListener('scroll',onScroll,{passive:true});onScroll();
 dockButton.addEventListener('click',()=>{if(!dock.classList.contains('folded')){dock.classList.add('folded');dockButton.setAttribute('aria-expanded','false')}else{dock.classList.toggle('open');dockButton.setAttribute('aria-expanded',String(dock.classList.contains('open')))}});
 const menu=$('.menu-panel'),menuButton=$('.menu-toggle');let lastFocus=null;
 function toggleMenu(open){if(open)lastFocus=document.activeElement;menu.classList.toggle('open',open);menu.inert=!open;menuButton.setAttribute('aria-expanded',String(open));$('.menu-word').textContent=open?'とじる':'メニュー';document.body.style.overflow=open?'hidden':'';if(open)menu.querySelector('a').focus();else lastFocus?.focus()}
 menuButton.addEventListener('click',()=>toggleMenu(!menu.classList.contains('open')));
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('open'))toggleMenu(false);if(event.key==='Tab'&&menu.classList.contains('open')){const controls=[...menu.querySelectorAll('a,button'),menuButton];let i=controls.indexOf(document.activeElement);if(event.shiftKey&&i===0){event.preventDefault();menuButton.focus()}else if(!event.shiftKey&&document.activeElement===menuButton){event.preventDefault();controls[0].focus()}}});
 const heroImages=$$('.hero-slide'),heroButtons=$$('[data-hero]');let heroIndex=0,heroPaused=reduced.matches,heroTimer;
 function showHero(i){heroIndex=(i+heroImages.length)%heroImages.length;heroImages.forEach((e,n)=>e.classList.toggle('active',n===heroIndex));heroButtons.forEach((e,n)=>e.setAttribute('aria-pressed',String(n===heroIndex)))}
 function startHero(){clearInterval(heroTimer);if(!heroPaused&&!document.hidden)heroTimer=setInterval(()=>showHero(heroIndex+1),5000)}
 heroButtons.forEach(b=>b.addEventListener('click',()=>{showHero(Number(b.dataset.hero));startHero()}));
 const heroPause=$('.hero-pause');function updateHeroPause(){heroPause.textContent=heroPaused?'▷':'Ⅱ';heroPause.setAttribute('aria-label',heroPaused?'メイン写真を再生':'メイン写真を停止')}
 heroPause.addEventListener('click',()=>{heroPaused=!heroPaused;updateHeroPause();startHero()});updateHeroPause();startHero();
 setTimeout(()=>$('.opening').classList.add('closed'),3700);
 const more=$('#message-more'),moreButton=$('.message-toggle');moreButton.addEventListener('click',()=>{let open=moreButton.getAttribute('aria-expanded')!=='true';more.classList.toggle('open',open);more.inert=!open;moreButton.setAttribute('aria-expanded',String(open));moreButton.innerHTML=open?'閉じる <span aria-hidden="true">−</span>':'もっと見る <span aria-hidden="true">＋</span>'});
 const facilityImages=$$('[data-facility-image]'),facilityPanels=$$('.facility-panel'),facilityButtons=$$('[data-facility]');let facilityIndex=0,facilityPaused=reduced.matches,facilityTimer;
 function showFacility(i){facilityIndex=(i+4)%4;facilityImages.forEach((e,n)=>e.classList.toggle('active',n===facilityIndex));facilityPanels.forEach((e,n)=>{e.classList.toggle('active',n===facilityIndex);e.setAttribute('aria-hidden',String(n!==facilityIndex))});facilityButtons.forEach((e,n)=>e.setAttribute('aria-selected',String(n===facilityIndex)))}
 function startFacilities(){clearInterval(facilityTimer);if(!facilityPaused&&!document.hidden)facilityTimer=setInterval(()=>showFacility(facilityIndex+1),5000)}
 facilityButtons.forEach((b,i)=>{b.addEventListener('click',()=>{showFacility(i);startFacilities()});b.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();let n=e.key==='Home'?0:e.key==='End'?3:(i+(e.key==='ArrowRight'?1:3))%4;facilityButtons[n].focus();showFacility(n);startFacilities()}})});
 const facilityPause=$('.facility-pause');function updateFacilityPause(){facilityPause.textContent=facilityPaused?'自動切替を再開':'自動切替を停止';facilityPause.setAttribute('aria-pressed',String(facilityPaused))}facilityPause.addEventListener('click',()=>{facilityPaused=!facilityPaused;updateFacilityPause();startFacilities()});updateFacilityPause();startFacilities();
 document.addEventListener('visibilitychange',()=>{startHero();startFacilities()});reduced.addEventListener('change',()=>{heroPaused=reduced.matches;facilityPaused=reduced.matches;updateHeroPause();updateFacilityPause();startHero();startFacilities()});
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(items=>{items.forEach(item=>{if(item.isIntersecting){item.target.classList.add('seen');observer.unobserve(item.target)}})},{rootMargin:'0px 0px -90px 0px',threshold:.05});$$('.reveal').forEach(el=>observer.observe(el))}
 const dialog=$('.modal');let dialogTrigger;
 const detailText={
  'Web受付':'こちらはWeb受付画面への導線サンプルです。実際の予約は受け付けていません。個人情報の入力や送信はできません。診療時間はページ下部の案内をご覧ください。',
  'お問い合わせ':'そよぎ矯正歯科は架空のクリニックです。電話番号・所在地は表示例であり、実際のお問い合わせ先ではありません。',
  '採用情報':'採用ページの表示サンプルです。クリニックの考え方、仕事内容、働く環境などを紹介する構成を想定しています。実際の募集・応募受付は行っていません。',
  'お知らせ一覧':'2026.09.20 ホームページを公開しました\n2026.09.15 はじめて受診される方へ\n2026.09.01 院内のご案内を更新しました\n\nいずれもレイアウト確認用の架空のお知らせです。',
  'はじめて受診される方へ':'ご来院から受付、問診、診察、ご案内までの流れを紹介するページのサンプルです。実際の受診案内ではありません。',
  '院内のご案内':'医院外観・カウンセリング室・診察室・待合室の4つをご紹介しています。写真はすべて架空のAI生成イメージです。院内写真のボタンで表示を切り替えられます。',
  '矯正カウンセリングのご案内':'矯正相談の流れや装置の種類、施設の特徴を写真と文章で紹介するページのサンプルです。具体的な診療内容は実際の医療機関に合わせて整える構成を想定しています。'
 };
 $$('[data-detail]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();const heading=button.dataset.detail;const fromMenu=menu.contains(button);if(menu.classList.contains('open'))toggleMenu(false);dialogTrigger=fromMenu?menuButton:button;$('#detail-title').textContent=heading;$('.modal-content').textContent=detailText[heading]||('「'+heading+'」の紹介ページを想定した表示サンプルです。実際の診療・お知らせ・医療情報ではありません。架空の文章と画像を使用しています。');dialog.showModal();}));
 $('.modal-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>dialogTrigger?.focus());dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
})();
