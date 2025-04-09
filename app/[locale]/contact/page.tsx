import ContactForm from '@/components/contact/ContactForm'
import RatingSystem from '@/components/contact/RatingSystem'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getSetting } from '@/lib/actions/setting.actions'
import { MapPin, Phone, Mail } from 'lucide-react'

export default async function ContactPage() {
  // Since we want the page entirely in English,
  // we define static English messages here.
  const messages = {
    title: 'Contact Us',
    formTitle: 'Send Us a Message',
    formSubtitle: 'We’d love to hear from you. Please fill out the form below and we’ll get back to you shortly.',
    infoTitle: 'Get in Touch',
    addressLabel: 'Address',
    phoneLabel: 'Phone',
    emailLabel: 'Email',
    ratingTitle: 'How Did We Do?'
  }
  
  // Retrieve setting from your data source
  const setting = await getSetting()

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center mb-12">
          {messages.title}
        </h1>

        {/* Grid layout: left side for Contact Form, right side for Contact Info and Rating */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Contact Form */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader>
              <h2 className="text-2xl font-semibold mb-2">
                {messages.formTitle}
              </h2>
              <p className="text-gray-500 text-sm">
                {messages.formSubtitle}
              </p>
            </CardHeader>
            <CardContent>
              <ContactForm setting={setting} />
            </CardContent>
          </Card>

          {/* Right Side: Contact Information and Rating System */}
          <div className="flex flex-col gap-6">
            {/* Contact Information Card */}
            <Card className="shadow-md border border-gray-200">
              <CardHeader>
                <h2 className="text-2xl font-semibold mb-2">
                  {messages.infoTitle}
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Address Section */}
                <div className="flex items-start gap-4">
                  <MapPin className="text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      {messages.addressLabel}
                    </h4>
                    <p className="text-gray-600">
                      {setting.site.address?.street || '123 Business Ave'},<br />
                      {setting.site.address?.city || 'New York'}, {setting.site.address?.state || 'NY'}<br />
                      {setting.site.address?.country || 'USA'}, {setting.site.address?.zip || '10001'}
                    </p>
                  </div>
                </div>

                {/* Phone Section */}
                <div className="flex items-start gap-4">
                  <Phone className="text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      {messages.phoneLabel}
                    </h4>
                    <p className="text-gray-600">
                      {setting.site.phone || '+01212444617'}
                    </p>
                  </div>
                </div>

                {/* Email Section */}
                <div className="flex items-start gap-4">
                  <Mail className="text-primary mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      {messages.emailLabel}
                    </h4>
                    <p className="text-gray-600">
                      {setting.site.email || 'contact@mg-zon.vercel.app'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating System Card */}
            <Card className="shadow-md border border-gray-200">
              <CardHeader>
                <h2 className="text-2xl font-semibold">
                  {messages.ratingTitle}
                </h2>
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
