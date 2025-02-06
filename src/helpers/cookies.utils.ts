import Cookies from 'js-cookie'

export const setCookie = (name: string, value: string, days: number = 14) => {
  Cookies.set(name, value, {
    expires: days,
    sameSite: 'strict',
    path: '/',
  })
}

export const getCookie = (name: string) => {
  return Cookies.get(name)
}
