import { TimeIcon } from '@chakra-ui/icons';
import './App.css'
import { Box, Button, Container, IconButton } from "@chakra-ui/react"
import { Link, useNavigate } from 'react-router-dom';

export const Setting = () => {

  const navigate = useNavigate()

  return <Container maxW="md" display="flex" flexDirection="column" gap={2} justifyContent="space-between" height="100%" paddingY={4}>
    <Link to='/'>
      <Box textAlign="right"><IconButton
        isRound
        aria-label='Search database'
        icon={<TimeIcon />}
      /></Box>
    </Link>

    <Button onClick={async () => {
      localStorage.removeItem("authorization")
      navigate("/login")
    }}>
      ログアウト
    </Button>
    <Box></Box>
  </Container>
}
