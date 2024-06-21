/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { object, string } from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Swal from 'sweetalert2'

function AddInstallments() {
  const [customers, setCustomers] = useState(JSON.parse(localStorage.getItem('customers')) || [])
  const [drawers, setDrawers] = useState(JSON.parse(localStorage.getItem('drawers')) || [])
  const [customerId, setCustomerId] = useState()
  const [installmentPeriodId, setInstallmentPeriodId] = useState()
  const [total, setTotal] = useState()
  const [amountPerMonth, setAmountPerMonth] = useState()
  const [currentDate, setCurrentDate] = useState('')
  const [firstInstallmentDate, setFirstInstallmentDate] = useState('')
  const [search, setSearch] = useState('')
  const [errorCode, setErrorCode] = useState(false)
  const [randomNum, setRandomNum] = useState()
  const [randomNumDrawer, setRandomNumDrawer] = useState()
  const [currentDay, setCurrentDay] = useState('')
  const [firstDay, setFirstDay] = useState(JSON.parse(localStorage.getItem('firstDay')) || '')
  const [newDay, setNewDay] = useState(JSON.parse(localStorage.getItem('newDay')) || '')
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

  const Paydays = [1, 5, 10, 15, 20, 25]
  const installmentPeriods = [
    { period: 5, profit: '%10', profitRatio: 1.1 },
    { period: 10, profit: '%20', profitRatio: 1.2 },
    { period: 15, profit: '%30', profitRatio: 1.3 },
    { period: 20, profit: '%40', profitRatio: 1.4 }
  ]

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  function randomFun(index) {
    let uniqueRandomNum
    if (customers[index]?.installments != null) {
      do {
        uniqueRandomNum = randomInt(1, customers[index]?.installments.length + 2)
      } while (
        customers[index]?.installments.some(
          (installment) => installment.installment_id === uniqueRandomNum
        )
      )
      setRandomNum(uniqueRandomNum)
    } else {
      setRandomNum(1)
    }
  }

  useEffect(() => {
    randomFun()
    randomFunDrawer()
    setCurrentDay(formattedDate)
    if (firstDay == '') {
      setFirstDay(formattedDate)
    }
    if (newDay == '') {
      localStorage.setItem('newDay', JSON.stringify(formattedNewDate))
    }
  }, [])

  function getCustomer(id) {
    const newId = customers.findIndex((customer) => customer.customer_id == id)
    setCustomerId(newId)
    randomFun(newId)
  }

  function calc(totalCal, index) {
    setTotal(totalCal)
    const amountPerMonth = (totalCal / installmentPeriods[index].period).toFixed(2)
    setAmountPerMonth(amountPerMonth)
    setValue('total', totalCal)
    setValue('amountPerMonth', amountPerMonth)
    setValue('profitRatio', installmentPeriods[index].profit)
  }

  function getInstallmentPeriods() {
    const index = installmentPeriods.findIndex(
      (installmentPeriod) => installmentPeriod.period == getValues('installmentPeriod')
    )

    setInstallmentPeriodId(index)
    if (watch('downPayment')) {
      const totalCal = (
        (getValues('itemPrice') - getValues('downPayment')) *
        installmentPeriods[index].profitRatio
      ).toFixed(2)
      calc(totalCal, index)
    } else {
      const totalCal = (getValues('itemPrice') * installmentPeriods[index].profitRatio).toFixed(2)
      calc(totalCal, index)
    }
  }

  const validationSchema = object().shape({
    installmentName: string().required('متسبش اسم القسط'),
    itemName: string().required('متسبش اسم السلعه'),
    itemPrice: string().required('متسبش سعر السلعه'),
    installmentPeriod: string().required('متسبش فترة القسط'),
    payday: string().required('متنساش اليوم')
  })
  const {
    getValues,
    setValue,
    watch,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      installmentName: '',
      itemName: '',
      itemPrice: '',
      downPayment: '',
      installmentPeriod: '',
      countMonths: '',
      profitRatio: '',
      amountPerMonth: '',
      total: '',
      payday: '',
      dateOfPurchase: '',
      firstInstallmentDate: '',
      firstGuarantor: '',
      secondGuarantor: '',
      thirdGuarantor: '',
      fourthGuarantor: ''
    }
  })

  const onSubmit = (data) => {
    const installmentMonths = []
    const initialDate = new Date(data.firstInstallmentDate)

    for (let i = 1; i <= Number(data.installmentPeriod); i++) {
      const newDate = new Date(initialDate)
      newDate.setMonth(initialDate.getMonth() + i - 1)
      newDate.setDate(data.payday)
      const formattedDate = newDate.toISOString().split('T')[0]
      installmentMonths.push({
        id: i,
        amountPerMonth: data.amountPerMonth,
        month: formattedDate,
        payed: false
      })
    }

    const newData = { installment_id: randomNum, installmentMonths: installmentMonths, ...data }
    console.log(newData)
    if (customerId != null) {
      if (customers[customerId].installments == null) {
        customers[customerId].installments = [newData]
      } else {
        customers[customerId].installments = [...customers[customerId].installments, newData]
      }
      setErrorCode(false)
      localStorage.setItem('customers', JSON.stringify(customers))
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'تم انشاء قسط جديد بنجاح',
        showConfirmButton: false,
        timer: 1500
      })

      if (data.downPayment && putInDrawers) {
        putDrawers({
          customer_id: customers[customerId].customer_id,
          name: customers[customerId].name,
          installmentName: data.installmentName,
          downPayment: data.downPayment,
          dateOfPurchase: data.dateOfPurchase,
          payday: data.payday,
          installmentPeriod: data.installmentPeriod,
          amountPerMonth: data.amountPerMonth
        })
      }
    } else {
      setErrorCode(true)
    }
  }

  useEffect(() => {
    if (watch('itemPrice') && watch('installmentPeriod')) {
      setValue('countMonths', 0)
      getInstallmentPeriods()
    }
    if (watch('downPayment') && watch('itemPrice')) {
      if (watch('itemPrice') - watch('downPayment') == 0) {
        Swal.fire({
          position: 'center',
          icon: 'info',
          title: 'مينفعش المقدم يبقي نفس سعر السلعة',
          showConfirmButton: false,
          timer: 3000
        })
      } else if (watch('itemPrice') - watch('downPayment') < 0) {
        Swal.fire({
          position: 'center',
          icon: 'info',
          title: 'مينفعش المقدم يبقي اكبر من سعر السلعة',
          showConfirmButton: false,
          timer: 3000
        })
      } else {
        watch('itemPrice') - watch('downPayment')
      }
    }
  }, [watch('itemPrice'), watch('installmentPeriod'), watch('downPayment')])

  useEffect(() => {
    if (watch('dateOfPurchase')) {
      setCurrentDate(watch('dateOfPurchase'))
    } else {
      setValue('dateOfPurchase', formattedDate)
    }
    if (watch('firstInstallmentDate')) {
      setFirstInstallmentDate(watch('firstInstallmentDate'))
    } else {
      setValue('firstInstallmentDate', formattedDate)
    }
  }, [watch('dateOfPurchase'), watch('firstInstallmentDate')])

  function randomIntDrawer(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  function randomFunDrawer() {
    let uniqueRandomNum
    do {
      uniqueRandomNum = randomIntDrawer(1, drawers.length + 2)
    } while (drawers.some((drawer) => drawer.day_id === uniqueRandomNum))
    setRandomNumDrawer(uniqueRandomNum)
  }

  useEffect(() => {
    randomFunDrawer()
  }, [drawers])

  function putDrawers(data) {
    const downPayment = []
    if (currentDay == firstDay) {
      if (drawers.length == 0) {
        downPayment.push(data)
        const newData = { downPayment: downPayment }
        const newData1 = { day_id: randomNumDrawer, date: currentDate, ...newData }
        drawers.push(newData1)
      } else if (!drawers[drawers.length - 1]?.downPayment) {
        downPayment.push(data)
        drawers[drawers.length - 1].downPayment = downPayment
      } else {
        drawers[drawers.length - 1]?.downPayment.push(data)
      }
      localStorage.setItem('firstDay', JSON.stringify(currentDay))
      localStorage.setItem('drawers', JSON.stringify(drawers))
    } else if (currentDay == newDay || currentDay > newDay) {
      localStorage.setItem('newDay', JSON.stringify(formattedNewDate))
      setNewDay(formattedNewDate)
      downPayment.push(data)
      const newData = { downPayment: downPayment }
      const newData1 = { day_id: randomNumDrawer, date: currentDate, ...newData }
      drawers.push(newData1)
    } else if (!drawers[drawers.length - 1]?.downPayment) {
      downPayment.push(data)

      drawers[drawers.length - 1].downPayment = downPayment
    } else {
      drawers[drawers.length - 1]?.downPayment.push(data)
    }
    localStorage.setItem('drawers', JSON.stringify(drawers))
  }

  return (
    <div className="">
      <div className="mt-10  mx-5 text-center">
        <h2 htmlFor="names" className="mb-7 text-2xl">
          قسط جديد
        </h2>
        <div
          className={`border w-fit mx-auto border-red-600 rounded-md py-2 px-4 mb-5 ${(customerId == null && errorCode) || errors?.installmentName || errors?.itemName || errors?.itemPrice || errors?.installmentPeriod || errors?.payday ? 'block' : 'hidden'} `}
        >
          <h4>{errors?.installmentName?.message}</h4>
          <h4>{errors?.itemName?.message}</h4>
          <h4>{errors?.itemPrice?.message}</h4>
          <h4>{errors?.installmentPeriod?.message}</h4>
          <h4>{errors?.payday?.message}</h4>
          {customerId == null && errorCode && <h4>متنساش تختار عميل</h4>}
        </div>
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 w-[60%] ms-28 text-right">
            <input
              className={`py-0.5 px-3 ma-auto w-fit block mb-1 text-right focus:outline-none bg-transparent border rounded-md placeholder:text-white`}
              placeholder="ابحث عن العميل"
              type="text"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex ">
              <h3> اختار اسم العميل : </h3>
              <select
                className={`ms-4 px-2 py-1 bg-transparent border ${customerId == null && errorCode && 'border-red-600'} w-[40%] rounded-md focus:outline-none`}
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
                  ?.filter((customer) =>
                    customer.name.toLowerCase().includes(search.toLocaleLowerCase())
                  )
                  .map((customer) => (
                    <option className="bg-black " key={customer.name} value={customer.customer_id}>
                      {customer.name}
                    </option>
                  ))}
              </select>
            </div>
            <h4 className="">
              كود العميل :
              {customers[customerId]?.customer_id ? ` ${customers[customerId]?.customer_id}` : ' 0'}
            </h4>
            <input
              className={`py-2 px-3 w-[50%] me-auto focus:outline-none bg-transparent ${errors?.installmentName && 'border-red-600'} border rounded-md placeholder:text-white`}
              placeholder="اسم القسط"
              type="text"
              {...register('installmentName')}
            />
            <input
              className={`py-2 px-3 w-[50%] me-auto focus:outline-none bg-transparent ${errors?.itemName && 'border-red-600'} border rounded-md placeholder:text-white`}
              placeholder="اسم السلعه"
              type="text"
              {...register('itemName')}
            />
            <input
              className={`py-2 px-3 w-[50%] me-auto focus:outline-none bg-transparent ${errors?.itemPrice && 'border-red-600'} border rounded-md placeholder:text-white`}
              placeholder="سعر السلعه"
              type="number"
              {...register('itemPrice')}
            />
            <input
              className={`py-2 px-3 w-[50%] me-auto focus:outline-none bg-transparent border rounded-md placeholder:text-white`}
              placeholder="مقدم"
              type="number"
              {...register('downPayment')}
            />

            <div className="flex">
              <h3>فترة القسط : </h3>
              <select
                className={`ms-4 px-2 py-1 bg-transparent border ${errors?.installmentPeriod && 'border-red-600'} rounded-md focus:outline-none`}
                name="names"
                id="names"
                defaultValue=""
                {...register('installmentPeriod')}
              >
                <option className="hidden" value="" disabled>
                  اختار الفترة
                </option>
                {installmentPeriods?.map((installmentPeriod) => (
                  <option
                    className="bg-black "
                    key={installmentPeriod.period}
                    value={installmentPeriod.period}
                  >
                    {installmentPeriod.period} شهور / شهر
                  </option>
                ))}
              </select>
            </div>

            <h4 className="">
              نسبه الربح :
              <span className="ms-1">
                {installmentPeriodId != null
                  ? installmentPeriods[installmentPeriodId]?.profit
                  : '%0'}
              </span>
            </h4>
            <h4 className="">
              المبلغ في الشهر :
              <span className="ms-1">
                {installmentPeriodId != null && !isNaN(amountPerMonth) ? amountPerMonth : '%0'}
              </span>
            </h4>
            <h4 className="">
              الاجمالي :
              <span className="ms-1">
                {installmentPeriodId != null && !isNaN(total) ? total : '0'}
              </span>
            </h4>

            <div className="flex ">
              <h3> يوم الدفع : </h3>
              <select
                className={`ms-4 px-2 py-1 bg-transparent border ${errors?.payday && 'border-red-600'} rounded-md focus:outline-none`}
                name="names"
                id="names"
                defaultValue=""
                {...register('payday')}
              >
                <option className="hidden" value="" disabled>
                  اختار يوم
                </option>
                {Paydays?.map((Payday) => (
                  <option className="bg-black " key={Payday} value={Payday}>
                    {Payday}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex">
              <h3> تاريخ الشراء : </h3>
              <input
                className="ms-4 bg-transparent border rounded-md py-0.5 px-2 focus:outline-none"
                type="date"
                value={currentDate}
                {...register('dateOfPurchase')}
              />
            </div>

            <div className="flex">
              <h3> اول قسط : </h3>
              <input
                className="ms-4 bg-transparent border rounded-md py-0.5 px-2 focus:outline-none"
                type="date"
                value={firstInstallmentDate}
                {...register('firstInstallmentDate')}
              />
            </div>
            <input
              className={`py-2 px-3  me-auto focus:outline-none bg-transparent border rounded-md placeholder:text-white`}
              placeholder="اسم الضامن الاول"
              type="text"
              {...register('firstGuarantor')}
            />

            <input
              className={`py-2 px-3  me-auto focus:outline-none bg-transparent border rounded-md placeholder:text-white`}
              placeholder="اسم الضامن الثاني"
              type="text"
              {...register('secondGuarantor')}
            />
            <input
              className={`py-2 px-3  me-auto focus:outline-none bg-transparent border rounded-md placeholder:text-white`}
              placeholder="اسم الضامن الثالث"
              type="text"
              {...register('thirdGuarantor')}
            />
            <input
              className={`py-2 px-3  me-auto focus:outline-none bg-transparent border rounded-md placeholder:text-white`}
              placeholder="اسم الضامن الرابع"
              type="text"
              {...register('fourthGuarantor')}
            />
            <label
              onClick={() => setPutInDrawers(!putInDrawers)}
              className={` py-2 w-[20%] mt-5 px-2 border ${putInDrawers ? 'border-green-500' : 'border-red-500'} text-center cursor-pointer rounded-md me-4`}
            >
              احفظ في الدرج
            </label>
            <button
              disabled={errors.name ? true : false}
              onClick={() => randomFun(customerId)}
              className={`mb-20 ${errors?.installmentName || errors?.itemName || errors?.itemPrice || errors?.installmentPeriod || errors?.payday ? 'border-gray-500 text-gray-500' : ''} mx-auto py-2 px-2 border rounded-md`}
              type="submit"
            >
              ضيف قسط جديد
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddInstallments
