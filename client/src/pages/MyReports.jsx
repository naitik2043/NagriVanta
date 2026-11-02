import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { CategoryBadge, Empty, ErrorBox, PageTitle, Spinner, StatusBadge } from '../components/ui';
import { usePrefs } from '../context/PrefsContext';
import { api, imageUrl } from '../services/api';
import { fmtDay } from '../utils/format';
import { listQueued, removeQueued, retryQueued } from '../utils/offlineQueue';

export default function MyReports() {
  const { t } = usePrefs();
  const [items, setItems] = useState(null);
  const [meta, setMeta] = useState({ page: 1, total: 0, limit: 20 });
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [queued, setQueued] = useState([]);

  const refreshQueued = () => listQueued().then(setQueued);
  useEffect(() => {
    refreshQueued();
    window.addEventListener('outbox:changed', refreshQueued);
    return () => window.removeEventListener('outbox:changed', refreshQueued);
  }, []);

  useEffect(() => {
    api('/complaints/mine', { query: { page } }).then(({ data, meta: m }) => { setItems(data); setMeta(m); }).catch(setError);
  }, [page]);

  return (
    <>
      <PageTitle title={t('mine.title')} subtitle={t('mine.sub')} actions={<Link to="/report" className="btn-primary">{t('mine.new')}</Link>} />
      {queued.length > 0 && (
        <section className="card mb-5 p-4" aria-labelledby="queued-reports-title">
          <h2 id="queued-reports-title" className="text-lg font-semibold">Waiting to sync ({queued.length})</h2>
          <p className="mb-3 mt-1 text-sm text-slate-600 dark:text-slate-300">These reports stay on this device until they sync or you remove them.</p>
          <ul className="space-y-3">
            {queued.map((item) => (
              <li key={item.id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                <p className="font-medium">{item.fields?.title || 'Untitled report'}</p>
                {item.lastError && <p role="alert" className="mt-1 text-sm text-red-700 dark:text-red-300">Needs review: {item.lastError}</p>}
                <div className="mt-3 flex gap-2">
                  <button type="button" className="btn-secondary" onClick={async () => { await retryQueued(item.id); await refreshQueued(); }}>Try again</button>
                  <button type="button" className="btn-ghost" onClick={async () => { await removeQueued(item.id); await refreshQueued(); }}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      <ErrorBox error={error} />
      {!items && !error && <Spinner />}
      {items?.length === 0 && <Empty title={t('mine.empty')}>Spotted a pothole or overflowing drain? <Link className="font-semibold text-brand-700" to="/report">Report it</Link>.</Empty>}
      {items?.length > 0 && (
        <ul className="space-y-3">
          {items.map((c) => (
            <li key={c._id}>
              <Link to={`/complaints/${c._id}`} className="card flex items-center gap-4 p-4 transition hover:border-brand-500">
                {c.images?.[0] && <img src={imageUrl(c.images[0])} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" loading="lazy" />}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><StatusBadge status={c.status} /><CategoryBadge category={c.category} /></div>
                  <p className="mt-1 truncate font-semibold">{c.title}</p>
                  <p className="text-xs text-slate-500">{c.referenceId} · {fmtDay(c.createdAt)}{c.ward ? ` · ${c.ward}` : ''}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
      {meta.total > meta.limit && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button type="button" className="btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="text-sm">Page {page} of {Math.ceil(meta.total / meta.limit)}</span>
          <button type="button" className="btn-secondary" disabled={page * meta.limit >= meta.total} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </>
  );
}
