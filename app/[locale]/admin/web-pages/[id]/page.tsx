import { notFound } from 'next/navigation'

import { getWebPageById } from '@/lib/actions/web-page.actions'
import Link from 'next/link'
import WebPageForm from '../web-page-form'

type UpdateWebPageProps = {
  params: Promise<{
    id: string
  }>
}

const UpdateWebPage = async (props: UpdateWebPageProps) => {
  const params = await props.params

  const { id } = params

  const webPage = await getWebPageById(id)
  if (!webPage) notFound()
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/web-pages'>Web Pages</Link>
        <span className='mx-1'>›</span>
        <Link href={`/admin/web-pages/${webPage._id}`}>{webPage._id}</Link>
      </div>

      <div className='my-8'>
        <WebPageForm type='Update' webPage={webPage} webPageId={webPage._id} />
      </div>
    </main>
  )
}

export default UpdateWebPage
