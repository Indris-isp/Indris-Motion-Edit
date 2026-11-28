const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
await p.goto('file://'+process.cwd()+'/stills.html');await p.waitForTimeout(500);
for(const id of ['s01','s02','s03','s06','s11','s13','s17','s21']){await (await p.$('#'+id)).screenshot({path:`out/${id}.jpg`,type:'jpeg',quality:86});}
await b.close();})();
