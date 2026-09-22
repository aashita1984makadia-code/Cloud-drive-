const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const api=async(url,opt={})=>{let r=await fetch(url,{credentials:"include",...opt});let x=await r.json().catch(()=>({success:false,message:"Invalid response"}));if(r.status===401){location="/login.html";throw Error("Authentication required")}if(!r.ok||x.success===false)throw Error(x.message||"Request failed");return x};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const size=n=>{if(!n)return"0 B";let u=["B","KB","MB","GB","TB"],i=Math.floor(Math.log(n)/Math.log(1024));return(n/1024**i).toFixed(i?1:0)+" "+u[i]};
const icon=f=>f.mimeType?.startsWith("image/")?"🖼️":f.mimeType?.startsWith("video/")?"🎬":f.mimeType?.startsWith("audio/")?"🎵":f.mimeType==="application/pdf"?"📕":f.mimeType?.includes("zip")?"🗜️":"📄";
let state={folder:null,view:"grid"};
async function boot(){
 try{let me=await api("/api/users/me");render(me.data.user);await load();}catch(e){}
}
function render(user){
 document.body.innerHTML=`<div class="app"><aside class="sidebar" id="side"><div class="brand">☁️ CloudDrive</div><div class="nav">
 <a class="active" href="/">📁 My Drive</a><button onclick="loadRecent()">🕘 Recent</button><button onclick="loadStarred()">⭐ Starred</button><button onclick="showTrash()">🗑️ Trash</button><button onclick="showStorage()">💾 Storage</button>${user.role==="admin"?'<button onclick="showAdmin()">🛡️ Admin</button>':""}
 <button onclick="toggleDark()">🌙 Theme</button><button onclick="logout()">↪️ Logout</button></div></aside>
 <section class="main"><header class="topbar"><button class="btn secondary mobile-only" onclick="side.classList.toggle('open')">☰</button><input id="search" class="search" placeholder="Search files and folders…" oninput="search(this.value)"><span class="muted">${esc(user.name)}</span></header><main class="content" id="content"></main></section></div>`;
}
async function load(){
 let x=await api("/api/files?folder="+(state.folder||""));let c=$("#content");
 c.innerHTML=`<div class="actions"><button class="btn primary" onclick="pickFiles()">⬆ Upload</button><button class="btn secondary" onclick="newFolder()">＋ Folder</button><button class="btn secondary" onclick="state.view=state.view==='grid'?'list':'grid';load()">▦ View</button><div class="muted" style="align-self:center">My Drive${state.folder?` / ${esc(state.folder)}`:""}</div></div><div id="drop" class="upload-drop">Drag & drop files here or click Upload</div><br><div id="list" class="${state.view} grid"></div>`;
 const list=$("#list");x.data.folders.forEach(f=>list.insertAdjacentHTML("beforeend",folderCard(f)));x.data.files.forEach(f=>list.insertAdjacentHTML("beforeend",fileCard(f)));
 const drop=$("#drop");drop.onclick=pickFiles;drop.ondragover=e=>{e.preventDefault();drop.style.borderColor="#2563eb"};drop.ondrop=e=>{e.preventDefault();uploadFiles([...e.dataTransfer.files])};
}
function folderCard(f){return `<article class="card"><div onclick="openFolder('${f._id}')" style="cursor:pointer"><div class="icon">📁</div><b>${esc(f.name)}</b><div class="muted">Folder</div></div><div class="card-actions"><button class="btn secondary" onclick="renameFolder('${f._id}','${esc(f.name)}')">Rename</button><button class="btn secondary" onclick="deleteFolder('${f._id}')">Delete</button></div></article>`}
function fileCard(f){return `<article class="card"><div onclick="preview('${f._id}')" style="cursor:pointer"><div class="icon">${icon(f)}</div><b title="${esc(f.name)}">${esc(f.name)}</b><div class="muted">${size(f.size)} · ${esc(f.mimeType||"file")}</div></div><div class="card-actions"><button class="btn secondary" onclick="download('${f._id}')">Download</button><button class="btn secondary" onclick="renameFile('${f._id}','${esc(f.name)}')">Rename</button><button class="btn secondary" onclick="share('${f._id}')">Share</button><button class="btn secondary" onclick="star('${f._id}',${!f.starred})">${f.starred?"★":"☆"}</button><button class="btn danger" onclick="deleteFile('${f._id}')">Delete</button></div></article>`}
function pickFiles(){let i=document.createElement("input");i.type="file";i.multiple=true;i.onchange=()=>uploadFiles([...i.files]);i.click()}
async function uploadFiles(fs){
 for(const f of fs){let fd=new FormData();fd.append("files",f);if(state.folder)fd.append("folder",state.folder);let x=await api("/api/files/upload",{method:"POST",body:fd});toast(`${f.name}: ${x.message}`)}await load()
}
async function newFolder(){let n=prompt("Folder name");if(n)await api("/api/folders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n,parent:state.folder})});load()}
function openFolder(id){state.folder=id;load()}
async function renameFolder(id,n){let x=prompt("New folder name",n);if(x)await api("/api/folders/"+id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:x})});load()}
async function deleteFolder(id){if(confirm("Move folder to trash?")){await api("/api/folders/"+id,{method:"DELETE"});load()}}
async function renameFile(id,n){let x=prompt("New filename",n);if(x)await api("/api/files/"+id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:x})});load()}
async function deleteFile(id){if(confirm("Move file to trash?")){await api("/api/files/"+id,{method:"DELETE"});load()}}
async function star(id,v){await api("/api/files/"+id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({starred:v})});load()}
function download(id){location="/api/files/"+id+"/download"}
async function preview(id){let r=await api("/api/files/"+id+"/preview");let mime=r; /* authenticated fetch is required for preview */ let w=window.open();w.document.write(`<title>Preview</title><iframe style="position:fixed;inset:0;width:100%;height:100%;border:0" src="/api/files/${id}/preview"></iframe>`)}
async function share(id){let x=await api("/api/files/"+id+"/share",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({permission:"viewer",publicLink:true})});navigator.clipboard?.writeText(x.data.link);toast("Share link copied")}
async function search(q){if(!q){load();return}let x=await api("/api/search?q="+encodeURIComponent(q));$("#content").innerHTML=`<div class="actions"><button class="btn secondary" onclick="load()">← Back</button></div><div class="grid">${x.data.files.map(fileCard).join("")||"<div class='panel'>No files found.</div>"}</div>`}
async function loadRecent(){let x=await api("/api/activity");$("#content").innerHTML=`<h2>Recent activity</h2><div class="panel">${x.data.activity.map(a=>`<p>• ${esc(a.action)} ${esc(a.file?.name||"")} <span class="muted">${new Date(a.timestamp).toLocaleString()}</span></p>`).join("")||"No recent activity."}</div>`}
async function loadStarred(){let x=await api("/api/files?starred=true");$("#content").innerHTML=`<h2>Starred</h2><div class="grid">${x.data.files.map(fileCard).join("")||"<div class='panel'>Nothing starred.</div>"}</div>`}
async function showTrash(){let x=await api("/api/trash");$("#content").innerHTML=`<div class="actions"><button class="btn secondary" onclick="load()">← My Drive</button><button class="btn danger" onclick="emptyTrash()">Empty trash</button></div><div class="grid">${x.data.files.map(f=>`<article class="card"><div class="icon">${icon(f)}</div><b>${esc(f.name)}</b><div class="muted">${size(f.size)}</div></article>`).join("")||"<div class='panel'>Trash is empty.</div>"}</div>`}
async function emptyTrash(){if(confirm("Permanently delete trash?")){await api("/api/trash/empty",{method:"DELETE"});showTrash()}}
async function showStorage(){let x=await api("/api/storage"),d=x.data;$("#content").innerHTML=`<h2>Storage</h2><div class="panel"><p>${size(d.used)} / ${size(d.quota)} · ${d.percentage}% used</p><div class="bar"><i style="width:${d.percentage}%"></i></div><h3>Largest files</h3>${d.largest.map(f=>`<p>${esc(f.name)} — ${size(f.size)}</p>`).join("")}</div>`}
async function showAdmin(){let x=await api("/api/admin/stats"),d=x.data;$("#content").innerHTML=`<h2>Admin dashboard</h2><div class="grid"><div class="panel"><b>Users</b><h2>${d.totalUsers}</h2></div><div class="panel"><b>Files</b><h2>${d.totalFiles}</h2></div><div class="panel"><b>Storage</b><h2>${size(d.totalStorageUsed)}</h2></div><div class="panel"><b>Shared</b><h2>${d.sharedFiles}</h2></div></div>`}
async function logout(){await fetch("/api/auth/logout",{method:"POST"});location="/login.html"}
function toggleDark(){document.body.classList.toggle("dark");localStorage.theme=document.body.classList.contains("dark")?"dark":"light"}
function toast(t){let d=document.createElement("div");d.className="toast";d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2500)}
boot();
