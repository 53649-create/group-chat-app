import { Users } from 'lucide-react'

export default function MemberList({ members }) {
  return (
    <div className="w-64 border-l border-gray-300 bg-white flex flex-col">
      <div className="p-4 border-b border-gray-300">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-purple-600" />
          <h3 className="font-bold text-lg text-gray-800">Members</h3>
          <span className="bg-purple-100 text-purple-700 text-sm font-semibold px-2 py-1 rounded-full ml-auto">
            {members.length}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {members.map((member, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {member.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-800 font-medium truncate">{member}</span>
            <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  )
}