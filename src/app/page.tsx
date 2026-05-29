import { fetchCards } from '@/lib/slack';
import { PageClient } from '@/components/PageClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const cards = await fetchCards();
  return <PageClient items={cards} />;
}
