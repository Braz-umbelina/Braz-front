type Props = {
  cor: string;
  variante: "aluno" | "professora";
};

/* Organic blobs instead of the card's wave: that path is a rectangle with one curved
side, so loose on the screen it shows the three straight edges. These are closed
shapes, curved all the way around, anchored off the corners so the middle stays clear.
Each area gets its own pair, otherwise only the colour would tell them apart. */
function FundoOnda({ cor, variante }: Props) {
  const formas =
    variante === "aluno"
      ? [
          {
            posicao: "-top-[22%] -left-[16%] w-[46vw] h-[80vh]",
            raio: "58% 42% 37% 63% / 44% 56% 44% 56%",
            opacidade: "opacity-[0.10] dark:opacity-[0.28]",
          },
          {
            posicao: "-bottom-[26%] -right-[12%] w-[38vw] h-[70vh]",
            raio: "40% 60% 62% 38% / 57% 40% 60% 43%",
            opacidade: "opacity-[0.08] dark:opacity-[0.20]",
          },
        ]
      : [
          {
            posicao: "-top-[28%] -right-[18%] w-[42vw] h-[86vh]",
            raio: "36% 64% 55% 45% / 62% 38% 62% 38%",
            opacidade: "opacity-[0.10] dark:opacity-[0.28]",
          },
          {
            posicao: "-bottom-[20%] -left-[14%] w-[40vw] h-[64vh]",
            raio: "65% 35% 44% 56% / 38% 61% 39% 62%",
            opacidade: "opacity-[0.08] dark:opacity-[0.20]",
          },
        ];

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {formas.map((forma, indice) => (
        <div
          key={indice}
          className={`absolute ${forma.posicao} ${cor} ${forma.opacidade}`}
          style={{ borderRadius: forma.raio }}
        />
      ))}
    </div>
  );
}

export default FundoOnda;
