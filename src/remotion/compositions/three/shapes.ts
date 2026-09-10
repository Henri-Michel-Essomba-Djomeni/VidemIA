export type ShapePoint = [number, number, number];

export function shapeSphere(i: number, count: number): ShapePoint {
  const y = 1 - (i / (count - 1)) * 2;
  const radiusAtY = Math.sqrt(1 - y * y);
  const theta = i * 2.399963;
  const r = 1.7;
  return [Math.cos(theta) * radiusAtY * r, y * r, Math.sin(theta) * radiusAtY * r];
}

export function shapeTorus(i: number, count: number): ShapePoint {
  const u = (i / count) * Math.PI * 2 * 9;
  const v = (i / count) * Math.PI * 2;
  const R = 1.5;
  const tube = 0.55;
  return [
    (R + tube * Math.cos(v)) * Math.cos(u),
    tube * Math.sin(v),
    (R + tube * Math.cos(v)) * Math.sin(u),
  ];
}

export function shapeAtom(i: number, count: number): ShapePoint {
  const nucleusCount = Math.floor(count * 0.12);
  if (i < nucleusCount) {
    const p = shapeSphere(i, nucleusCount);
    return [p[0] * 0.22, p[1] * 0.22, p[2] * 0.22];
  }
  const idx = i - nucleusCount;
  const remaining = count - nucleusCount;
  const ring = idx % 3;
  const t = (idx / remaining) * Math.PI * 2 * 6;
  const r = 1.8;
  const tilts = [0, Math.PI / 3, -Math.PI / 3];
  const x = Math.cos(t) * r;
  const y = Math.sin(t) * r * 0.35;
  const z = Math.sin(t) * r * 0.15;
  const tilt = tilts[ring];
  return [x, y * Math.cos(tilt) - z * Math.sin(tilt), y * Math.sin(tilt) + z * Math.cos(tilt)];
}

export function shapeHelix(i: number, count: number): ShapePoint {
  const strand = i % 2;
  const t = (i / count) * Math.PI * 8;
  const r = 1.1;
  const y = ((i / count) * 2 - 1) * 2.2;
  const angle = t + strand * Math.PI;
  return [Math.cos(angle) * r, y, Math.sin(angle) * r];
}

export function shapeSpiral(i: number, count: number): ShapePoint {
  const arms = 3;
  const arm = i % arms;
  const t = i / count;
  const angle = t * Math.PI * 6 + (arm * (Math.PI * 2)) / arms;
  const r = t * 2.3;
  const y = Math.sin(t * Math.PI * 2 + arm) * 0.3;
  return [Math.cos(angle) * r, y, Math.sin(angle) * r];
}

export function shapeGrid(i: number, count: number): ShapePoint {
  const side = Math.round(Math.cbrt(count));
  const gap = 2.5 / side;
  const xi = i % side;
  const yi = Math.floor(i / side) % side;
  const zi = Math.floor(i / (side * side)) % side;
  return [(xi - side / 2) * gap, (yi - side / 2) * gap, (zi - side / 2) * gap];
}

export const SHAPE_BY_THEME = {
  sphere: shapeSphere,
  torus: shapeTorus,
  atom: shapeAtom,
  helix: shapeHelix,
  spiral: shapeSpiral,
  grid: shapeGrid,
} as const;

export const COLOR_BY_THEME = {
  sphere: "#2ea5ff",
  torus: "#5b8def",
  atom: "#22d3ee",
  helix: "#34e2b8",
  spiral: "#c084fc",
  grid: "#7c5cff",
} as const;