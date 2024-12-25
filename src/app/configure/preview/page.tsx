import { db } from '@/db';
import { notFound } from 'next/navigation';
import DesignPreview from './DesignPreview';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const id = typeof resolvedSearchParams.id === 'string' ? resolvedSearchParams.id : null;

  if (!id) {
    return notFound();
  }

  try {
    const configuration = await db.configuration.findUnique({
      where: { id },
    });

    if (!configuration) {
      return notFound();
    }

    return <DesignPreview configuration={configuration} />;
  } catch (error) {
    console.error('Error fetching configuration:', error);
    return notFound();
  }
};

export default Page;