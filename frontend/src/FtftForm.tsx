import { ChangeEvent, useState } from 'react'
import './App.css'
import { Box, Button, IconButton, Input, Textarea } from "@chakra-ui/react"
import { AttachmentIcon, ChatIcon, TimeIcon } from "@chakra-ui/icons"
import { API_BASE_URL } from './apiClient'
import { useAuthorization } from './useAuthorization'
import EmojiPicker from 'emoji-picker-react'
import PinIcon from "./assets/pin-48.svg"
import { format } from 'date-fns'

export const FtftForm = ({ onSaveFtft }: { onSaveFtft: (ftft: { content: string, fileUrls: string[], emoji?: string, location?: { lat: number, lng: number }, doneAt?: Date }) => Promise<void> }) => {
  const [content, setContent] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [emoji, setEmoji] = useState<string | undefined>(undefined)
  const [doneAt, setDoneAt] = useState<Date | undefined>(undefined)
  
  const [isDisplayEmojiPicker, setIsDisplayEmojiPicker] = useState(false)
  const authorization = useAuthorization()

  const [location, setLocation] = useState<{ lat: number, lng: number } | undefined>(undefined)


  const [isLoading, setIsLoading] = useState(false)

  const uploadFile = (): Promise<string[]> => {
    return Promise.all(
      files.map(file => {
        const query = new URLSearchParams({
          filename: file.name,
          contentType: file.type
        });
        return fetch(API_BASE_URL + '/storage?' + query, {
          headers: {
            Authorization: `Bearer ${authorization}`
          },
        }).then((res) => {
          if (res.status !== 200) throw new Error("URLを取得できませんでした" + JSON.stringify(query))
          return res.json()
        }).then(({ url: fileUrl }: { url: string }) => {
          return fetch(fileUrl, {
            method: "PUT",
            body: file,
          }).then((res) => {
            if (res.status !== 200) throw new Error("アップロードできませんでした" + JSON.stringify(query))
            return decodeURI(fileUrl)
          });
        })
      }
      ))
  }

  return <>
    <Textarea
      value={content}
      onChange={(value) => setContent(value.target.value)}
      placeholder='きょうの「はじめて」を記録しましょう✍️'
    />

    <Box display="flex" justifyContent="space-between">
      <Box display="flex" gap={2} flexWrap="wrap">
        <Box position="relative">
          {isDisplayEmojiPicker && <Box zIndex={1} position="absolute" top="40px"><EmojiPicker searchDisabled skinTonesDisabled onEmojiClick={(emojiClickData) => {
            setEmoji(emojiClickData.emoji)
            setIsDisplayEmojiPicker(false)
          }} /></Box>}
          <IconButton aria-label='' icon={emoji === undefined ? <ChatIcon /> : <span>{emoji}</span>} onClick={() => setIsDisplayEmojiPicker(!isDisplayEmojiPicker)} />
        </Box>

        <Box position="relative">
          <Box position="absolute"  zIndex={1} top={0} left={0} width="100%" height="100%" opacity="0" >
            <Input css={{
              "::-webkit-calendar-picker-indicator": {
                position: "absolute",
                "width": "100%",
                "height": "100%",
              }
            }} size='sm' max={format(new Date(), "yyyy-MM-dd'T'HH:mm")} type="datetime-local" height="100%" px={0} onInput={e=>{
              console.log(e.currentTarget.value)
              if (!e.currentTarget.value) {
                setDoneAt(undefined)  
              } else 
              setDoneAt(new Date(e.currentTarget.value))
            }}/>
          </Box>
          {doneAt === undefined ? <IconButton aria-label='' icon={<TimeIcon />} />
          : <Button >{format(doneAt, "M/d H:m")}</Button> }
        </Box>
        
        <IconButton aria-label='' icon={location === undefined ? <img width="18px" height="18px" src={PinIcon} /> : <span>📍</span>} onClick={() => {
          if (location !== undefined) {
            setLocation(undefined)
            return
          }

          navigator.geolocation.getCurrentPosition((pos) => {
            setLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            })
          })
        }} />

        <Box position="relative">
          <Input position="absolute" zIndex={1} top={0} left={0} width="100%" opacity="0" type="file" multiple onChange={(event: ChangeEvent<HTMLInputElement>) => {
            if (event.target.files && event.target.files?.length >= 1) {
              setFiles(files.concat(...event.target.files))
            }
          }} />
          <IconButton aria-label='' icon={<AttachmentIcon />} />
        </Box>


        {files.map((file, i) => {
          if (file.type.includes("image")) {
            return <img key={i} style={{ height: "40px", width: "40px", objectFit: "cover", borderRadius: "6px" }} src={URL.createObjectURL(file)} onClick={() => {
              setFiles(files.filter(_file => _file.name !== file.name))
            }} />
          }
          return <Button key={i} aria-label='' onClick={() => {
            setFiles(files.filter(_file => _file.name !== file.name))
          }}>
            {file.name}
          </Button>
        })}
      </Box>

      <Button isLoading={isLoading} colorScheme='teal' size='md' flexShrink={0} onClick={async () => {
        setIsLoading(true)
        try {
          const fileUrls = await uploadFile()
          await onSaveFtft({ content, fileUrls, emoji, location, doneAt })

          setLocation(undefined)
          setFiles([])
          setContent("")
          setEmoji(undefined)
          setDoneAt(undefined)

        } finally {
          setIsLoading(false)
        }

      }}>
        記録に残す
      </Button>
    </Box>
  </>
}
