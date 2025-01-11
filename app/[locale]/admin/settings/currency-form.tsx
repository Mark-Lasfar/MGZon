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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ISettingInput } from '@/types'
import { TrashIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'

export default function CurrencyForm({
  form,
  id,
}: {
  form: UseFormReturn<ISettingInput>
  id: string
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'availableCurrencies',
  })
  const {
    setValue,
    watch,
    control,
    formState: { errors },
  } = form

  const availableCurrencies = watch('availableCurrencies')
  const defaultCurrency = watch('defaultCurrency')

  useEffect(() => {
    const validCodes = availableCurrencies.map((lang) => lang.code)
    if (!validCodes.includes(defaultCurrency)) {
      setValue('defaultCurrency', '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(availableCurrencies)])

  return (
    <Card id={id}>
      <CardHeader>
        <CardTitle>Currencies</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-4'>
          {fields.map((field, index) => (
            <div key={field.id} className='flex   gap-2'>
              <FormField
                control={form.control}
                name={`availableCurrencies.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    {' '}
                    {index == 0 && <FormLabel>Name</FormLabel>}
                    <FormControl>
                      <Input {...field} placeholder='Name' />
                    </FormControl>
                    <FormMessage>
                      {errors.availableCurrencies?.[index]?.name?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`availableCurrencies.${index}.code`}
                render={({ field }) => (
                  <FormItem>
                    {index == 0 && <FormLabel>Code</FormLabel>}
                    <FormControl>
                      <Input {...field} placeholder='Code' />
                    </FormControl>
                    <FormMessage>
                      {errors.availableCurrencies?.[index]?.code?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`availableCurrencies.${index}.symbol`}
                render={({ field }) => (
                  <FormItem>
                    {index == 0 && <FormLabel>Symbol</FormLabel>}
                    <FormControl>
                      <Input {...field} placeholder='Symbol' />
                    </FormControl>
                    <FormMessage>
                      {errors.availableCurrencies?.[index]?.symbol?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`availableCurrencies.${index}.convertRate`}
                render={({ field }) => (
                  <FormItem>
                    {index == 0 && <FormLabel>Convert Rate</FormLabel>}
                    <FormControl>
                      <Input {...field} placeholder='Convert Rate' />
                    </FormControl>
                    <FormMessage>
                      {
                        errors.availableCurrencies?.[index]?.convertRate
                          ?.message
                      }
                    </FormMessage>
                  </FormItem>
                )}
              />
              <div>
                {index == 0 && <div>Action</div>}
                <Button
                  type='button'
                  disabled={fields.length === 1}
                  variant='outline'
                  className={index == 0 ? 'mt-2' : ''}
                  onClick={() => {
                    remove(index)
                  }}
                >
                  <TrashIcon className='w-4 h-4' />
                </Button>
              </div>
            </div>
          ))}

          <Button
            type='button'
            variant={'outline'}
            onClick={() =>
              append({ name: '', code: '', symbol: '', convertRate: 1 })
            }
          >
            Add Currency
          </Button>
        </div>

        <FormField
          control={control}
          name='defaultCurrency'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Currency</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a currency' />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies
                      .filter((x) => x.code)
                      .map((lang, index) => (
                        <SelectItem key={index} value={lang.code}>
                          {lang.name} ({lang.code})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage>{errors.defaultCurrency?.message}</FormMessage>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}
