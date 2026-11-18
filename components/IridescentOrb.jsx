'use client';

// Forme 3D irisée (WebGL, sans librairie) : une goutte qui ondule et tourne,
// avec des reflets « film fin » arc-en-ciel. Se met en pause hors écran,
// suit légèrement la souris, et reste figée si l'utilisateur réduit les animations.
import { useEffect, useRef, useState } from 'react';

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uSpeed;

mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

float sdf(vec3 p){
  float t = uTime * uSpeed;
  p.xz *= rot(t * 0.35 + uMouse.x * 0.6);
  p.xy *= rot(t * 0.22 + uMouse.y * 0.4);
  float d = length(p) - 1.0;
  d += 0.13 * sin(p.x * 3.1 + t * 1.3) * sin(p.y * 2.7 + t * 1.1) * sin(p.z * 3.4 + t * 0.9);
  d += 0.05 * sin(p.x * 7.0 + t * 2.0) * sin(p.y * 6.0 - t * 1.7);
  return d * 0.8;
}

vec3 normalAt(vec3 p){
  const vec2 e = vec2(0.0015, -0.0015);
  return normalize(e.xyy * sdf(p + e.xyy) + e.yyx * sdf(p + e.yyx) + e.yxy * sdf(p + e.yxy) + e.xxx * sdf(p + e.xxx));
}

void main(){
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
  vec3 ro = vec3(0.0, 0.0, 3.2);
  vec3 rd = normalize(vec3(uv * 0.92, -1.9));

  float t = 0.0, dmin = 1e3;
  bool hit = false;
  for (int i = 0; i < 72; i++){
    float d = sdf(ro + rd * t);
    dmin = min(dmin, d);
    if (d < 0.0015){ hit = true; break; }
    t += d;
    if (t > 6.0) break;
  }

  if (!hit){
    // halo doux autour de la forme (bord anti-crénelé + lueur)
    float glow = smoothstep(0.18, 0.0, dmin) * 0.22;
    gl_FragColor = vec4(vec3(0.75, 0.8, 1.0) * glow, glow);
    return;
  }

  vec3 p = ro + rd * t;
  vec3 n = normalAt(p);
  vec3 v = -rd;
  float fres = pow(1.0 - max(dot(n, v), 0.0), 2.2);

  // film fin : la couleur dépend de l'angle de vue, comme une bulle de savon
  float film = fres * 1.7 + dot(n, vec3(0.35, 0.55, 0.25)) * 0.9 + uTime * uSpeed * 0.06;
  vec3 irid = 0.5 + 0.5 * cos(6.28318 * (film + vec3(0.0, 0.33, 0.67)));
  irid = mix(irid, vec3(1.0), 0.18);

  vec3 L1 = normalize(vec3(-0.6, 0.8, 0.6));
  vec3 L2 = normalize(vec3(0.8, -0.3, 0.5));
  float diff = max(dot(n, L1), 0.0) * 0.6 + 0.45;
  float spec = pow(max(dot(reflect(-L1, n), v), 0.0), 48.0) * 1.3 + pow(max(dot(reflect(-L2, n), v), 0.0), 24.0) * 0.4;

  vec3 col = irid * diff + spec + fres * 0.45 * vec3(0.9, 0.95, 1.0);
  col = pow(col, vec3(0.92));
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

export default function IridescentOrb({ className = '', speed = 1 }) {
  const ref = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) { setFallback(true); return; }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { setFallback(true); return; }
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uSpeed = gl.getUniformLocation(prog, 'uSpeed');
    gl.uniform1f(uSpeed, speed);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0, visible = true, start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1 : 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    const draw = (now) => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.uniform1f(uTime, reduce ? 2.0 : (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const loop = (now) => {
      draw(now);
      if (visible && !reduce) raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => { resize(); if (reduce || !visible) draw(performance.now()); });
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting && !document.hidden;
      if (visible && !was && !reduce) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const onVis = () => {
      const was = visible;
      visible = !document.hidden;
      if (visible && !was && !reduce) raf = requestAnimationFrame(loop);
    };
    document.addEventListener('visibilitychange', onVis);

    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [speed]);

  if (fallback) return <div className={`irid-orb irid-orb-fallback ${className}`} aria-hidden="true" />;
  return <canvas ref={ref} className={`irid-orb ${className}`} aria-hidden="true" />;
}
