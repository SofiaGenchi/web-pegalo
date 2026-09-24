const clamp = (n: number) => Math.max(0, Math.min(1, n));

/** A single rounded mass spreads directly from the CTA, controlled by scroll. */
export function liquidSurface(width: number, height: number, x: number, y: number,
  sourceWidth: number, progress: number, phase: number, sourceHeight = 58) {
  const p = clamp(progress);
  if (!p) return {body: '', edge: ''};
  // Direct scroll progress makes spreading visible immediately on contact.
  const spread = p;
  const reach = Math.hypot(Math.max(x,width-x),Math.max(y,height-y)) + 80;
  const rx = sourceWidth*.5 + (reach-sourceWidth*.5)*spread;
  const ry = sourceHeight*.5 + (reach-sourceHeight*.5)*spread;
  const irregularity = Math.sin(Math.PI*Math.sqrt(p))**2*.16;
  // Broad, slow lobes suggest a viscous material; no independent drop or pool.
  const points = Array.from({length:32},(_,i)=> {
    const angle=i*Math.PI/16;
    const lobe=1+irregularity*(Math.sin(angle*4+.6+p*.7)+.28*Math.sin(angle*7-1-p*.4)+.08*Math.sin(phase*.2));
    return [x+Math.cos(angle)*rx*lobe,y+Math.sin(angle)*ry*lobe];
  });
  const fmt=(point:number[])=>point.map(n=>n.toFixed(2)).join(' ');
  let contour=`M ${fmt(points[0])}`;
  for(let i=0;i<points.length;i++) {
    const prev=points[(i+31)%32],from=points[i],to=points[(i+1)%32],next=points[(i+2)%32];
    const c1=from.map((v,k)=>v+(to[k]-prev[k])/6);
    const c2=to.map((v,k)=>v-(next[k]-from[k])/6);
    contour+=` C ${fmt(c1)} ${fmt(c2)} ${fmt(to)}`;
  }
  return {body:contour+' Z',edge:p<.95?contour:''};
}
