import geometry from './argentina-geometry.json';
export type ContactLocation = {
  id: string;
  name: string;
  type: 'office' | 'distributor';
  address: string;
  locality: string;
  province: string;
  point: number[];
  phones?: { label: string; href: string }[];
  email?: string;
};
export const contactLocations: ContactLocation[] = [
  {
    id: 'oficina-pegalo',
    name: 'Adhesivos y Selladores Pegalo',
    type: 'office',
    address: 'Asamblea 4355 · CP 1676',
    locality: 'Santos Lugares',
    province: 'Buenos Aires',
    point: geometry.point,
    phones: [
      {
        label: '+54 9 11 6417-4036 · WhatsApp',
        href: 'https://wa.me/541164174036',
      },
      { label: '0800-122-0975', href: 'tel:08001220975' },
    ],
    email: 'ventas@pegalo.com.ar',
  },
];
