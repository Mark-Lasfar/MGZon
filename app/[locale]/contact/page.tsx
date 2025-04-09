import { getMessages } from 'next-intl/server'
import ContactForm from '@/components/contact/ContactForm'
import RatingSystem from '@/components/contact/RatingSystem'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getSetting } from '@/lib/actions/setting.actions'

export default async function ContactPage() {
  const messages = await getMessages()
  const setting = await getSetting()

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="border-primary shadow-lg">
            <CardHeader>
              <h2 className="text-2xl font-bold">Send us a message</h2>
              <p className="text-muted-foreground">
                We'll respond within 24 hours
              </p>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          {/* Company Info & Rating */}
          <div className="space-y-8">
            <Card className="border-primary shadow-lg">
              <CardHeader>
                <h2 className="text-2xl font-bold">Our Information</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p>contact@mg-zon.vercel.app</p>
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p>{setting.site.phone || '+01212444617'}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p>{setting.site.address?.street || '123 Business Ave'}</p>
                  <p>{setting.site.address?.city || 'New York'}, {setting.site.address?.state || 'NY'} {setting.site.address?.zip || '10001'}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-lg">
              <CardHeader>
                <h2 className="text-2xl font-bold">Customer Ratings</h2>
                <div className="flex items-center">
                  <span className="text-3xl font-bold mr-2">9.0</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} filled={i < 4.5} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">(1M+ reviews)</span>
                </div>
              </CardHeader>
              <CardContent>
                <RatingSystem />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${filled ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}
