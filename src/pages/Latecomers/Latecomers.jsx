/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import BackButton from '../../components/BackButton'

function Latecomers() {
  const [customers, setCustomers] = useState(JSON.parse(localStorage.getItem('customers')) || [])
  const [latecomers, setLatecomers] = useState(JSON.parse(localStorage.getItem('latecomers')) || [])

  const now = new Date()
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${year}-${month}-${day}`
  }
  const formattedDate = formatDate(now)

  const subtractDays = (dateString) => {
    const date = new Date(dateString)
    date.setDate(date.getDate() - 5)
    return date.toISOString().split('T')[0]
  }

  useEffect(() => {
    const cust = []
    customers?.map((customer) => {
      cust.push({
        customer_id: customer.customer_id,
        name: customer.name,
        installments: customer?.installments?.map((installment) => {
          return {
            installment_id: installment.installment_id,
            installmentName: installment.installmentName,
            itemName: installment.itemName,
            installmentMonths: installment.installmentMonths.map((installmentMonth) => {
              let month = new Date(installmentMonth.month)
              month.setDate(month.getDate() + 5)
              return { month: month.toISOString().split('T')[0], payed: installmentMonth.payed }
            })
          }
        })
      })
    })
    localStorage.setItem('latecomers', JSON.stringify(cust))
    setLatecomers(cust)
  }, [])
  return (
    <div className="h-screen px-20 pt-20">
      <BackButton data={'/'} />
      <div dir="ltr" className=" overflow-y-scroll ">
        <div className="border my-5 mt-3 mb-10 py-5 px-4 text-center">
          <h2 className="text-2xl">صفحه المتاخرين</h2>
        </div>
        {latecomers?.map((latecomer) =>
          latecomer?.installments?.map(
            (installment) =>
              installment.installmentMonths.filter(
                (installmentMonth) =>
                  installmentMonth.month < formattedDate && !installmentMonth.payed
              ).length > 0 && (
                <div dir="rtl" key={latecomer.customer_id} className="border my-5 mx-3 py-4 px-4">
                  <div className="w-full flex mb-3">
                    <h3 className=" me-11">كود العميل : {latecomer.customer_id}</h3>
                    <h3 className=" me-auto">الاسم : {latecomer.name}</h3>
                  </div>
                  <div className="flex  w-full" key={installment.installment_id}>
                    <h3 className="mb-1 basis-[12%]">كود القسط: {installment.installment_id}</h3>
                    <h3 className="mb-1 basis-[25%]">اسم القسط: {installment.installmentName}</h3>
                    <h3 className="mb-1 basis-[25%]">اسم السلعه : {installment.itemName}</h3>
                    <h3 className="basis-[38%] flex">
                      التاخير :
                      {installment.installmentMonths
                        .filter(
                          (installmentMonth) =>
                            installmentMonth.month < formattedDate && !installmentMonth.payed
                        )
                        .map((installmentMonth) => (
                          <h3 key={installmentMonth.month} className="w-fit pe-1 ms-2 border-l">
                            {subtractDays(installmentMonth.month)}
                          </h3>
                        ))}
                    </h3>
                  </div>
                </div>
              )
          )
        )}
      </div>
    </div>
  )
}

export default Latecomers
