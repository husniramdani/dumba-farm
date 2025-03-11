'use client'

import jsQR from 'jsqr'

import WebcamCapture from './WebcamCapture'

const QRScanner = ({
  onScanQRCode,
}: {
  onScanQRCode: (id: string) => void
}) => {
  const handleScan = (imageSrc: string) => {
    if (!imageSrc) return

    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        console.error('Failed to get canvas context.')
        return
      }

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      if (!imageData) {
        console.error('Failed to get image data.')
        return
      }

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      })

      if (code) {
        const lastSegment = code.data.split('/').pop() ?? ''
        onScanQRCode(lastSegment)
      }
    }
  }

  return (
    <div>
      <WebcamCapture onScan={handleScan} />
    </div>
  )
}

export default QRScanner
