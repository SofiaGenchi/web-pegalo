import { products, productFamilies, type Product } from './products';
export type ManagedProduct = Product & {
  image?: string;
  technicalPdf?: string;
  family?: string;
  active?: boolean;
};
export type Distributor = {
  id: string;
  name: string;
  address: string;
  locality: string;
  province: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  active: boolean;
};
export type SiteContent = {
  products: ManagedProduct[];
  distributors: Distributor[];
};
export const defaultContent: SiteContent = {
  products: products.map((p) => ({
    ...p,
    active: true,
    image: `/productos/${p.id}.png`,
    technicalPdf: p.id === 'acetica' ? '/fichas/silicona-acetica.pdf' : '',
    family: productFamilies.find((f) => f.ids.includes(p.id))?.name || '',
  })),
  distributors: [],
};
const text = (v: unknown, max: number, required = true): v is string =>
  typeof v === 'string' &&
  v.length <= max &&
  (!required || v.trim().length > 0);
const id = (v: unknown) =>
  typeof v === 'string' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(v);
const file = (v: unknown, image = false) =>
  typeof v === 'string' &&
  (v === '' ||
    (image
      ? /^\/productos\/[a-z0-9-]+\.png$/.test(v)
      : v === '/fichas/silicona-acetica.pdf') ||
    new RegExp(
      '^/api/admin/files/[a-f0-9-]{36}\\.' +
        (image ? '(png|jpg|webp)' : 'pdf') +
        '$',
    ).test(v));
export function validateContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== 'object') return false;
  const v = value as SiteContent;
  if (
    !Array.isArray(v.products) ||
    !Array.isArray(v.distributors) ||
    v.products.length > 300 ||
    v.distributors.length > 500
  )
    return false;
  if (
    new Set(v.products.map((p) => p?.id)).size !== v.products.length ||
    new Set(v.distributors.map((d) => d?.id)).size !== v.distributors.length
  )
    return false;
  return (
    v.products.every(
      (p) =>
        p &&
        id(p.id) &&
        text(p.name, 150) &&
        ['Pegalo', 'Artesanato', 'Instalador'].includes(p.line) &&
        Array.isArray(p.lines) &&
        p.lines.length > 0 &&
        p.lines.length <= 3 &&
        p.lines.every((l) =>
          ['Pegalo', 'Artesanato', 'Instalador'].includes(l),
        ) &&
        text(p.size, 150) &&
        text(p.use, 3000) &&
        text(p.colors, 300) &&
        typeof p.active === 'boolean' &&
        file(p.image, true) &&
        file(p.technicalPdf) &&
        productFamilies.some((f) => f.name === p.family),
    ) &&
    v.distributors.every(
      (d) =>
        d &&
        id(d.id) &&
        text(d.name, 150) &&
        text(d.address, 200) &&
        text(d.locality, 100) &&
        text(d.province, 100) &&
        Number.isFinite(d.latitude) &&
        d.latitude >= -55.5 &&
        d.latitude <= -21.5 &&
        Number.isFinite(d.longitude) &&
        d.longitude >= -73.7 &&
        d.longitude <= -53.5 &&
        text(d.phone, 40, false) &&
        /^[+\d\s()-]*$/.test(d.phone) &&
        text(d.email, 150, false) &&
        (!d.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) &&
        typeof d.active === 'boolean',
    )
  );
}
