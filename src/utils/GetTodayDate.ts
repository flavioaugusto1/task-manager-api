export function getTodayDate() {
    const date = new Date()
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.getDay().toString().padStart(2, '0')
    const year = date.getFullYear().toString()

    return new Date(`${year}-${month}-${day}`)
}
