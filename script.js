/* ============================= */
/* CONFIG LOGIN ADMIN */
/* ============================= */
const ADMIN_USER = "Desenvolvedor";
const ADMIN_PASS = "Taekwondo3028*";
let alunoAtual = null;

/* ============================= */
/* UTILITÁRIOS */
/* ============================= */
const $ = id => document.getElementById(id);
const mostrar = el => { if(el) el.style.display = "block"; }
const esconder = el => { if(el) el.style.display = "none"; }

/* ============================= */
/* LOGIN */
/* ============================= */
function verificarLogin(){
  const user = $("adminUser").value.trim();
  const pass = $("adminPass").value.trim();

  // LOGIN ADMIN
  if(user === ADMIN_USER && pass === ADMIN_PASS){
    esconder($("loginModal"));
    mostrar($("adminPanel"));
    renderListaAlunos();
    return;
  }

  // LOGIN ALUNO
  const alunos = getAlunos();
  const aluno = alunos.find(a => a.usuario === user && a.senha === pass);

  if(aluno){
    window.location.href = `treino.html?usuario=${encodeURIComponent(aluno.usuario)}`;
    return;
  }

  alert("Login ou senha incorretos");
}

/* ============================= */
/* ALUNOS */
/* ============================= */
function getAlunos(){ 
  return JSON.parse(localStorage.getItem("alunos") || "[]"); 
}
function setAlunos(lista){ 
  localStorage.setItem("alunos", JSON.stringify(lista)); 
}

/* ============================= */
/* CADASTRAR ALUNO */
/* ============================= */
function cadastrarAluno(){
  const usuario = $("novoUsuario").value.trim();
  const senha = $("novaSenha").value.trim();
  const telefone = $("novoTelefone").value.trim();

  if(!usuario || !senha || !telefone){
    alert("Preencha login, senha e telefone");
    return;
  }

  const alunos = getAlunos();

  if(alunos.some(a => a.usuario === usuario)){
    alert("Este login já existe");
    return;
  }

  if(alunos.some(a => a.senha === senha)){
    alert("Esta senha já está em uso");
    return;
  }

  alunos.push({ usuario, senha, telefone });
  setAlunos(alunos);

  $("novoUsuario").value = "";
  $("novaSenha").value = "";
  $("novoTelefone").value = "";

  renderListaAlunos();
}

/* ============================= */
/* REMOVER ALUNO */
/* ============================= */
function removerAluno(usuario){
  if(!confirm(`Deseja realmente remover o aluno ${usuario}?`)) return;
  const alunos = getAlunos().filter(a => a.usuario !== usuario);
  setAlunos(alunos);
  renderListaAlunos();
}

/* ============================= */
/* LISTA DE ALUNOS */
/* ============================= */
function renderListaAlunos(){
  const box = $("listaAlunos");
  const alunos = getAlunos();

  if(alunos.length === 0){
    box.innerHTML = `<p style='color:#fff'>Nenhum aluno cadastrado</p>`;
    return;
  }

  box.innerHTML = alunos.map(a => `
    <div class="border-bottom py-3">
      <div style="color:#fff;font-weight:600;">Login: ${a.usuario}</div>
      <div style="color:#fff;">Senha: ${a.senha}</div>
      <div style="color:#fff;">Telefone: ${a.telefone}</div>
      <div class="mt-2">
        <button class="btn btn-sm btn-outline-success me-2"
          onclick="enviarWhatsapp('${a.usuario}','${a.senha}','${a.telefone}')">
          Enviar WhatsApp
        </button>
        <button class="btn btn-sm btn-outline-light me-2"
          onclick="copiarAcesso('${a.usuario}','${a.senha}')">
          Copiar
        </button>
        <button class="btn btn-sm btn-outline-danger"
          onclick="removerAluno('${a.usuario}')">
          Remover
        </button>
      </div>
    </div>
  `).join("");
}

/* ============================= */
/* COPIAR ACESSO */
/* ============================= */
function copiarAcesso(usuario, senha){
  const texto = `Seu acesso ao Desafio 21 Dias:\n\nLogin: ${usuario}\nSenha: ${senha}\n\nAcesse o site e comece o treino 💪`;
  navigator.clipboard.writeText(texto).then(() => alert("Acesso copiado"));
}

/* ============================= */
/* ENVIAR WHATSAPP */
/* ============================= */
function enviarWhatsapp(usuario, senha, telefone){
  const texto = encodeURIComponent(
    `Seu acesso ao treino:\n\nLogin: ${usuario}\nSenha: ${senha}\n\nAcesse o site e comece o desafio 21 dias 💪`
  );
  window.open(`https://wa.me/${telefone}?text=${texto}`);
}

/* ============================= */
/* FECHAR TELAS */
/* ============================= */
function fecharAdmin(){
  esconder($("adminPanel"));
  mostrar($("loginModal"));
}
function fecharAluno(){
  esconder($("painelAluno"));
  window.history.back();
}

/* ============================= */
/* RECUPERAR ALUNO ATUAL */
/* ============================= */
function recuperarAlunoAtual(){
  const params = new URLSearchParams(window.location.search);
  alunoAtual = params.get("usuario");
  return alunoAtual;
}

/* ============================= */
/* PROGRESSO INDIVIDUAL */
/* ============================= */
function getProgresso(){
  return JSON.parse(localStorage.getItem("progresso_" + alunoAtual) || "{}");
}
function setProgresso(data){
  localStorage.setItem("progresso_" + alunoAtual, JSON.stringify(data));
}

/* ============================= */
/* BARRA DE PROGRESSO */
/* ============================= */
function atualizarProgresso(){
  const progresso = getProgresso();
  let dias = 0;
  for(let i=1;i<=21;i++){
    if(progresso[`dia${i}`]) dias++;
  }
  const porcentagem = (dias/21)*100;
  const barra = $("barraProgresso");
  const texto = $("textoProgresso");
  if(barra) barra.style.width = porcentagem + "%";
  if(texto) texto.innerText = `${dias} / 21 dias concluídos`;
}