'use client'

import { useEffect } from 'react'
import React, { useRef } from 'react'
import Webcam from 'react-webcam'

const WebcamCapture = ({ onScan }) => {
  const webcamRef = useRef<Webcam | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      capture()
    }, 500)

    return () => clearInterval(timer)
  })

  const videoConstraints = {
    width: 500,
    height: 500,
    facingMode: 'environment',
  }

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      onScan(imageSrc)
    }
  }

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onClick={() => capture()}
      />
    </div>
  )
}

export default WebcamCapture
