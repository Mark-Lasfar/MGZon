import { usePathname } from 'next/navigation'
import useDeviceType from './use-device-type'
import useCartStore from './use-cart-store'
import { i18n } from '@/i18n-config'

const locales = i18n.locales
  .filter((locale) => locale.code !== 'en-US')
  .map((locale) => locale.code)

const isNotInPaths = (s: string) => {
  const localePattern = `/(?:${locales.join('|')})` // Match locales
  const pathsPattern = `^(?:${localePattern})?(?:/$|/cart$|/checkout$|/sign-in$|/sign-up$|/order(?:/.*)?$|/account(?:/.*)?$|/admin(?:/.*)?$)?$`
  return !new RegExp(pathsPattern).test(s)
}

function useCartSidebar() {
  const {
    cart: { items },
  } = useCartStore()
  const deviceType = useDeviceType()
  const currentPath = usePathname()

  return (
    items.length > 0 && deviceType === 'desktop' && isNotInPaths(currentPath)
  )
}

export default useCartSidebar
