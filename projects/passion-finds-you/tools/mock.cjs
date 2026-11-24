const { chromium } = require('playwright'); const fs=require('fs');
const U=process.argv[2]; const jobs=JSON.parse(fs.readFileSync(U+'/mk/jobs.json'));
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
for(const j of jobs){const h=encodeURIComponent(JSON.stringify({...j,bg:`frames/${j.id}.jpg`}));
await pg.goto(`file://${U}/mk/mock.html?n=${Math.random()}#${h}`);await pg.evaluate(()=>window.ready);await pg.waitForTimeout(80);
await pg.screenshot({path:`${U}/mk/full_${j.id}.png`});}
await b.close();})();
