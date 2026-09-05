/* Traced from the mock and normalised, so the clip follows the card at any size.
It is a softer curve than the student one on purpose: the two areas share the
layout but should not look like the same screen. */
function OndaProfessora() {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        <clipPath id="ondaProfessora" clipPathUnits="objectBoundingBox">
          <path d="M0.3542 0.0000L1.0000 0.0000L1.0000 1.0000L0.0908 1.0000C0.0943 0.9833,0.1093 0.9333,0.1117 0.9000C0.1141 0.8667,0.1035 0.8333,0.1050 0.8000C0.1065 0.7667,0.1082 0.7333,0.1209 0.7000C0.1336 0.6667,0.1572 0.6333,0.1811 0.6000C0.2050 0.5667,0.2458 0.5333,0.2644 0.5000C0.2830 0.4667,0.2877 0.4333,0.2926 0.4000C0.2975 0.3667,0.2933 0.3333,0.2937 0.3000C0.2941 0.2667,0.2920 0.2333,0.2948 0.2000C0.2976 0.1667,0.3007 0.1333,0.3106 0.1000C0.3205 0.0667,0.3469 0.0167,0.3542 0.0000Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default OndaProfessora;
