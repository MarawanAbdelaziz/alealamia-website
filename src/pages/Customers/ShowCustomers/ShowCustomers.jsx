/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Link } from 'react-router-dom'

function ShowCustomers() {
  const [customers, setCustomers] = useState(JSON.parse(localStorage.getItem('customers')) || [])
  const [search, setSearch] = useState('')

  function deleteCustomer(id) {
    const newData = customers.filter((customer) => customer.customer_id != id)
    setCustomers(newData)
    localStorage.setItem('customers', JSON.stringify(newData))
  }

  return (
    <div className={`my-10 mx-5`}>
      <input
        className={`py-2 px-3 mx-auto block mb-10 w-[50%] text-center focus:outline-none bg-transparent border rounded-md placeholder:text-white`}
        placeholder="ابحث عن العميل"
        type="text"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div dir="ltr" className=" overflow-y-scroll h-[51vh]">
        {customers
          ?.filter((customer) => customer.name.toLowerCase().includes(search.toLocaleLowerCase()))
          .map((customer) => (
            <div dir="rtl" key={customer.customer_id} className="border my-5 mx-3 flex py-4 px-4">
              <h3 className=" me-11">كود : {customer.customer_id}</h3>
              <h3 className=" me-auto">اسم : {customer.name}</h3>
              <Link
                to={'/customerdetails'}
                state={{ customer_id: customer.customer_id }}
                className="border border-green-500 me-5 rounded-md py-1 px-2"
              >
                تفاصيل العميل
              </Link>
              <button
                onClick={() => {
                  deleteCustomer(customer.customer_id)
                }}
                className="border border-red-600 rounded-md py-1 px-2"
              >
                امسح العميل
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ShowCustomers
