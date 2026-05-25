import { fetchCards } from '@/lib/slack';
import { PageClient } from '@/components/PageClient';

export default async function Page() {
  const cards = await fetchCards();
  return <PageClient items={cards} />;
}
