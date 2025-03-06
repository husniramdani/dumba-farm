import { useCallback, useState } from 'react'
import { FileImage, Trash, UploadCloud } from 'lucide-react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'

import ProgressBar from './progress-bar'

interface FileUploadProps {
  onUploadComplete?: (url: string) => void
}

const ImageColor = {
  bgColor: 'bg-blue-500',
  fillColor: 'fill-blue-500',
}

// Function to generate Cloudinary signature
const generateSignature = async (paramsToSign: Record<string, number>) => {
  try {
    const response = await fetch('/api/cloudinary/signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paramsToSign),
    })

    const data = await response.json()
    return data.signature
  } catch (error) {
    console.error('Error generating signature:', error)
    throw error
  }
}

export default function SingleImageUpload({
  onUploadComplete,
}: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const uploadToCloudinary = async (file: File) => {
    return new Promise(async (resolve, reject) => {
      try {
        const timestamp = Math.round(new Date().getTime() / 1000)
        const paramsToSign = { timestamp }
        const signature = await generateSignature(paramsToSign)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('api_key', process.env.NEXT_PUBLIC_API_KEY!)
        formData.append('timestamp', timestamp.toString())
        formData.append('signature', signature)

        const xhr = new XMLHttpRequest()
        xhr.open(
          'POST',
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          true,
        )

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100)
            setUploadProgress(progress)
          }
        }

        xhr.onload = () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            const url = response.secure_url
            resolve(url)
          } else {
            reject(new Error('Upload failed'))
          }
        }

        xhr.onerror = () => {
          reject(new Error('Upload failed'))
        }

        xhr.send(formData)
      } catch (error) {
        reject(error)
      }
    })
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 1) {
        toast.error('You can only upload one image.')
        return
      }

      const file = acceptedFiles[0]

      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed.')
        return
      }

      setUploadedFile(file)
      setUploadProgress(0)

      try {
        const imageUrl = (await uploadToCloudinary(file)) as string
        setUploadedUrl(imageUrl)

        if (onUploadComplete) {
          onUploadComplete(imageUrl)
        }

        toast.success('Image uploaded successfully!')
      } catch (error) {
        console.error('Upload Error:', error)
        toast.error('Failed to upload image.')
      }
    },
    [onUploadComplete],
  )

  const removeImage = () => {
    setUploadedFile(null)
    setUploadedUrl(null)
    setUploadProgress(0)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  })

  return (
    <div className="flex flex-col items-center gap-4 p-4 border border-gray-300 rounded-lg">
      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className="w-full p-6 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center cursor-pointer hover:border-gray-600 transition"
        >
          <input {...getInputProps()} />
          <UploadCloud className="w-12 h-12 text-gray-500" />
          <p className="text-gray-600">
            Drag & drop an image here, or click to select one
          </p>
        </div>
      ) : (
        <div className="relative w-full max-w-sm p-4 border rounded-lg bg-gray-100">
          <div className="flex items-center gap-4">
            <FileImage className={`w-10 h-10 ${ImageColor.fillColor}`} />
            <div className="flex-1">
              <p className="text-sm font-medium">{uploadedFile?.name || '-'}</p>
              <ProgressBar progress={uploadProgress} />
            </div>
            <button
              onClick={removeImage}
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-700 transition"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
          {uploadedUrl && (
            <div className="relative w-full min-h-[320px]">
              <Image
                src={uploadedUrl}
                className="my-4 w-full rounded-lg object-cover"
                alt="Uploaded"
                fill
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
