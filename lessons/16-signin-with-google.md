# 16-signin-with-google

## update .env.local

- open https://console.cloud.google.com/apis/credentials
- create a new OAuth 2.0 Client ID ans get its credentials

```txt
     AUTH_GOOGLE_ID=xx.apps.googleusercontent.com
     AUTH_GOOGLE_SECRET=xx
```

## update auth.ts

```ts
import Google from 'next-auth/providers/google'
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
```

## update lib/actions/user.actions.ts

```ts
-
export const SignInWithGoogle = async () => {
  await signIn('google')
}
```

## create app/(auth)/sign-in/google-signin-form.tsx

```ts
'use client'
import { useFormStatus } from 'react-dom'

import { Button } from '@/components/ui/button'
import { SignInWithGoogle } from '@/lib/actions/user.actions'

export function GoogleSignInForm() {
  const SignInButton = () => {
    const { pending } = useFormStatus()
    return (
      <Button disabled={pending} className='w-full' variant='outline'>
        {pending ? 'Redirecting to Google...' : 'Sign In with Google'}
      </Button>
    )
  }
  return (
    <form action={SignInWithGoogle}>
      <SignInButton />
    </form>
  )
}
```

## update app/(auth)/sign-in/page.tsx

```ts
import { GoogleSignInForm } from './google-signin-form'
            <SeparatorWithOr />
            <div className='mt-4'>
              <GoogleSignInForm />
            </div>
```

## npm run build

## update env variables on vercel

## commit changes and push to GitHub

## go to https://nextjs-amazona.vercel.app
