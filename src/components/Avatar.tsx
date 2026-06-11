import React from 'react'
import { Image } from 'react-native'

interface AvatarProps {
  seed: string
  size: number
}

export default function Avatar({ seed, size }: AvatarProps) {
  const uri = `https://i.pravatar.cc/${size * 2}?u=${seed}`
  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  )
}