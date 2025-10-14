'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { ImageCropper } from './image-cropper'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  hint?: string
}

export function ImageUpload({ value, onChange, label, hint }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const [showCropper, setShowCropper] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function processFile(file: File) {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('File type not supported. Please use JPG, PNG, or WEBP')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Maximum 5MB')
      return
    }

    // Store original file
    setOriginalFile(file)

    // Read file and check dimensions for cropping
    const reader = new FileReader()
    reader.onloadend = () => {
      const imageDataUrl = reader.result as string
      
      // Check if image needs cropping (not 1:1 ratio)
      const img = new window.Image()
      img.onload = () => {
        if (img.width !== img.height) {
          // Show cropper for non-square images
          setSelectedImage(imageDataUrl)
          setShowCropper(true)
        } else {
          // Upload directly if already square
          setPreview(imageDataUrl)
          uploadFile(file)
        }
      }
      img.src = imageDataUrl
    }
    reader.readAsDataURL(file)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      processFile(file)
    }
  }

  async function handleCropComplete(croppedBlob: Blob) {
    setShowCropper(false)
    
    // Convert blob to file
    const croppedFile = new File([croppedBlob], originalFile?.name || 'cropped.jpg', {
      type: 'image/jpeg',
    })

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(croppedFile)

    // Upload cropped file
    await uploadFile(croppedFile)
  }

  async function uploadFile(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body  : formData,
      })

      const data = await res.json()

      if (data.success) {
        onChange(data.data.url)
      } else {
        alert(data.error || 'Upload failed')
        setPreview(null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  function handleCancelCrop() {
    setShowCropper(false)
    setSelectedImage(null)
    setOriginalFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleRemove() {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <div className="space-y-2">
        {label && <Label>{label}</Label>}
        
        {preview ? (
          <div className="relative group">
            <div className="aspect-square relative w-full max-w-48 mx-auto rounded-lg overflow-hidden border bg-muted">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <ImageIcon className={`mx-auto h-12 w-12 mb-4 ${
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            }`} />
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
              id="file-upload"
            />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Button type="button" variant="outline" disabled={uploading} asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Choose File'}
                  </span>
                </Button>
                <p className="text-sm text-muted-foreground">
                  or drag and drop your image here
                </p>
                {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
              </div>
            </Label>
          </div>
        )}
      </div>

      {/* Image Cropper Dialog */}
      {selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
          open={showCropper}
        />
      )}
    </>
  )
}
