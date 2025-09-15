import { useContext } from "react"
import { RootContext } from "@/contexts/RootContext"
import { LucideIcon } from "lucide-react"

export const CustomSeparator = ({icon}: {icon: LucideIcon}) => {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error('CustomSeparator must be used within a RootContext Provider');
  }
  const {viewMode, isMobile} = context;

  const SeparatorIcon = icon;
  return (
    <div className='w-full border-b border-gray-300 relative my-7'>
      <div className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${isMobile || viewMode === 'Mobile' ? 'bg-gray-50' :'bg-white'} p-2`}>
        <SeparatorIcon className='text-gray-400' />
      </div>
    </div>
  )
}