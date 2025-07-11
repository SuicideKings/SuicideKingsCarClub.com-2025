"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Calendar, 
  Gauge, 
  Palette, 
  Wrench, 
  DollarSign,
  Award,
  Camera,
  Heart,
  MoreVertical,
  Share2,
  EyeOff
} from "lucide-react"
import { Car } from "@/lib/types"
import { CarForm } from "./car-form"
import { toast } from "sonner"

type CarCardProps = {
  car: Car
  onUpdate: (id: string, data: Partial<Car>) => void
  onDelete: (id: string) => void
}

export function CarCard({ car, onUpdate, onDelete }: CarCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 10)

  const handleUpdate = async (data: Partial<Car>) => {
    try {
      await onUpdate(car.id, data)
      setIsEditing(false)
      toast.success("Car updated successfully!")
    } catch (error) {
      toast.error("Failed to update car")
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this car? This action cannot be undone.")) {
      try {
        await onDelete(car.id)
        toast.success("Car deleted successfully!")
      } catch (error) {
        toast.error("Failed to delete car")
      }
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites")
  }

  const getConditionColor = (condition: string) => {
    switch(condition?.toLowerCase()) {
      case 'excellent': return 'from-green-500 to-emerald-600'
      case 'good': return 'from-blue-500 to-cyan-600'
      case 'fair': return 'from-yellow-500 to-orange-600'
      case 'poor': return 'from-red-500 to-pink-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getConditionProgress = (condition: string) => {
    switch(condition?.toLowerCase()) {
      case 'excellent': return 95
      case 'good': return 75
      case 'fair': return 50
      case 'poor': return 25
      default: return 0
    }
  }

  if (isEditing) {
    return (
      <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Edit className="w-5 h-5 text-red-500" />
            Edit Car
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CarForm
            car={car}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group overflow-hidden bg-gradient-to-br from-gray-900/90 to-black/90 border-gray-700 backdrop-blur-sm hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:scale-[1.02] hover:border-red-500/30">
      {/* Car Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <Camera className="w-16 h-16 text-gray-600" />
          <span className="absolute bottom-4 left-4 text-white text-sm z-20">
            No image available
          </span>
        </div>
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 z-20 flex gap-2">
          {car.isPrimary && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none shadow-lg">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Primary
            </Badge>
          )}
          <Badge className={`${car.isPublic ? 'bg-green-500/80' : 'bg-gray-500/80'} text-white border-none backdrop-blur-sm`}>
            {car.isPublic ? (
              <>
                <Eye className="w-3 h-3 mr-1" />
                Public
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3 mr-1" />
                Private
              </>
            )}
          </Badge>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-black/40 border-white/20 text-white hover:bg-black/60 backdrop-blur-sm"
              onClick={() => toast.success("Sharing feature coming soon!")}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-black/40 border-white/20 text-white hover:bg-black/60 backdrop-blur-sm"
              onClick={() => toast.success("More options coming soon!")}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Like Button */}
        <div className="absolute bottom-3 right-3 z-20">
          <Button
            size="sm"
            variant="outline"
            className={`bg-black/40 border-white/20 backdrop-blur-sm transition-all duration-200 ${
              isLiked 
                ? 'text-red-500 border-red-500/50 hover:bg-red-500/20' 
                : 'text-white hover:bg-black/60'
            }`}
            onClick={handleLike}
          >
            <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            {likeCount}
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl text-white mb-1 group-hover:text-red-400 transition-colors">
              {car.year} {car.make} {car.model}
            </CardTitle>
            {car.trim && (
              <CardDescription className="text-gray-400 font-medium">
                {car.trim}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {car.color && (
            <div className="flex items-center gap-2 text-sm">
              <Palette className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Color:</span>
              <span className="text-white font-medium">{car.color}</span>
            </div>
          )}
          
          {car.mileage && (
            <div className="flex items-center gap-2 text-sm">
              <Gauge className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Miles:</span>
              <span className="text-white font-medium">{car.mileage.toLocaleString()}</span>
            </div>
          )}
          
          {car.engineType && (
            <div className="flex items-center gap-2 text-sm">
              <Wrench className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Engine:</span>
              <span className="text-white font-medium truncate">{car.engineType}</span>
            </div>
          )}
          
          {car.purchaseDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">Purchased:</span>
              <span className="text-white font-medium">
                {new Date(car.purchaseDate).getFullYear()}
              </span>
            </div>
          )}
        </div>
        
        {/* Condition Progress */}
        {car.condition && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Condition:
              </span>
              <Badge className={`bg-gradient-to-r ${getConditionColor(car.condition)} text-white border-none`}>
                {car.condition}
              </Badge>
            </div>
            <Progress 
              value={getConditionProgress(car.condition)} 
              className="h-2"
            />
          </div>
        )}
        
        {/* Value Information */}
        {(car.purchasePrice || car.currentValue) && (
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-sm">Value:</span>
            </div>
            <div className="text-right">
              {car.currentValue && (
                <div className="text-white font-semibold">
                  ${car.currentValue.toLocaleString()}
                </div>
              )}
              {car.purchasePrice && car.currentValue && (
                <div className={`text-xs ${
                  car.currentValue > car.purchasePrice ? 'text-green-400' : 'text-red-400'
                }`}>
                  {car.currentValue > car.purchasePrice ? '+' : ''}
                  ${(car.currentValue - car.purchasePrice).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Story Preview */}
        {showDetails && car.story && (
          <div className="p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-lg border border-white/10 backdrop-blur-sm">
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              My Story
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">{car.story}</p>
          </div>
        )}
        
        {/* VIN Information */}
        {showDetails && car.vin && (
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">VIN:</span>
              <span className="text-white font-mono text-xs">{car.vin}</span>
            </div>
          </div>
        )}
        
        {/* Modifications */}
        {showDetails && car.modifications && (
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-400" />
              Modifications
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">{car.modifications}</p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white group/btn"
          >
            <Eye className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
            {showDetails ? 'Hide' : 'View'} Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="border-gray-600 text-gray-300 hover:bg-blue-800 hover:text-white hover:border-blue-600 group/btn"
          >
            <Edit className="w-4 h-4 group-hover/btn:animate-pulse" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Photo upload coming soon!")}
            className="border-gray-600 text-gray-300 hover:bg-green-800 hover:text-white hover:border-green-600 group/btn"
          >
            <Camera className="w-4 h-4 group-hover/btn:animate-pulse" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="border-gray-600 text-gray-300 hover:bg-red-800 hover:text-white hover:border-red-600 group/btn"
          >
            <Trash2 className="w-4 h-4 group-hover/btn:animate-pulse" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}