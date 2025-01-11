/* eslint-disable @next/next/no-img-element */
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { UploadButton } from '@/lib/uploadthing'
import { ISettingInput } from '@/types'
import { TrashIcon } from 'lucide-react'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

export default function SiteInfoForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const { watch, control } = form

  const siteLogo = watch('site.logo')
  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>Site Info</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={control}
            name='site.name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter site name' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='site.url'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Url</FormLabel>
                <FormControl>
                  <Input placeholder='Enter url' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <div className='w-full text-left'>
            <FormField
              control={control}
              name='site.logo'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter image url' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {siteLogo && (
              <div className='flex my-2 items-center gap-2'>
                <img src={siteLogo} alt='logo' width={48} height={48} />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => form.setValue('site.logo', '')}
                >
                  <TrashIcon className='w-4 h-4' />
                </Button>
              </div>
            )}
            {!siteLogo && (
              <UploadButton
                className='!items-start py-2'
                endpoint='imageUploader'
                onClientUploadComplete={(res) => {
                  form.setValue('site.logo', res[0].url)
                }}
                onUploadError={(error: Error) => {
                  toast({
                    variant: 'destructive',
                    description: `ERROR! ${error.message}`,
                  })
                }}
              />
            )}
          </div>
          <FormField
            control={control}
            name='site.description'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter description'
                    className='h-40'
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={control}
            name='site.slogan'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Slogan</FormLabel>
                <FormControl>
                  <Input placeholder='Enter slogan name' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='site.keywords'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Keywords</FormLabel>
                <FormControl>
                  <Input placeholder='Enter keywords' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={control}
            name='site.phone'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder='Enter phone number' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='site.email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email address' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={control}
            name='site.address'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder='Enter address' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='site.copyright'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Copyright</FormLabel>
                <FormControl>
                  <Input placeholder='Enter copyright' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
