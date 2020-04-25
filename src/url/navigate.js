import { history } from './history'

export const navigate = (id) => {
  history.append(id)
}
