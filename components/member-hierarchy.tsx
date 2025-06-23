"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDown, ChevronUp, Crown, Star, Users, Shield, Award } from "lucide-react"

// This would typically come from a database
const getMembersForChapter = (chapterId: string) => {
  // Leadership structure
  const leadership = [
    {
      id: 1,
      name: "Michael Rodriguez",
      role: "President",
      joinDate: "2016",
      car: "1967 Lincoln Continental",
      image: `/member-profile.png?key=${chapterId}1&query=man in suit mafia boss style`,
      profileImage: `/member-profile.png?key=${chapterId}1&query=man in suit mafia boss style`,
      carInfo: "1967 Lincoln Continental"
    },
  ]

  // Officers
  const officers = [
    {
      id: 2,
      name: "James Wilson",
      role: "Vice President",
      joinDate: "2016",
      car: "1964 Lincoln Continental",
      image: `/member-profile.png?key=${chapterId}2&query=man in suit mafia underboss style`,
      profileImage: `/member-profile.png?key=${chapterId}2&query=man in suit mafia underboss style`,
      carInfo: "1964 Lincoln Continental"
    },
    {
      id: 3,
      name: "Robert Johnson",
      role: "Secretary",
      joinDate: "2017",
      car: "1965 Lincoln Continental",
      image: `/member-profile.png?key=${chapterId}3&query=man in suit mafia consigliere style`,
      profileImage: `/member-profile.png?key=${chapterId}3&query=man in suit mafia consigliere style`,
      carInfo: "1965 Lincoln Continental"
    },
    {
      id: 4,
      name: "David Martinez",
      role: "Treasurer",
      joinDate: "2017",
      car: "1963 Lincoln Continental",
      image: `/member-profile.png?key=${chapterId}4&query=man in suit mafia capo style`,
      profileImage: `/member-profile.png?key=${chapterId}4&query=man in suit mafia capo style`,
      carInfo: "1963 Lincoln Continental"
    },
  ]

  // Generate some members based on chapter ID to make them unique
  const members = Array.from({ length: 12 }, (_, i) => ({
    id: i + 5,
    name: `Member ${i + 1}`,
    role: "Member",
    joinDate: `${2018 + Math.floor(i / 4)}`,
    car: `196${(i % 9) + 1} Lincoln Continental`,
    image: `/member-profile.png?key=${chapterId}${i + 5}&query=person in casual clothes with classic car`,
    profileImage: `/member-profile.png?key=${chapterId}${i + 5}&query=person in casual clothes with classic car`,
    carInfo: `196${(i % 9) + 1} Lincoln Continental`
  }))

  return { leadership, officers, members }
}

