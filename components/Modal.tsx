import {
  Modal as ChakraModal,
  ModalProps as ChakraModalProps,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text
} from '@chakra-ui/react'

interface ModalProps {
  title?: string
  text?: string
  cancelText?: string
  acceptText?: string
  isOpen: boolean
  onAccept: () => void
  onClose: () => void
  children?: React.ReactNode
}

export const Modal = (props: ModalProps) => {
  return (
    <>
      <ChakraModal isOpen={props.isOpen} onClose={props.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.title ? props.title : 'Delete Video'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{props.text ? props.text : 'Are you sure?'}</Text>
            {props.children}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={props.onClose}>
              {props.cancelText ? props.cancelText : 'Cancel'}
            </Button>
            <Button colorScheme="purple" onClick={props.onAccept}>
              {props.acceptText ? props.acceptText : 'Delete'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </ChakraModal>
    </>
  )
}
