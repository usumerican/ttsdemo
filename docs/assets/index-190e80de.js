(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function i(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(t){if(t.ep)return;t.ep=!0;const r=i(t);fetch(t.href,r)}})();onload=async()=>{onunhandledrejection=e=>alert(e.reason||e);const l=document.title,o=document.querySelector(".TextInput"),i=document.querySelector(".LangSelect"),s=document.querySelector(".VoiceSelect"),t=document.querySelector(".PitchSelect"),r=document.querySelector(".RateSelect"),a=document.querySelector(".VolumeSelect"),d=new Map,x=new Intl.DisplayNames([],{type:"language"});for(const e of(await q()).sort((c,n)=>c.lang.localeCompare(n.lang))){const c=f(e.lang);let n=d.get(c);n||(n=[],d.set(c,n)),n.push(e)}document.querySelector(".TitleOutput").textContent=l,i.replaceChildren(...["",...d.keys()].map(e=>new Option("Lang:"+(e?" ["+e+"] "+P(e):""),e))),t.replaceChildren(...[...Array(21)].map((e,c)=>{const n=(c/10).toFixed(1);return new Option("Pitch: "+n,n)})),r.replaceChildren(...[...Array(100)].map((e,c)=>{const n=((c+1)/10).toFixed(1);return new Option("Rate: "+n,n)})),a.replaceChildren(...[...Array(11)].map((e,c)=>{const n=(c/10).toFixed(1);return new Option("Volume: "+n,n)}));const u=new URLSearchParams(location.search);o.value=u.get("text")||"",S(),i.value=f(u.get("lang")||""),g(),s.value=u.get("voiceURI")||"",m(t,u.get("pitch"),"1.0"),m(r,u.get("rate"),"1.0"),m(a,u.get("volume"),"1.0"),visualViewport.onresize=()=>{document.documentElement.style.height=visualViewport.height+"px",document.documentElement.scrollTop=0},onpagehide=()=>{h()},document.querySelector(".SpeakForm").onsubmit=e=>{var O;e.preventDefault(),h();const c=o.value,n=i.value,y=s.value,v=t.value,w=r.value,L=a.value,p=new SpeechSynthesisUtterance(c);p.lang=f(n),p.voice=(O=d.get(n))==null?void 0:O.find(R=>R.voiceURI===y),p.pitch=parseFloat(v),p.rate=parseFloat(w),p.volume=parseFloat(L),speechSynthesis.speak(p),history.replaceState(null,null,"?"+new URLSearchParams({text:c,lang:n,voiceURI:y,pitch:v,rate:w,volume:L})),S()},document.querySelector(".StopButton").onclick=()=>{h()},i.onchange=()=>{g()};function g(){s.replaceChildren(...[{name:"",localService:!0,voiceURI:""},...d.get(i.value)||[]].map(e=>new Option("Voice: "+e.name+(e.localService?"":" (Remote)"),e.voiceURI)))}function S(){const e=o.value,c=30;document.title=e?e.length>c?e.slice(0,c-1)+"…":e:l}function P(e){try{return x.of(e)}catch{return e}}};function m(l,o,i){(l.value=o)||(l.value=i)}function q(){return new Promise((l,o)=>{const i=speechSynthesis.getVoices();i.length?l(i):speechSynthesis.addEventListener("voiceschanged",()=>{q().then(s=>l(s),s=>o(s))},{once:!0})})}function h(){speechSynthesis.cancel()}function f(l){if(l.includes("_")){const o=l.split(/[^0-9a-zA-Z]+/);o.length>2&&([o[1],o[2]]=[o[2],o[1]]),l=o.join("-")}return l}
