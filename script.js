let agenda =
JSON.parse(localStorage.getItem("agenda")) || [];

let historico =
JSON.parse(localStorage.getItem("historico")) || [];

document
.getElementById("btnAgendar")
.addEventListener("click", adicionar);

function pegar(id){
    return document.getElementById(id).value;
}

function adicionar(){

    const cliente = pegar("cliente").trim();
    const telefone = pegar("telefone").trim();
    const veiculo = pegar("veiculo").trim();
    const horario = pegar("horario");
    const servico = pegar("servico");
    const valor = Number(pegar("valor"));
    const observacao = pegar("observacao").trim();
    const pagamento = pegar("pagamento");

    if(
        !cliente ||
        !telefone ||
        !veiculo ||
        !horario
    ){
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    agenda.push({
        cliente,
        telefone,
        veiculo,
        horario,
        servico,
        valor,
        observacao,
        pagamento,
        dataCadastro:
        new Date().toLocaleDateString("pt-BR"),
        status:"Aguardando"
    });

    salvar();
    limpar();
    renderizar();
}

function renderizar(){

    const area =
    document.getElementById("agenda");

    area.innerHTML = "";

    let total = 0;

    agenda.sort(
        (a,b)=>
        a.horario.localeCompare(b.horario)
    );

    agenda.forEach((item,index)=>{

        total += item.valor;

        area.innerHTML += `

        <div class="item">

            <h3>${item.cliente}</h3>

            <p>📞 ${item.telefone}</p>

            <p>🚗 ${item.veiculo}</p>

            <p>⏰ ${item.horario}</p>

            <p>🧼 ${item.servico}</p>

            <p>💰 R$ ${item.valor.toFixed(2)}</p>

            <p>💳 ${item.pagamento}</p>

            <p>Status: ${item.status}</p>

            <div class="acoes">

                <button
                class="finalizar"
                onclick="finalizar(${index})">
                Finalizar
                </button>

                <button
                class="editar"
                onclick="editar(${index})">
                Editar
                </button>

                <button
                class="apagar"
                onclick="apagar(${index})">
                Apagar
                </button>

            </div>

        </div>

        `;
    });

    document.getElementById("quantidade")
    .innerText = agenda.length;

    document.getElementById("faturamento")
    .innerText =
    "R$ " + total.toFixed(2);

    const ticket =
    agenda.length
    ? (total / agenda.length).toFixed(2)
    : "0.00";

    document.getElementById("ticket")
    .innerText =
    "R$ " + ticket;

    const finalizados =
    document.getElementById("finalizados");

    if(finalizados){
        finalizados.innerText =
        historico.length;
    }

    const maisVendido =
    document.getElementById("maisVendido");

    if(maisVendido){
        maisVendido.innerText =
        servicoMaisVendido();
    }

    salvar();
}

function renderizarHistorico(){

    const area =
    document.getElementById("historico");

    area.innerHTML = "";

    historico.forEach((item,index)=>{

        area.innerHTML += `

        <div class="item">

            <h3>${item.cliente}</h3>

            <p>🚗 ${item.veiculo}</p>

            <p>🧼 ${item.servico}</p>

            <p>💰 R$ ${item.valor.toFixed(2)}</p>

            <p>✅ Finalizado</p>

            <div class="acoes">

                <button
                class="editar"
                onclick="restaurar(${index})">
                Restaurar
                </button>

                <button
                class="apagar"
                onclick="apagarHistorico(${index})">
                Excluir
                </button>

            </div>

        </div>

        `;
    });
}

function finalizar(index){

    if(
        !confirm("Finalizar serviço?")
    ){
        return;
    }

    agenda[index].status =
    "Finalizado";

    historico.push(
        agenda[index]
    );

    agenda.splice(index,1);

    salvar();

    renderizar();
    renderizarHistorico();
}

function restaurar(index){

    if(
        !confirm("Restaurar para agenda?")
    ){
        return;
    }

    historico[index].status =
    "Aguardando";

    agenda.push(
        historico[index]
    );

    historico.splice(index,1);

    salvar();

    renderizar();
    renderizarHistorico();
}

function apagar(index){

    if(
        confirm("Deseja apagar?")
    ){

        agenda.splice(index,1);

        salvar();

        renderizar();
    }
}

function apagarHistorico(index){

    if(
        confirm("Excluir do histórico?")
    ){

        historico.splice(index,1);

        salvar();

        renderizarHistorico();
        renderizar();
    }
}

function editar(index){

    const novoNome =
    prompt(
        "Nome:",
        agenda[index].cliente
    );

    const novoValor =
    prompt(
        "Valor:",
        agenda[index].valor
    );

    if(novoNome){

        agenda[index].cliente =
        novoNome;

        agenda[index].valor =
        Number(novoValor);

        salvar();

        renderizar();
    }
}

function servicoMaisVendido(){

    const todos =
    [...agenda,...historico];

    if(todos.length === 0){
        return "Nenhum";
    }

    const contador = {};

    todos.forEach(item=>{

        contador[item.servico] =
        (contador[item.servico] || 0) + 1;

    });

    let vencedor = "";
    let maior = 0;

    for(let servico in contador){

        if(
            contador[servico] > maior
        ){
            maior =
            contador[servico];

            vencedor =
            servico;
        }
    }

    return vencedor;
}

function salvar(){

    localStorage.setItem(
        "agenda",
        JSON.stringify(agenda)
    );

    localStorage.setItem(
        "historico",
        JSON.stringify(historico)
    );
}

function limpar(){

    document
    .querySelectorAll("input")
    .forEach(campo=>{

        campo.value = "";

    });
}

const pesquisa =
document.getElementById("pesquisa");

if(pesquisa){

    pesquisa.addEventListener(
        "input",
        function(){

            const texto =
            this.value.toLowerCase();

            const itens =
            document.querySelectorAll(".item");

            itens.forEach(item=>{

                item.style.display =
                item.innerText
                .toLowerCase()
                .includes(texto)
                ? "block"
                : "none";

            });

        }
    );
}

renderizar();
renderizarHistorico();
