/* The wave came out of Haikei as a 600x900 path and was normalised here, so the
clip follows the card whatever its size instead of being tied to those pixels. */
function OndaBraz() {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        <clipPath id="ondaBraz" clipPathUnits="objectBoundingBox">
          <path d="M0.3100 0.0000L1.0000 0.0000L1.0000 1.0000L0.3300 1.0000C0.3200 0.9950,0.2867 0.9850,0.2700 0.9700C0.2533 0.9550,0.2400 0.9350,0.2300 0.9100C0.2200 0.8850,0.2150 0.8517,0.2100 0.8200C0.2050 0.7883,0.2083 0.7483,0.2000 0.7200C0.1917 0.6917,0.1783 0.6700,0.1600 0.6500C0.1417 0.6300,0.1117 0.6183,0.0900 0.6000C0.0683 0.5817,0.0450 0.5617,0.0300 0.5400C0.0150 0.5183,0.0033 0.4967,0.0000 0.4700C0.0000 0.4433,0.0000 0.4083,0.0100 0.3800C0.0200 0.3517,0.0383 0.3250,0.0600 0.3000C0.0817 0.2750,0.1150 0.2533,0.1400 0.2300C0.1650 0.2067,0.1917 0.1850,0.2100 0.1600C0.2283 0.1350,0.2333 0.1067,0.2500 0.0800C0.2667 0.0533,0.3000 0.0133,0.3100 0.0000Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default OndaBraz;
