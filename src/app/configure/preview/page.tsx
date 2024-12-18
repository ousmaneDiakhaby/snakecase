import { notFound } from "next/navigation";
import { db } from "@/db";
import DesignPreview from "@/app/configure/preview/design-preview";

type PageProps = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  // Résolution de la Promise pour obtenir les paramètres
  const resolvedSearchParams = await searchParams;
  const { id } = resolvedSearchParams;

  if (!id || typeof id !== "string") {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: {
      id,
    },
  });

  if (!configuration) {
    return notFound();
  }

  return <DesignPreview configuration={configuration} />;
}
