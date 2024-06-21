/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

function AddToDrawer() {
  const [drawers, setDrawers] = useState(JSON.parse(localStorage.getItem('drawers')) || [])
  const [currentDay, setCurrentDay] = useState('')
  const [firstDay, setFirstDay] = useState(JSON.parse(localStorage.getItem('firstDay')) || '')
  const [newDay, setNewDay] = useState(JSON.parse(localStorage.getItem('newDay')) || '')
  const [randomNum, setRandomNum] = useState()
  const [currentDate, setCurrentDate] = useState('')

  const now = new Date()
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }
  const formattedDate = formatDate(now)

  const nextDay = new Date(now)
  nextDay.setDate(now.getDate() + 1)
  const formattedNewDate = formatDate(nextDay)

  useEffect(() => {
    setCurrentDay(formattedDate)
    if (firstDay == '') {
      setFirstDay(formattedDate)
    }
    if (newDay == '') {
      localStorage.setItem('newDay', JSON.stringify(formattedNewDate))
    }
    randomFun()
    setCurrentDate(formattedDate)
  }, [])

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      price: ''
    }
  })

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  function randomFun() {
    let uniqueRandomNum
    do {
      uniqueRandomNum = randomInt(1, drawers.length + 2)
    } while (drawers.some((drawer) => drawer.day_id === uniqueRandomNum))
    setRandomNum(uniqueRandomNum)
  }

  useEffect(() => {
    randomFun()
  }, [drawers])

  const drawer = []

  const onSubmit = (data) => {
    if (currentDay == firstDay) {
      if (drawers.length == 0) {
        drawer.push(data)
        const newData = { drawer }
        const newData1 = { day_id: randomNum, date: currentDate, ...newData }
        drawers.push(newData1)
      } else if (!drawers[drawers.length - 1]?.drawer) {
        drawer.push(data)
        drawers[drawers.length - 1].drawer = drawer
      } else {
        drawers[drawers.length - 1]?.drawer.push(data)
      }
      localStorage.setItem('firstDay', JSON.stringify(currentDay))
      localStorage.setItem('drawers', JSON.stringify(drawers))
    } else if (currentDay == newDay || currentDay > newDay) {
      localStorage.setItem('newDay', JSON.stringify(formattedNewDate))
      setNewDay(formattedNewDate)
      drawer.push(data)
      const newData = { drawer }
      const newData1 = { day_id: randomNum, date: currentDate, ...newData }
      drawers.push(newData1)
    } else if (!drawers[drawers.length - 1]?.drawer) {
      drawer.push(data)
      drawers[drawers.length - 1].drawer = drawer
    } else {
      drawers[drawers.length - 1]?.drawer.push(data)
    }
    localStorage.setItem('drawers', JSON.stringify(drawers))
    console.log(drawers)
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'تم الاضافة ',
      showConfirmButton: false,
      timer: 2000
    })
  }

  return (
    <div>
      <h2 className="mt-10 text-2xl">اضافه مصاريف</h2>
      <div className="w-[60%] ms-32">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className={`block mt-16 me-auto py-2 px-3 focus:outline-none bg-transparent border rounded-md placeholder:text-white`}
            type="text"
            required
            placeholder="الاسم"
            {...register('name')}
          />

          <input
            className={`block mt-10 me-auto py-2 px-3  focus:outline-none bg-transparent border rounded-md placeholder:text-white`}
            required
            type="number"
            placeholder="السعر"
            {...register('price')}
          />

          <button
            className={`block mt-16 text-lg me-auto py-2 px-10 border rounded-md`}
            type="submit"
          >
            اضافة
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddToDrawer
