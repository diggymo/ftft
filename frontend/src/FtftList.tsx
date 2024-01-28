import { Fragment, memo, useState } from 'react'
import { IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, } from "@chakra-ui/react"
import './App.css'
import { Box, Button, Divider, Text } from "@chakra-ui/react"
import { useSuspenseQuery } from '@tanstack/react-query'
import { format, formatRelative, parseISO } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useAuthorization } from './useAuthorization'
import { API_BASE_URL } from './apiClient'
import 'react-calendar/dist/Calendar.css';
import { CalendarIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'

type Ftft = { id: string, userId: string, title: string, createdAt: Date, fileUrls: string[], emoji?: string, location?: { lat: number, lng: number } }

export const FtftList = () => {

  const authorization = useAuthorization()

  const { data: ftftList } = useSuspenseQuery<Ftft[]>({
    queryKey: ['ftfts'],
    queryFn: () =>
      fetch(API_BASE_URL + '/ftft', {
        headers: {
          Authorization: `Bearer ${authorization}`
        }
      }).then((res) => res.json())
        .then((json) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return json.map((ftftJson: any) => {
            return {
              ...ftftJson,
              createdAt: parseISO(ftftJson.createdAt)
            }
          })
        }),
  })


  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {ftftList.map(ftft => {
        return <Fragment key={ftft.id}>
          <Box display="flex" gap={2}>
            {ftft.emoji !== undefined && <Text fontSize="md" minWidth="20px">{ftft.emoji}</Text>}

            <Box flexGrow={1}>
              <Box className={"title_" + format(ftft.createdAt, "yyyyMMdd")} key={"title_" + ftft.id} display="flex" justifyContent="space-between" gap={2}>
                <Text fontSize="md" whiteSpace="pre-wrap" wordBreak="break-all">{ftft.title}</Text>
                <Box display="flex">
                  {ftft.location !== undefined && <Link target="_blank" to={`https://www.google.com/maps?q=${ftft.location.lat},${ftft.location.lng}`}>📍</Link>}
                  <CreatedAtLabel createdAt={ftft.createdAt} />
                </Box>
              </Box>
              {ftft.fileUrls.length !== 0 && <Box key={"files_" + ftft.id} display="flex" gap={2} flexWrap="wrap">
                {ftft.fileUrls.map((fileUrl, i) => {
                  const extensions = [
                    ".png",
                    ".jpg",
                    ".gif",
                    ".jpeg"
                  ]
                  if (extensions.some(extension => fileUrl.includes(extension) || fileUrl.includes(extension.toUpperCase()))) {
                    return <img loading="lazy" key={i} style={{ height: "40px", width: "40px", objectFit: "cover", borderRadius: "6px" }} src={fileUrl} onClick={() => {
                      window.open(fileUrl)
                    }} />
                  }
                  return <Button key={i} aria-label='' onClick={() => {
                    window.open(fileUrl)
                  }}>
                    {fileUrl.split("/")[fileUrl.split("/").length - 1].split("?")[0].slice(36)}
                  </Button>
                })}
              </Box>}
            </Box>
          </Box>


          <Divider key={"divider_" + ftft.id} />
        </Fragment>
      })}



      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>emojiカレンダー</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" flexWrap="wrap" gap={1}>

              {ftftList.filter(ftft => ftft.emoji !== undefined).map(ftft => {
                return <Text key={ftft.id} fontSize="2xl" onClick={() => {
                  setIsModalOpen(false)
                  // スクロール
                  document.querySelector(".title_" + format(ftft.createdAt, "yyyyMMdd"))?.scrollIntoView({ behavior: "smooth" })
                }}>{ftft.emoji}</Text>
              })
              }
            </Box>

          </ModalBody>

          <ModalFooter>
            <Button onClick={() => setIsModalOpen(false)}>閉じる</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box height="40px"></Box>
      <Box position="sticky" bottom="16px" right="0" alignSelf="end">
        <IconButton
          onClick={() => setIsModalOpen(true)}
          isRound
          size="lg"
          colorScheme='blue'
          aria-label='Search database'
          icon={<CalendarIcon />}
        />

      </Box>
    </>

  )
}

const CreatedAtLabel = memo(({ createdAt }: { createdAt: Date }) => {
  const [isRelative, setIsRelative] = useState(true)
  return <Text fontSize="sm" color="grey" onClick={() => setIsRelative(!isRelative)}>{
    isRelative ? formatRelative(createdAt, new Date(), { locale: ja }) : format(createdAt, "yyyy/MM/dd HH:mm:ss")

  }</Text>
})
