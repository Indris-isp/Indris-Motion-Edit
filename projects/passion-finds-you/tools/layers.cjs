const { chromium } = require('playwright'); const fs=require('fs');
const B=process.argv[2]; const tl=JSON.parse(fs.readFileSync(B+'/timeline.json'));
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
for(const c of tl.captions){ if(!c.lines.length) continue;
 await pg.goto(`file://${B}/layers/cap.html?n=${Math.random()}#${encodeURIComponent(JSON.stringify(c))}`);await pg.evaluate(()=>window.ready);await pg.waitForTimeout(60);
 await pg.screenshot({path:`${B}/layers/${c.id}.png`,omitBackground:true});}
await b.close();})();
