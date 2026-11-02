import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, RefreshControl } from 'react-native';
import { Button, Card, ErrorText, Loading, Screen, StatusPill, T, Title } from '../components/ui';
import { api } from '../lib/api';
import { listQueued, onOutboxChange, removeQueued, retryQueued } from '../lib/outbox';

export default function MyReports() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [queued, setQueued] = useState([]);

  const load = useCallback(() => api('/complaints/mine').then(({ data }) => { setItems(data); setError(null); }).catch(setError), []);
  const loadQueued = useCallback(() => listQueued().then(setQueued), []);
  useFocusEffect(useCallback(() => { load(); loadQueued(); return onOutboxChange(loadQueued); }, [load, loadQueued]));

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}>
      <Title sub="Pull down to refresh.">My reports</Title>
      <Button title="+ Report a new issue" onPress={() => router.navigate('/report')} />
      {queued.map((item) => (
        <Card key={item.id}>
          <T bold>{item.fields?.title || 'Untitled report'} · {item.failed ? 'Needs review' : 'Waiting to sync'}</T>
          {item.lastError && <T style={{ color: '#b91c1c' }}>{item.lastError}</T>}
          <Button title="Try again" onPress={async () => { await retryQueued(item.id); await loadQueued(); }} />
          <Button title="Remove from this device" onPress={async () => { await removeQueued(item.id); await loadQueued(); }} />
        </Card>
      ))}
      <ErrorText error={error} />
      {!items && !error && <Loading />}
      {items?.length === 0 && <Card><T>No reports yet. Spotted a pothole or blocked drain? Report it.</T></Card>}
      {items?.map((c) => (
        <Pressable key={c._id} onPress={() => router.push(`/complaint/${c._id}`)} accessibilityRole="link">
          <Card>
            <StatusPill status={c.status} />
            <T bold>{c.title}</T>
            <T muted size={12}>{c.referenceId} · {new Date(c.createdAt).toLocaleDateString()} · {c.category}</T>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}
