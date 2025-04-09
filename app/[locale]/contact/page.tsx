import { getMessages } from 'next-intl/server'
import ContactForm from '@/components/contact/ContactForm'
import RatingSystem from '@/components/contact/RatingSystem'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getSetting } from '@/lib/actions/setting.actions'
import { MapPin, Phone, Mail } from 'lucide-react'

export default async function ContactPage() {
  const messages = await getMessages()
  const setting = await getSetting()

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          {messages.Contact.title || 'Contact Us'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="shadow-md">
            <CardHeader>
              <h2 className="text-2xl font-semibold mb-2">
                {messages.Contact.formTitle || 'Send us a message'}
              </h2>
              <p className="text-gray-600">
                {messages.Contact.formSubtitle || 'We’ll get back to you as soon as possible.'}
              </p>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="bg-gray-50 shadow-sm border border-gray-200">
            <CardHeader>
              <h2 className="text-2xl font-semibold mb-2">
                {messages.Contact.infoTitle || 'Our Contact Details'}
              </h2>
              <p className="text-gray-600">
                {messages.Contact.infoSubtitle || 'Reach us through any of the following ways.'}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <MapPin className="text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">{messages.Contact.address || 'Address'}</h4>
                  <p className="text-gray-600">
                    {setting.site.address?.street || '123 Business Ave'},<br />
                    {setting.site.address?.city || 'New York'}, {setting.site.address?.state || 'NY'}<br />
                    {setting.site.address?.country || 'USA'}, {setting.site.address?.zip || '10001'}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <Phone className="text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">{messages.Contact.phone || 'Phone'}</h4>
                  <p className="text-gray-600">{setting.site.phone || '+01212444617'}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="text-primary mt-1" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">{messages.Contact.email || 'Email'}</h4>
                  <p className="text-gray-600">{setting.site.email || 'contact@mg-zon.vercel.app'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rating System */}
        <div className="mt-12">
          <RatingSystem />
        </div>
      </div>
    </div>
  )
}
