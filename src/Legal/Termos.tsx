import PaginaLegal, { Secao } from "./PaginaLegal";

function Termos() {
  return (
    <PaginaLegal titulo="Termos de Uso" atualizadoEm="10 de setembro de 2026">
      <Secao titulo="O que é o Braz">
        <p>
          O Braz é um assistente de estudo que funciona durante a aula. Você
          escreve uma dúvida da matéria e ele ajuda você a entender aquilo.
        </p>
        <p>
          Ele é um projeto de extensão universitária feito para o Colégio
          Estadual Umbelina Braz Gomides. Não é um produto de empresa nem um
          serviço do governo.
        </p>
      </Secao>

      <Secao titulo="Quem pode usar">
        <p>
          Alunos da turma que receberam o código de acesso, e as professoras da
          escola. Cada pessoa usa a própria conta.
        </p>
      </Secao>

      <Secao titulo="A professora recebe um relatório">
        <p>
          Isto é o mais importante desta página. No fim de cada aula, o Braz
          escreve um resumo curto da sua conversa com ele e entrega para a
          professora daquela disciplina.
        </p>
        <p>
          O resumo diz quais assuntos você trouxe, se a dúvida foi esclarecida e
          onde estava a dificuldade. Escreva sabendo disso.
        </p>
      </Secao>

      <Secao titulo="Ele não dá a resposta pronta">
        <p>
          O Braz não resolve exercício por você e não entrega resultado. Isso não
          é defeito nem falta de capacidade: ele foi feito assim de propósito,
          porque copiar resposta não ensina nada.
        </p>
        <p>
          Ele explica o que você precisa saber para chegar sozinho, aponta onde
          está o erro e responde perguntas de consulta, como o que significa uma
          palavra ou qual é a fórmula. Insistir não muda isso.
        </p>
      </Secao>

      <Secao titulo="Só funciona com aula aberta">
        <p>
          O Braz responde apenas enquanto a professora tiver uma aula aberta.
          Fora disso o chat fica bloqueado, e a professora pode pausar o
          atendimento a qualquer momento durante a aula.
        </p>
        <p>
          Ele também responde apenas sobre a matéria daquela aula. Dúvida de
          outra disciplina deve ser levada para a aula correspondente.
        </p>
      </Secao>

      <Secao titulo="O que não fazer">
        <p>
          Não empreste sua conta nem use a de outra pessoa. Não tente fazer o
          Braz mudar de comportamento, ignorar as regras dele ou fingir ser outra
          coisa. Não escreva ofensa nem palavrão.
        </p>
        <p>
          O uso do Braz é acompanhado pela escola como qualquer outra atividade
          de sala.
        </p>
      </Secao>

      <Secao titulo="O Braz pode errar">
        <p>
          Ele é um programa de inteligência artificial e pode dar uma explicação
          errada. Se algo parecer estranho ou não bater com o que a professora
          falou, confie na professora e pergunte para ela.
        </p>
      </Secao>

      <Secao titulo="Disponibilidade">
        <p>
          Este é um projeto acadêmico rodando em serviços gratuitos e pagos por
          conta própria. Ele pode ficar fora do ar, ficar lento ou ser
          interrompido, inclusive no fim do ano letivo.
        </p>
      </Secao>

      <Secao titulo="Contato">
        <p>
          Dúvida, problema ou pedido sobre os seus dados:
          projetobraz.umbelina@gmail.com.
        </p>
      </Secao>
    </PaginaLegal>
  );
}

export default Termos;
