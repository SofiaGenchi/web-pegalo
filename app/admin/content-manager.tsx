'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  Package,
  MapPin,
  FileText,
  LogOut,
  Plus,
  Save,
  ExternalLink,
} from 'lucide-react';
import {
  type SiteContent,
  type ManagedProduct,
  type Distributor,
} from '../content-policy';
import { productFamilies } from '../products';
import type { DocumentInfo } from '../downloads';
import DocumentManager from './document-manager';
import '../documents.css';
type Tab = 'products' | 'distributors' | 'documents';
export default function ContentManager({
  initial,
  initialRevision,
  documents,
  username,
}: {
  initial: SiteContent;
  initialRevision: number;
  documents: DocumentInfo[];
  username: string;
}) {
  const [content, setContent] = useState(initial);
  const [documentList, setDocumentList] = useState(documents);
  const [revision, setRevision] = useState(initialRevision);
  const [tab, setTab] = useState<Tab>('products');
  const [selected, setSelected] = useState(initial.products[0]?.id || '');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const product = content.products.find((p) => p.id === selected);
  const distributor = content.distributors.find((d) => d.id === selected);
  function editProduct(patch: Partial<ManagedProduct>) {
    setContent((c) => ({
      ...c,
      products: c.products.map((p) =>
        p.id === selected ? { ...p, ...patch } : p,
      ),
    }));
    setDirty(true);
  }
  function editDistributor(patch: Partial<Distributor>) {
    setContent((c) => ({
      ...c,
      distributors: c.distributors.map((d) =>
        d.id === selected ? { ...d, ...patch } : d,
      ),
    }));
    setDirty(true);
  }
  function switchTab(next: Tab) {
    setTab(next);
    setQuery('');
    setSelected(
      next === 'products'
        ? content.products[0]?.id || ''
        : content.distributors[0]?.id || '',
    );
  }
  function add() {
    const id = crypto.randomUUID();
    if (tab === 'products')
      setContent((c) => ({
        ...c,
        products: [
          ...c.products,
          {
            id,
            name: 'Nuevo producto',
            line: 'Pegalo',
            lines: ['Pegalo'],
            size: '',
            use: '',
            colors: '',
            url: null,
            image: '',
            technicalPdf: '',
            family: productFamilies[0].name,
            active: false,
          },
        ],
      }));
    else
      setContent((c) => ({
        ...c,
        distributors: [
          ...c.distributors,
          {
            id,
            name: 'Nuevo distribuidor',
            address: '',
            locality: '',
            province: '',
            latitude: -34.6,
            longitude: -58.55,
            phone: '',
            email: '',
            active: false,
          },
        ],
      }));
    setSelected(id);
    setDirty(true);
    setQuery('');
  }
  async function save() {
    setBusy(true);
    setMessage('');
    try {
      const r = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, revision }),
      });
      const v = (await r.json()) as {
        error?: string;
        revision: number;
        url: string;
      };
      if (!r.ok) throw new Error(v.error);
      setRevision(v.revision);
      setDirty(false);
      setMessage('Cambios publicados. Ya se muestran en la web.');
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : 'No se pudo guardar. Tus cambios se conservan en este panel.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function upload(
    file: File | undefined,
    field: 'image' | 'technicalPdf',
  ) {
    if (!file) return;
    setBusy(true);
    setMessage('');
    try {
      const ext = (
        {
          'application/pdf': 'pdf',
          'image/png': 'png',
          'image/jpeg': 'jpg',
          'image/webp': 'webp',
        } as Record<string, string>
      )[file.type];
      if (!ext || (field === 'image' ? ext === 'pdf' : ext !== 'pdf'))
        throw new Error('Seleccioná un archivo del formato indicado.');
      if (file.size > (field === 'image' ? 5 : 12) * 1024 * 1024)
        throw new Error('El archivo supera el tamaño permitido.');
      const r = await fetch(`/api/admin/files/${crypto.randomUUID()}.${ext}`, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      const v = (await r.json()) as {
        error?: string;
        revision: number;
        url: string;
      };
      if (!r.ok) throw new Error(v.error);
      editProduct({ [field]: v.url });
      setMessage(
        'Archivo cargado. Publicá los cambios para mostrarlo en la web.',
      );
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : 'No se pudo cargar el archivo.',
      );
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    if (
      dirty &&
      !window.confirm('Hay cambios sin publicar. ¿Querés salir y descartarlos?')
    )
      return;
    setBusy(true);
    try {
      const r = await fetch('/api/admin/logout', { method: 'POST' });
      if (!r.ok) throw new Error();
      setDirty(false);
      window.location.assign('/admin');
    } catch {
      setMessage('No se pudo cerrar la sesión. Intentá nuevamente.');
      setBusy(false);
    }
  }
  const rows = (
    tab === 'products' ? content.products : content.distributors
  ).filter((p) =>
    p.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          pegalo<span>ADMINISTRACIÓN</span>
        </div>
        <nav aria-label="Administración">
          {(
            [
              ['products', 'Productos', Package],
              ['distributors', 'Distribuidores', MapPin],
              ['documents', 'Precios y promociones', FileText],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              disabled={busy}
              aria-current={tab === key ? 'page' : undefined}
              onClick={() => switchTab(key)}
            >
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>
        <div className="admin-account">
          <small>{username}</small>
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink size={16} />
            Ver la web
          </a>
          <button onClick={logout} disabled={busy}>
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">CONTENIDO DE LA WEB</p>
            <h1>
              {tab === 'products'
                ? 'Productos'
                : tab === 'distributors'
                  ? 'Distribuidores'
                  : 'Precios y promociones'}
            </h1>
          </div>
          {tab !== 'documents' && (
            <button
              className="admin-primary"
              onClick={save}
              disabled={busy || !dirty}
            >
              <Save size={18} />
              {busy ? 'Guardando…' : 'Publicar cambios'}
            </button>
          )}
        </header>
        <output className="admin-status" aria-live="polite">
          {message ||
            (dirty
              ? 'Tenés cambios sin publicar.'
              : 'Todo al día. Los cambios se guardan al publicar.')}
        </output>
        {tab === 'documents' ? (
          <DocumentManager initial={documentList} onChange={setDocumentList} />
        ) : (
          <div className="admin-editor">
            <section className="admin-list">
              <div className="admin-list-heading">
                <strong>
                  {rows.length}{' '}
                  {tab === 'products' ? 'productos' : 'distribuidores'}
                </strong>
                <button
                  onClick={add}
                  disabled={busy}
                  aria-label={
                    tab === 'products'
                      ? 'Agregar producto'
                      : 'Agregar distribuidor'
                  }
                >
                  <Plus size={20} />
                </button>
              </div>
              <label className="admin-search">
                Buscar
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por nombre"
                />
              </label>
              <div className="admin-rows">
                {rows.map((p) => (
                  <button
                    disabled={busy}
                    key={p.id}
                    className={selected === p.id ? 'selected' : ''}
                    onClick={() => setSelected(p.id)}
                  >
                    <span>{p.name}</span>
                    <small>{p.active ? 'Publicado' : 'Oculto'}</small>
                  </button>
                ))}
                {rows.length === 0 && (
                  <p className="admin-empty">
                    {query
                      ? 'No hay coincidencias.'
                      : 'Agregá el primer distribuidor para mostrarlo en el mapa.'}
                  </p>
                )}
              </div>
            </section>
            <section className="admin-detail">
              <fieldset disabled={busy}>
                {tab === 'products' && product ? (
                  <>
                    <div className="admin-detail-title">
                      <h2>{product.name}</h2>
                      <label className="admin-toggle">
                        <input
                          type="checkbox"
                          checked={product.active}
                          onChange={(e) =>
                            editProduct({ active: e.target.checked })
                          }
                        />
                        Visible en la web
                      </label>
                    </div>
                    <label>
                      Nombre
                      <input
                        value={product.name}
                        maxLength={150}
                        onChange={(e) => editProduct({ name: e.target.value })}
                      />
                    </label>
                    <div className="admin-fields">
                      <label>
                        Marca principal
                        <select
                          value={product.line}
                          onChange={(e) =>
                            editProduct({
                              line: e.target.value,
                              lines: [
                                ...new Set([...product.lines, e.target.value]),
                              ],
                            })
                          }
                        >
                          {['Pegalo', 'Artesanato', 'Instalador'].map((l) => (
                            <option key={l}>{l}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Tipo de producto
                        <select
                          value={product.family}
                          onChange={(e) =>
                            editProduct({ family: e.target.value })
                          }
                        >
                          {productFamilies.map((f) => (
                            <option key={f.name}>{f.name}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="admin-line-options">
                      <span>Aparece en las líneas</span>
                      {['Pegalo', 'Artesanato', 'Instalador'].map((l) => (
                        <label key={l}>
                          <input
                            type="checkbox"
                            checked={product.lines.includes(l)}
                            disabled={product.line === l}
                            onChange={(e) =>
                              editProduct({
                                lines: e.target.checked
                                  ? [...product.lines, l]
                                  : product.lines.filter((x) => x !== l),
                              })
                            }
                          />
                          {l}
                        </label>
                      ))}
                    </div>
                    <label>
                      Presentación
                      <input
                        value={product.size}
                        maxLength={150}
                        onChange={(e) => editProduct({ size: e.target.value })}
                      />
                    </label>
                    <label>
                      Descripción y usos
                      <textarea
                        rows={4}
                        maxLength={3000}
                        value={product.use}
                        onChange={(e) => editProduct({ use: e.target.value })}
                      />
                    </label>
                    <label>
                      Colores / disponibilidad
                      <input
                        maxLength={300}
                        value={product.colors}
                        onChange={(e) =>
                          editProduct({ colors: e.target.value })
                        }
                      />
                    </label>
                    <div className="admin-fields">
                      <div className="admin-upload">
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={140}
                            height={110}
                            unoptimized
                          />
                        )}
                        <label>
                          Foto del producto
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(e) => {
                              void upload(e.target.files?.[0], 'image');
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <small>PNG, JPG o WebP. Hasta 5 MB.</small>
                      </div>
                      <div className="admin-upload">
                        <FileText size={28} />
                        <label>
                          Ficha técnica
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => {
                              void upload(e.target.files?.[0], 'technicalPdf');
                              e.target.value = '';
                            }}
                          />
                        </label>
                        <small>PDF. Hasta 12 MB.</small>
                        {product.technicalPdf && (
                          <>
                            <a
                              href={product.technicalPdf}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Descargar ficha actual
                            </a>
                            <button
                              type="button"
                              onClick={() => editProduct({ technicalPdf: '' })}
                            >
                              Quitar ficha
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                ) : tab === 'distributors' && distributor ? (
                  <>
                    <div className="admin-detail-title">
                      <h2>{distributor.name}</h2>
                      <label className="admin-toggle">
                        <input
                          type="checkbox"
                          checked={distributor.active}
                          onChange={(e) =>
                            editDistributor({ active: e.target.checked })
                          }
                        />
                        Visible en el mapa
                      </label>
                    </div>
                    {(
                      [
                        'name',
                        'address',
                        'locality',
                        'province',
                        'phone',
                        'email',
                      ] as const
                    ).map((key, i) => (
                      <label key={key}>
                        {
                          [
                            'Nombre comercial',
                            'Dirección',
                            'Localidad',
                            'Provincia',
                            'Teléfono (opcional)',
                            'Correo electrónico (opcional)',
                          ][i]
                        }
                        <input
                          type={key === 'email' ? 'email' : 'text'}
                          value={distributor[key]}
                          onChange={(e) =>
                            editDistributor({ [key]: e.target.value })
                          }
                        />
                      </label>
                    ))}
                    <div className="admin-fields">
                      <label>
                        Latitud
                        <input
                          type="number"
                          step="any"
                          min={-55.5}
                          max={-21.5}
                          value={distributor.latitude}
                          onChange={(e) =>
                            editDistributor({
                              latitude: e.target.valueAsNumber,
                            })
                          }
                        />
                      </label>
                      <label>
                        Longitud
                        <input
                          type="number"
                          step="any"
                          min={-73.7}
                          max={-53.5}
                          value={distributor.longitude}
                          onChange={(e) =>
                            editDistributor({
                              longitude: e.target.valueAsNumber,
                            })
                          }
                        />
                      </label>
                    </div>
                    <p className="admin-help">
                      Ingresá las coordenadas confirmadas del local, en grados
                      decimales. El mapa nacional muestra una ubicación
                      aproximada. Revisá las coordenadas sugeridas antes de
                      publicar.
                    </p>
                  </>
                ) : (
                  <div className="admin-empty">
                    <MapPin size={36} />
                    <h2>La red de distribuidores</h2>
                    <p>
                      Agregá los datos de un local y activá su visibilidad para
                      que aparezca en el mapa de Argentina.
                    </p>
                  </div>
                )}
              </fieldset>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
