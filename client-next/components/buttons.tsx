import { NearLogo } from "./icons/near";

export default function ButtonLogin({
  isLoading, isLoggedIn, className
}: {
  isLoading: boolean,
  isLoggedIn: boolean,
  className?: string
}) {
  return (
    <button className={`${className}
      bg-primary 
      text-on-primary
      font-bold 
      py-2
      px-4 
      flex
      justify-center
      items-center
      space-x-4
      rounded
      `}>
      {isLoggedIn ? 'disconnect' : 'Login with NEAR'}
      <NearLogo className={`w-4 text-on-primary ${isLoading ? "animate-spin" : ""}`} />
    </button>
  )
}