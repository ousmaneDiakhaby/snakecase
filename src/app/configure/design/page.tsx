import {notFound} from "next/navigation";
import {db} from "@/db";
import DesignConfigurator from "@/app/configure/design/design-configurator";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const Page = async ({searchParams}: PageProps) => {
  const {id} = searchParams

  if (!id || typeof id !== 'string') {
    return notFound()
  }

  const configuration = await db.configuration.findUnique({
    where: {
      id: id
    }
  })

  if (!configuration) {
    return notFound()
  }

  const {imageUrl, width, height} = configuration

  return <DesignConfigurator
    configId={configuration.id}
    imageDimensions={{width, height}}
    imageUrl={imageUrl}
  />
}

export default Page