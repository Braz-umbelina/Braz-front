type Props = {
  texto: string;
  tipo: "erro" | "aviso";
};

/* A line with an icon instead of a filled box: the message stays readable for as long
as the student needs it, without a card competing with the form above. */
function Alerta({ texto, tipo }: Props) {
  const erro = tipo === "erro";

  return (
    <div
      className={`mt-5 flex items-start gap-2.5 text-sm animate-fade-in ${
        erro ? "text-red-300" : "text-brand-acao"
      }`}
    >
      <i
        className={`mt-0.5 flex-shrink-0 ${
          erro ? "fa-solid fa-circle-exclamation" : "fa-solid fa-circle-info"
        }`}
      />
      <p className="leading-snug">{texto}</p>
    </div>
  );
}

export default Alerta;
