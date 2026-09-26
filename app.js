const KEY="link-vault-v1";
let links=JSON.parse(localStorage.getItem(KEY)||"null")||[
  {id:1,title:"YuweAI",url:"https://yuwe-ai.web.app",tags:["product","ai"]},
  {id:2,title:"MDN Web Docs",url:"https://developer.mozilla.org",tags:["docs","web"]},
  {id:3,title:"GitHub Profile",url:"https://github.com/julianaastudillo08",tags:["portfolio"]}
];
let activeTag=null;
const list=document.getElementById("list"), tagCloud=document.getElementById("tagCloud"), q=document.getElementById("q");
function save(){ localStorage.setItem(KEY, JSON.stringify(links)); }
function allTags(){ const s=new Set(); links.forEach(l=>l.tags.forEach(t=>s.add(t))); return [...s].sort(); }
function render(){
  const query=q.value.trim().toLowerCase();
  const filtered=links.filter(l=>{
    if(activeTag && !l.tags.includes(activeTag)) return false;
    if(!query) return true;
    return l.title.toLowerCase().includes(query)||l.url.toLowerCase().includes(query)||l.tags.some(t=>t.includes(query));
  });
  tagCloud.innerHTML=`<button type="button" data-tag="" class="${!activeTag?'active':''}">All</button>`+allTags().map(t=>`<button type="button" data-tag="${t}" class="${activeTag===t?'active':''}">${t}</button>`).join("");
  list.innerHTML=filtered.map(l=>`<li><div><a href="${l.url}" target="_blank" rel="noopener">${l.title}</a><div class="meta">${l.url}<br/>${l.tags.map(t=>`#${t}`).join(" ")}</div></div><button type="button" class="del" data-id="${l.id}">✕</button></li>`).join("")||`<li style="justify-content:center;color:var(--muted)">No links</li>`;
}
document.getElementById("form").onsubmit=e=>{
  e.preventDefault();
  const title=document.getElementById("title").value.trim();
  const url=document.getElementById("url").value.trim();
  const tags=document.getElementById("tags").value.split(",").map(t=>t.trim().toLowerCase()).filter(Boolean);
  links.unshift({id:Date.now(),title,url,tags}); save(); e.target.reset(); render();
};
tagCloud.onclick=e=>{ const b=e.target.closest("[data-tag]"); if(!b) return; activeTag=b.dataset.tag||null; render(); };
list.onclick=e=>{ const b=e.target.closest(".del"); if(!b) return; links=links.filter(l=>l.id!=b.dataset.id); save(); render(); };
q.oninput=render; render();
