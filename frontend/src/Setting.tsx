import { TimeIcon } from '@chakra-ui/icons';
import './App.css'
import { Box, Button, Container, IconButton, useToast } from "@chakra-ui/react"
import { Link, useNavigate } from 'react-router-dom';

export const Setting = () => {
  const toast = useToast()

  const navigate = useNavigate()

  return <Container maxW="md" display="flex" flexDirection="column" gap={2} justifyContent="space-between" height="100%" paddingY={4}>
    <Link to='/'>
      <Box textAlign="right"><IconButton
        isRound
        aria-label='Search database'
        icon={<TimeIcon />}
      /></Box>
    </Link>

    <Box display="flex" flexDirection="column" gap={4}>
      <Button onClick={async () => {
        navigate(`/?ftftAuthorization=${encodeURI(localStorage.getItem("authorization") || "")}`)
        toast({
          position: 'bottom',
          title: "この画面をホーム画面に追加しよう",
          description: "ログインが不要になります"
        })
      }}>
        ホーム画面にショートカットを作成
      </Button>

      <Button onClick={async () => {
        localStorage.removeItem("authorization")
        navigate("/login")
      }}>
        ログアウト
      </Button>
    </Box>
    <Box></Box>
  </Container>
}
