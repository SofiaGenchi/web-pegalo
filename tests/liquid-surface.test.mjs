import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const { outputText } = ts.transpileModule(await readFile(new URL('../app/sections/liquid-surface.ts', import.meta.url), 'utf8'), {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});
const { liquidSurface } = await import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'));
await test('liquid stays finite through descent and reverse on desktop and mobile',()=>{
  for (const [w,h,y,source] of [[1280,760,470,220],[390,680,450,200]]) {
    for(let i=0;i<=100;i++) {
      const p=i/100;
      const shape=liquidSurface(w,h,w/2,y,source,p,1.4);
      assert.equal(/NaN|Infinity/.test(shape.body),false);
      assert.deepEqual(shape,liquidSurface(w,h,w/2,y,source,p,1.4));
      if(p===0) { assert.equal(shape.body,''); continue; }
      const coordinates=shape.body.match(/-?\d+(?:\.\d+)?/g).map(Number);
      for(let k=1;k<coordinates.length;k+=2) assert.ok(Number.isFinite(coordinates[k]));
    }
    assert.equal(liquidSurface(w,h,w/2,y,source,1,0).edge,'');
    assert.equal(liquidSurface(w,h,w/2,y,source,1,0).body,liquidSurface(w,h,w/2,y,source,1,20).body);
  }
});
await test('one cubic silhouette stays connected and covers the panel at completion',()=>{
  for(const [w,h] of [[1280,830],[390,760]]) {
    for(let step=1;step<=100;step++) {
      const s=liquidSurface(w,h,w/2,580,200,step/100,0);
      assert.equal((s.body.match(/M/g)||[]).length,1);
      assert.equal((s.body.match(/C/g)||[]).length,32);
      assert.equal(/[ALHV]/.test(s.body),false);
      assert.equal('pool' in s,false);
    }
    // Sample the actual final cubic outline and check each corner is inside.
    const numbers=liquidSurface(w,h,w/2,580,200,1,0).body.match(/-?\d+(?:\.\d+)?/g).map(Number);
    const points=[]; let start=[numbers[0],numbers[1]];
    for(let i=2;i<numbers.length;i+=6) {
      const c1=numbers.slice(i,i+2),c2=numbers.slice(i+2,i+4),end=numbers.slice(i+4,i+6);
      for(let j=0;j<30;j++) {const t=j/30;points.push([0,1].map(k=>(1-t)**3*start[k]+3*(1-t)**2*t*c1[k]+3*(1-t)*t*t*c2[k]+t**3*end[k]));}
      start=end;
    }
    for(const [x,y] of [[0,0],[w,0],[w,h],[0,h]]) {
      let inside=false;
      for(let i=0,j=points.length-1;i<points.length;j=i++) {
        const [xi,yi]=points[i],[xj,yj]=points[j];
        if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;
      }
      assert.ok(inside);
    }
  }
});
await test('expansion originates at the CTA and advances on all four sides',()=>{
  for(const [w,h] of [[1280,830],[390,760]]) {
    const cx=w/2,cy=h*.6;
    const values=liquidSurface(w,h,cx,cy,200,.3,0,58).body.match(/-?\d+(?:\.\d+)?/g).map(Number);
    const xs=values.filter((_,i)=>i%2===0),ys=values.filter((_,i)=>i%2===1);
    assert.ok(Math.min(...xs)<cx-100 && Math.max(...xs)>cx+100);
    assert.ok(Math.min(...ys)<cy-29 && Math.max(...ys)>cy+29);
  }
});
