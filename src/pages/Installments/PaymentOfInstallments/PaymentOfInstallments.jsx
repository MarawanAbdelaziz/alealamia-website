/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Swal from 'sweetalert2'

function PaymentOfInstallments() {
  const [customers, setCustomers] = useState(JSON.parse(localStorage.getItem('customers')) || [])
  const [customerId, setCustomerId] = useState()
  const [installmentId, setInstallmentId] = useState()
  const [search, setSearch] = useState('')
  const [btn, setBtn] = useState('')
  const [drawers, setDrawers] = useState(JSON.parse(localStorage.getItem('drawers')) || [])
  const [currentDay, setCurrentDay] = useState('')
  const [firstDay, setFirstDay] = useState(JSON.parse(localStorage.getItem('firstDay')) || '')
  const [newDay, setNewDay] = useState(JSON.parse(localStorage.getItem('newDay')) || '')
  const [randomNum, setRandomNum] = useState()
  const [currentDate, setCurrentDate] = useState('')
  const [putInDrawers, setPutInDrawers] = useState(true)

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
    setCustomers(JSON.parse(localStorage.getItem('customers')) || [])
    randomFun()
  }, [btn])

  function getCustomer(id) {
    const newId = customers.findIndex((customer) => customer.customer_id == id)
    setCustomerId(newId)
  }

  function getInstallment(id) {
    const newId = customers[customerId]?.installments?.findIndex(
      (installment) => installment.installment_id == id
    )
    setInstallmentId(newId)
  }

  const installments = customers[customerId]?.installments[installmentId]

  const { watch, register, handleSubmit } = useForm({
    defaultValues: { amountPerMonth: '' }
  })

  const data = {
    customer_id: customers[customerId]?.customer_id,
    name: customers[customerId]?.name,
    installmentName: installments?.installmentName,
    dateOfPurchase: installments?.dateOfPurchase,
    payday: installments?.payday,
    installmentPeriod: installments?.installmentPeriod,
    remainingMonths: installments?.installmentPeriod - installments?.countMonths,
    amountPerMonth: installments?.amountPerMonth
  }
  function putDrawers(currentMonth) {
    const installment = []

    data.currentMonth = currentMonth
    if (currentDay == firstDay) {
      if (drawers.length == 0) {
        installment.push(data)
        const newData = { installment: installment }
        const newData1 = { day_id: randomNum, date: currentDate, ...newData }
        drawers.push(newData1)
      } else if (!drawers[drawers.length - 1]?.installment) {
        installment.push(data)

        drawers[drawers.length - 1].installment = installment
      } else {
        drawers[drawers.length - 1]?.installment.push(data)
      }
      localStorage.setItem('firstDay', JSON.stringify(currentDay))
      localStorage.setItem('drawers', JSON.stringify(drawers))
    } else if (currentDay == newDay || currentDay > newDay) {
      localStorage.setItem('newDay', JSON.stringify(formattedNewDate))
      setNewDay(formattedNewDate)
      installment.push(data)
      const newData = { installment: installment }
      const newData1 = { day_id: randomNum, date: currentDate, ...newData }
      drawers.push(newData1)
    } else if (!drawers[drawers.length - 1]?.installment) {
      installment.push(data)

      drawers[drawers.length - 1].installment = installment
    } else {
      drawers[drawers.length - 1]?.installment.push(data)
    }
    localStorage.setItem('drawers', JSON.stringify(drawers))
    console.log('drawers', drawers)
  }

  function payNowBtn() {
    const customer = customers[customerId]
    const installment = customer.installments[installmentId]
    const countMonths = customers[customerId].installments[installmentId].countMonths
    if (countMonths < installment.installmentPeriod) {
      customers[customerId].installments[installmentId].installmentMonths[countMonths].paydayDate =
        formattedDate

      customers[customerId].installments[installmentId].installmentMonths[countMonths].payed = true
      customers[customerId].installments[installmentId].countMonths += 1

      localStorage.setItem('customers', JSON.stringify(customers))
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'تم دفع القسط بنجاح',
        showConfirmButton: false,
        timer: 2000
      })
      if (putInDrawers) {
        putDrawers(installments?.installmentMonths[countMonths]?.amountPerMonth)
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'القسط خلص خلاص',
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  const countMonths = customers[customerId]?.installments?.[installmentId]?.countMonths

  const amountPerMonth =
    customers[customerId]?.installments?.[installmentId]?.installmentMonths[countMonths]
      ?.amountPerMonth

  const onSubmit = (data) => {
    const installment = customers[customerId]?.installments[installmentId]
    if (countMonths < installment.installmentPeriod) {
      if (parseFloat(data.amountPerMonth) == parseFloat(amountPerMonth)) {
        payNowBtn()
      } else if (
        parseFloat(data.amountPerMonth) < parseFloat(amountPerMonth) ||
        parseFloat(data.amountPerMonth) > parseFloat(amountPerMonth)
      ) {
        if (
          customers[customerId].installments[installmentId].installmentPeriod !=
          customers[customerId].installments[installmentId].countMonths + 1
        ) {
          customers[customerId].installments[installmentId].installmentMonths[
            countMonths + 1
          ].amountPerMonth = (
            parseFloat(
              customers[customerId]?.installments[installmentId]?.installmentMonths[countMonths + 1]
                ?.amountPerMonth
            ) +
            parseFloat(amountPerMonth) -
            parseFloat(data.amountPerMonth)
          ).toFixed(2)
          customers[customerId].installments[installmentId].installmentMonths[
            countMonths
          ].amountPerMonth = parseFloat(data.amountPerMonth)
          customers[customerId].installments[installmentId].installmentMonths[
            countMonths
          ].paydayDate = formattedDate
          customers[customerId].installments[installmentId].installmentMonths[countMonths].payed =
            true
          customers[customerId].installments[installmentId].countMonths += 1
          localStorage.setItem('customers', JSON.stringify(customers))
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'تم دفع القسط بنجاح',
            showConfirmButton: false,
            timer: 2000
          })
          if (putInDrawers) {
            putDrawers(watch('amountPerMonth'))
          }
        } else {
          if (
            parseFloat(
              customers[customerId]?.installments[installmentId]?.installmentMonths[countMonths]
                ?.amountPerMonth
            ) < parseFloat(data.amountPerMonth)
          ) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'المبلغ دا اكبر من القسط الاخير',
              showConfirmButton: false,
              timer: 4000
            })
          } else if (
            parseFloat(
              customers[customerId]?.installments[installmentId]?.installmentMonths[countMonths]
                ?.amountPerMonth
            ) > parseFloat(data.amountPerMonth)
          ) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'المبلغ دا اصغر من القسط الاخير',
              showConfirmButton: false,
              timer: 4000
            })
          }
        }
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'القسط خلص خلاص',
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  return (
    <div>
      <div className="mt-10  mx-5 text-center">
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 w-[60%] ms-32 text-right">
            <div className="اختار العميل">
              <input
                className={`py-0.5 px-3 ma-auto w-fit block mb-1 text-right focus:outline-none bg-transparent border rounded-md placeholder:text-white`}
                placeholder="ابحث عن العميل"
                type="text"
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex mt-10">
                <select
                  className={` px-2 py-1 bg-transparent border {customerId == null && errorCode && 'border-red-600'} w-[40%] rounded-md focus:outline-none`}
                  onChange={(e) => {
                    getCustomer(e.target.value)
                  }}
                  name="names"
                  id="names"
                  defaultValue=""
                >
                  <option className="hidden" value="" disabled>
                    اختار عميلك
                  </option>
                  {customers
                    .filter((customer) => customer.installments && customer.installments.length > 0)
                    .filter((customer) =>
                      customer.name.toLowerCase().includes(search.toLocaleLowerCase())
                    )
                    .map((customer) => (
                      <option
                        className="bg-black "
                        key={customer.name}
                        value={customer.customer_id}
                      >
                        {customer.name}
                      </option>
                    ))}
                </select>
              </div>
              <h4 className="mt-5">
                كود العميل :
                {customers[customerId]?.customer_id
                  ? ` ${customers[customerId]?.customer_id}`
                  : ' 0'}
              </h4>
            </div>

            <div className="اختار القسط">
              <div className="flex ">
                <select
                  className={` px-2 py-1 bg-transparent border {customerId == null && errorCode && 'border-red-600'} w-[40%] rounded-md focus:outline-none`}
                  onChange={(e) => {
                    getInstallment(e.target.value)
                  }}
                  name="names"
                  id="names"
                  defaultValue=""
                >
                  <option className="hidden" value="" disabled>
                    اختار القسط
                  </option>
                  {customers[customerId]?.installments?.map((installment) => (
                    <option
                      className="bg-black "
                      key={installment.installment_id}
                      value={installment.installment_id}
                    >
                      {installment.installmentName}
                    </option>
                  ))}
                </select>
              </div>

              {customerId != null && installmentId != null && (
                <div className="mt-8">
                  <h4>
                    كود القسط :
                    {installments?.installment_id ? ` ${installments?.installment_id}` : ' 0'}
                  </h4>

                  <h4>
                    الشهر الحالي :
                    {installments?.installmentMonths[countMonths]?.amountPerMonth
                      ? installments?.installmentMonths[countMonths]?.amountPerMonth
                      : ' القسط خلص'}
                  </h4>

                  <div className="flex items-center mt-5">
                    <button
                      disabled={watch('amountPerMonth') == '' ? false : true}
                      onClick={() => {
                        payNowBtn()
                        setTimeout(() => {
                          setBtn(!btn)
                        }, 100)
                      }}
                      className={` py-2 px-2 border ${watch('amountPerMonth') != '' && 'border-gray-600 text-gray-600'} rounded-md me-4`}
                    >
                      المبلغ كامل
                    </button>
                    <h5>او</h5>
                    <input
                      className={`py-2 px-3 ms-4 focus:outline-none bg-transparent border rounded-md placeholder:text-white`}
                      placeholder="مبلغ اخر"
                      type="number"
                      step="0.1"
                      {...register('amountPerMonth')}
                    />
                  </div>
                </div>
              )}
            </div>
            <label
              onClick={() => setPutInDrawers(!putInDrawers)}
              className={` py-2 w-[20%] mt-5 px-2 border ${putInDrawers ? 'border-green-500' : 'border-red-500'} text-center  cursor-pointer rounded-md me-4`}
            >
              احفظ في الدرج
            </label>
            <button
              disabled={watch('amountPerMonth') == '' ? true : false}
              className={`mb-20 mx-auto py-2 px-2 border ${watch('amountPerMonth') == '' && 'border-gray-600 text-gray-600'} rounded-md`}
              type="submit"
              onClick={() => {
                setTimeout(() => {
                  setBtn(!btn)
                }, 100)
              }}
            >
              ادفع
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentOfInstallments
