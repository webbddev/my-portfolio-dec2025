import React from "react";

export const SkiperuiCard = () => {
  // A condensed version of the ASCII art for the example
  const asciiArt = `
          --**++--+++++++**---
              --+++++****==--**
        ..:::::::::::-----:::+++**
      .:::::::::::::::::::::::*===--%%::==
   .::::::::::::::::::::::::::*===*::%%==%%%===.*
  .::::::::::::::::::::::::::+**++---:*=====--***==**::--*%::
 .::::::::::.--..-++--+++++**%@==-*=+-+++++==%%%==++---:.+%
.::::::::::::*++***======*+=%=***%*=*=*****+:+*:++---+
 .::::::::*--+*=*%=*%**+*%=+*%=*-**-:***...----:++-.*
.:::::::::--+*******%**+%****==--*****+=-::::::::-..:::--
:-+===*%=****+*%*+*%%+++++--*----------------:::::::::::
+-----+++=%%%%=**%*:*+-:..... .+.-.:::: :::--.....
.**===%%=*****+==--:::.. .....: .--:
::::::::--..*++::..
---:::--::-+-:
..::=-:..:.
--..::::.
*---::::.-:
::*---:::-+:
.::.-----*::
::..-----*:.
..::-----+:
:.---+++*..
--+++++++*.:
+++++++*=:
*****+=::
==*==::.
==@::
::.
  `;

  return (
    /* 1. Use 'w-full' and remove 'max-w' to let it fill the parent container */
    <div className="w-full min-h-screen bg-[#f0f0f0] flex flex-col items-center justify-start p-0 md:p-8">
      {/* 2. Main Container: w-full ensures it spans the screen */}
      <div className="w-full bg-white flex flex-col shadow-sm">
        {/* Top Section: ASCII Art */}
        <div className="bg-black w-full min-h-[60vh] md:min-h-[70vh] relative flex flex-col items-center justify-center p-4">
          {/* Header Controls */}
          <div className="absolute top-6 left-6 border border-zinc-700 p-2 rounded">
            <div className="w-4 h-4 border border-zinc-500"></div>
          </div>
          <div className="absolute top-6 right-6 flex gap-3 bg-zinc-900/80 px-3 py-1.5 rounded-md border border-white/10">
            <span className="text-zinc-400 text-xs">⛶</span>
            <span className="text-zinc-400 text-xs">↻</span>
            <span className="text-zinc-400 text-xs">{"</>"}</span>
            <span className="text-zinc-400 text-xs">⌘</span>
          </div>

          {/* 3. Responsive Text Size: Small on mobile, larger on desktop */}
          <pre className="font-mono text-white text-[0.4rem] leading-[0.4rem] sm:text-[0.6rem] sm:leading-[0.6rem] md:text-[0.8rem] md:leading-[0.8rem] lg:text-[1rem] lg:leading-[1rem] select-none text-center">
            {asciiArt}
          </pre>
        </div>

        {/* Bottom Section: Typography */}
        <div className="w-full bg-[#f5f5f0] p-8 md:p-12 lg:p-16 text-black font-mono">
          {/* 4. Fluid Typography: text-7xl for mobile, up to text-[15vw] for massive desktop impact */}
          <h1 className="text-7xl md:text-[12vw] font-black tracking-tighter leading-none mb-12 lowercase">
            skiperui.com
          </h1>

          <div className="grid grid-cols-2 gap-y-12 w-full text-xs md:text-lg font-bold uppercase tracking-tight">
            {/* Left Column */}
            <div className="flex flex-col gap-8">
              <div>
                <p>PUNJAB, INDIA</p>
                <p>AND ONLINE</p>
              </div>
              <div>
                <p className="text-zinc-500">ONLINE</p>
                <p>FREE</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-8 text-right">
              <div>
                <p>SEP 1, 2025</p>
                <p>THE MOOSA PIND</p>
              </div>
              <div>
                <p className="text-zinc-500">IN PERSON TICKETS</p>
                <p>$600</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkiperuiCard;
