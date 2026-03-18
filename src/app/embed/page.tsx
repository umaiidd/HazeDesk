// src/app/embed/page.tsx
import EmbedClient from '@/components/EmbedClient'
import { getSession } from '@/lib/getSession'

export default async function page() {
  const session = await getSession()
  return (
    <div>
      <EmbedClient
        ownerId={session?.user?.id ?? ""}
        email={session?.user?.email ?? ""}
      />
    </div>
  )
}