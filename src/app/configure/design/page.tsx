import { db } from '@/db'
import { notFound } from 'next/navigation'
import DesignConfigurator from './DesignConfigurator'

type ConfigurePageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

const ConfigurePage = async (props: ConfigurePageProps) => {
  const searchParams = await props.searchParams;
  const { id } = searchParams;

  if (!id || typeof id !== 'string') {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) {
    return notFound();
  }

  const { imageUrl, width, height } = configuration;

  return (
    <DesignConfigurator
      configId={configuration.id}
      imageDimensions={{ width, height }}
      imageUrl={imageUrl}
    />
  );
};

export default ConfigurePage;