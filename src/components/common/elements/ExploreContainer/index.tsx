import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { IonButton, IonIcon, IonLabel } from '@ionic/react'
import { useEffect, useState } from 'react'

const ffmpeg = createFFmpeg({ log: true })

function ExploreContainer() {
  const [ready, setReady] = useState(false)
  const [video, setVideo] = useState<any>()
  const [gif, setGif] = useState('')

  const load = async () => {
    await ffmpeg.load()
    setReady(true)
  }

  const clearState = () => {
    setVideo(null)
    setGif('')
  }

  useEffect(() => {
    load()
  }, [])

  const convertToGif = async () => {
    // Write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video))

    // Run the FFMpeg command
    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'out.gif')

    // Read the result
    const data = ffmpeg.FS('readFile', 'out.gif')

    // Create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }))
    setGif(url)
  }

  return ready ? (
    <div className="grid place-content-center">
      {video && <video controls width="250" src={URL.createObjectURL(video)}></video>}
      <div className="my-4">
        <IonIcon name="videocam-outline" />
        <input type="file" aria-label="" onChange={(e: any) => setVideo(e.target.files?.item(0))} />
      </div>

      <IonButton onClick={() => convertToGif()}>Convert</IonButton>
      {gif && (
        <>
          <img src={gif} width="250" />
          <a href={gif} className="my-4 inline-block text-center" download>
            <IonButton onClick={() => clearState()}>
              <IonLabel>Download</IonLabel>
            </IonButton>
          </a>
        </>
      )}
    </div>
  ) : (
    <p>Loading...</p>
  )
}

export default ExploreContainer
