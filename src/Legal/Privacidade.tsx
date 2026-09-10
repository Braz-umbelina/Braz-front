import PaginaLegal, { Secao } from "./PaginaLegal";

function Privacidade() {
  return (
    <PaginaLegal
      titulo="Política de Privacidade"
      atualizadoEm="10 de setembro de 2026"
    >
      <Secao titulo="Quem é responsável">
        <p>
          O Braz é um projeto de extensão universitária conduzido por Geovani
          Eterno Rodrigues, aluno do Centro Universitário Internacional UNINTER,
          com autorização da direção do Colégio Estadual Umbelina Braz Gomides.
        </p>
        <p>
          Ele é quem responde pelos dados tratados aqui. Para qualquer dúvida ou
          pedido, o contato é projetobraz.umbelina@gmail.com.
        </p>
      </Secao>

      <Secao titulo="Por que pedimos esses dados">
        <p>
          O Braz existe para duas coisas: ajudar você a entender a matéria
          durante a aula, e dar à professora um retorno sobre onde a turma teve
          dificuldade. Seus dados são usados só para isso.
        </p>
        <p>
          A base para esse uso é o seu consentimento. Ao criar a conta e usar o
          Braz, você concorda com o que está escrito nesta página.
        </p>
        <p>
          Você pode mudar de ideia a qualquer momento e pedir a exclusão pelo
          e-mail de contato. Não usar o Braz, ou parar de usar, não afeta a sua
          nota nem a sua participação na aula.
        </p>
        <p>
          A atividade foi autorizada pela direção da escola. Se você tem menos
          de 18 anos, seus pais ou responsáveis também podem pedir a exclusão
          dos seus dados.
        </p>
      </Secao>

      <Secao titulo="O que guardamos sobre você">
        <p>
          Da sua conta: seu nome, seu e-mail e sua senha. A senha nunca é
          guardada como você digitou. Ela passa por um processo que a transforma
          em um código do qual não dá para voltar atrás, então nem quem
          administra o sistema consegue ler sua senha.
        </p>
        <p>
          Da sua conversa: tudo o que você escreve para o Braz e tudo o que ele
          responde, enquanto a aula estiver acontecendo.
        </p>
        <p>
          Do seu uso: um relatório por aula, gerado no fim dela. O que ele
          contém está explicado mais abaixo.
        </p>
      </Secao>

      <Secao titulo="O que acontece com a sua conversa">
        <p>
          A conversa fica guardada enquanto a aula está aberta. Quando a
          professora encerra a aula, o relatório é gerado e a conversa é
          apagada.
        </p>
        <p>
          Se a aula não for encerrada por algum motivo, a conversa é apagada
          sozinha depois de 15 dias e nenhum relatório é gerado.
        </p>
        <p>
          Depois disso, o Braz não mantém o histórico da conversa nos dados dele.
          O que fica no sistema é o relatório.
        </p>
      </Secao>

      <Secao titulo="O relatório e quem lê">
        <p>
          No fim da aula, o Braz escreve um resumo curto sobre a sua conversa
          com ele. Esse resumo tem três coisas: os assuntos da matéria que você
          trouxe, se a sua dúvida foi esclarecida ou não, e algumas frases
          descrevendo onde estava a dificuldade e como você reagiu à explicação.
        </p>
        <p>
          O relatório é escrito para a professora daquela disciplina, e só ela
          consegue abrir os relatórios das aulas dela. Nenhum outro aluno vê o
          seu.
        </p>
        <p>
          O relatório descreve o que você fez naquela conversa, nunca como você
          é. Ele não dá nota, não sugere diagnóstico e não compara você com
          ninguém.
        </p>
      </Secao>

      <Secao titulo="Quem mais tem acesso">
        <p>
          Para responder você, a sua mensagem é enviada para a inteligência
          artificial Gemini, do Google. O projeto usa o plano pago desse
          serviço, cujos termos preveem que o conteúdo enviado não é usado para
          melhorar os produtos e os modelos do Google.
        </p>
        <p>
          O Google pode manter registros dessas mensagens por um período, para
          segurança e para impedir uso abusivo do serviço. Isso segue as regras
          dele, não as nossas, e é o motivo de esta página falar apenas pelo que
          o Braz guarda.
        </p>
        <p>
          Além disso, o sistema funciona sobre serviços de terceiros que
          guardam ou transportam esses dados: Render, onde o programa roda, Neon,
          onde ficam as contas e os relatórios, Upstash, onde a conversa fica
          durante a aula, e Brevo, que envia os e-mails de código e de
          recuperação de senha.
        </p>
        <p>
          Fora isso, ninguém. Seus dados não são vendidos, não são usados para
          publicidade e não são compartilhados com nenhuma outra pessoa,
          empresa ou órgão público.
        </p>
      </Secao>

      <Secao titulo="Por quanto tempo fica guardado">
        <p>
          As conversas somem no fim da aula, ou em 15 dias se a aula não for
          encerrada.
        </p>
        <p>
          A sua conta e os relatórios ficam até o fim do ano letivo. Depois
          disso são apagados.
        </p>
      </Secao>

      <Secao titulo="Seus direitos">
        <p>
          Você pode pedir para ver o que está guardado sobre você, corrigir uma
          informação errada ou apagar sua conta e seus relatórios a qualquer
          momento. Basta escrever para projetobraz.umbelina@gmail.com a partir
          do e-mail que você usou para se cadastrar.
        </p>
        <p>
          Se você tem menos de 18 anos, seus pais ou responsáveis também podem
          fazer esse pedido.
        </p>
        <p>
          Quando uma conta é apagada, guardamos apenas o registro de que uma
          exclusão aconteceu naquela data, sem nome e sem e-mail, para termos
          controle do que foi feito.
        </p>
      </Secao>

      <Secao titulo="Segurança">
        <p>
          A sua senha é guardada de forma protegida e não pode ser lida nem
          recuperada por quem administra o sistema. A sua sessão expira sozinha
          depois de 8 horas, então um aparelho esquecido aberto não fica
          acessível para sempre.
        </p>
        <p>
          Ainda assim, a sua senha é sua. Não empreste para ninguém, nem para um
          colega.
        </p>
      </Secao>

      <Secao titulo="Mudanças nesta política">
        <p>
          Se algo mudar no funcionamento do Braz, esta página é atualizada e a
          data no topo muda junto.
        </p>
      </Secao>
    </PaginaLegal>
  );
}

export default Privacidade;