export default function MemberHierarchy({ chapterId }: { chapterId: string }) {
  const { leadership, officers, members } = getMembersForChapter(chapterId)
  const [showAllMembers, setShowAllMembers] = useState(false)
  const [showOfficers, setShowOfficers] = useState(false)
  const [showMembers, setShowMembers] = useState(false)

  const displayedMembers = showAllMembers ? members : members.slice(0, 4)

  return (
    <div className="space-y-12">
      {/* Chapter Leadership with Premium Design */}
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 via-purple-400/20 to-blue-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        
        <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/30 group-hover:border-yellow-400/50 transition-all duration-500">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-3">
                <Crown className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                Chapter Leadership
              </h3>
            </div>
            <p className="text-gray-400 mt-2">Meet the distinguished leaders of our chapter</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* President Card */}
            <div className="group/card relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/30 to-yellow-600/30 rounded-2xl blur-lg opacity-0 group-hover/card:opacity-100 transition-all duration-500"></div>
              
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 group-hover/card:border-yellow-400/50 transition-all duration-500 group-hover/card:scale-105">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur-sm opacity-70 group-hover/card:opacity-100 transition-all duration-500"></div>
                    <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-yellow-400">
                      <Image
                        src={leadership[0].image || "/placeholder.svg"}
                        alt={leadership[0].name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-1">
                      <Crown className="h-4 w-4 text-black" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white group-hover/card:text-yellow-400 transition-colors duration-300">{leadership[0].name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      <p className="text-yellow-400 font-semibold">{leadership[0].role}</p>
                    </div>
                    <p className="text-gray-300 text-sm mt-2 group-hover/card:text-white transition-colors duration-300">{leadership[0].car}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-xs text-gray-400 ml-2">Founding Member</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Officers with Collapsible Design */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-green-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 group-hover:border-purple-400/50 transition-all duration-500">
          <button
            onClick={() => setShowOfficers(!showOfficers)}
            className="flex w-full items-center justify-between p-8 text-left group/btn"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-full p-3 group-hover/btn:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  Chapter Officers
                </h3>
                <p className="text-gray-400 mt-1">{officers.length} dedicated officers serving our chapter</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-full p-3 group-hover/btn:bg-white/20 transition-all duration-300">
              {showOfficers ? (
                <ChevronUp className="h-6 w-6 text-purple-400 group-hover/btn:scale-110 transition-transform duration-300" />
              ) : (
                <ChevronDown className="h-6 w-6 text-purple-400 group-hover/btn:scale-110 transition-transform duration-300" />
              )}
            </div>
          </button>
          
          {showOfficers && (
            <div className="px-8 pb-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {officers.map((officer, index) => (
                  <div key={officer.id} className="group/officer relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-2xl blur-lg opacity-0 group-hover/officer:opacity-100 transition-all duration-500"></div>
                    
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/20 group-hover/officer:border-purple-400/50 transition-all duration-500 group-hover/officer:scale-105">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-sm opacity-0 group-hover/officer:opacity-70 transition-all duration-500"></div>
                          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-purple-400/50 group-hover/officer:border-purple-400 transition-all duration-300">
                            <Image
                              src={officer.image || "/placeholder.svg"}
                              alt={officer.name}
                              width={64}
                              height={64}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover/officer:scale-110"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full p-1">
                            <Award className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white group-hover/officer:text-purple-400 transition-colors duration-300">{officer.name}</h4>
                          <p className="text-purple-400 font-semibold text-sm">{officer.role}</p>
                          <p className="text-gray-300 text-xs mt-1 group-hover/officer:text-white transition-colors duration-300">{officer.car}</p>
                          <div className="flex items-center space-x-1 mt-2">
                            {[...Array(3 + (index % 3))].map((_, i) => (
                              <Star key={i} className="h-2 w-2 text-purple-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chapter Members with Modern Grid */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 via-blue-400/20 to-yellow-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 group-hover:border-green-400/50 transition-all duration-500">
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="flex w-full items-center justify-between p-8 text-left group/btn"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-full p-3 group-hover/btn:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-4xl font-bold bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
                  Chapter Members
                </h3>
                <p className="text-gray-400 mt-1">{members.length} passionate Continental enthusiasts</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-full p-3 group-hover/btn:bg-white/20 transition-all duration-300">
              {showMembers ? (
                <ChevronUp className="h-6 w-6 text-green-400 group-hover/btn:scale-110 transition-transform duration-300" />
              ) : (
                <ChevronDown className="h-6 w-6 text-green-400 group-hover/btn:scale-110 transition-transform duration-300" />
              )}
            </div>
          </button>
          
          {showMembers && (
            <div className="px-8 pb-8">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {members.map((member, index) => (
                  <div key={member.id} className="group/member relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-xl blur-lg opacity-0 group-hover/member:opacity-100 transition-all duration-500"></div>
                    
                    <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-3 border border-white/20 group-hover/member:border-green-400/50 transition-all duration-500 group-hover/member:scale-105">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full blur-sm opacity-0 group-hover/member:opacity-70 transition-all duration-500"></div>
                          <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-green-400/50 group-hover/member:border-green-400 transition-all duration-300">
                            <Image
                              src={member.image || "/placeholder.svg"}
                              alt={member.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover/member:scale-110"
                            />
                          </div>
                          {index < 5 && (
                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-1">
                              <Star className="h-2 w-2 text-black fill-current" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white group-hover/member:text-green-400 transition-colors duration-300 truncate">{member.name}</h4>
                          <p className="text-gray-300 text-xs group-hover/member:text-white transition-colors duration-300 truncate">{member.car}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(2 + (index % 4))].map((_, i) => (
                              <Star key={i} className="h-2 w-2 text-green-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
