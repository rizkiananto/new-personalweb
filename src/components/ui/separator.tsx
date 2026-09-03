import { LucideIcon } from "lucide-react"

export const CustomSeparator = ({icon}: {icon: LucideIcon}) => {
  const SeparatorIcon = icon;
  return (
    <div className='w-full border-b border-gray-300 relative my-7'>
      <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-gray-50 p-2'>
        <SeparatorIcon className='text-gray-400' />
      </div>
    </div>
  )
}
