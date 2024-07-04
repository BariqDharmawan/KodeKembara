import { InterfaceResAPI } from 'Contracts/types'

const returnResponseFormat = ({ code, message }: InterfaceResAPI): InterfaceResAPI => {
  return {
    code,
    message,
  }
}

export { returnResponseFormat }
