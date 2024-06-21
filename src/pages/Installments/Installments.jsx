import { useState } from 'react'
import AddInstallments from './AddInstallments/AddInstallments'
import PaymentOfInstallments from './PaymentOfInstallments/PaymentOfInstallments'
import Drawer from './Drawer/Drawer'
import AddToDrawer from './AddToDrawer/AddToDrawer'
import BackButton from '../../components/BackButton'

function Installments() {
  const [toggle, setToggle] = useState('AddInstallments')

  return (
    <div>
      <div
        className={`bg-custom ${toggle == 'PaymentOfInstallments' || toggle == 'AddToDrawer' ? 'h-screen' : ''}  text-center pt-28`}
      >
        <BackButton data={'/'} />
        <div className="flex mb-10 ">
          <button
            onClick={() => setToggle('AddInstallments')}
            className="block ms-28 me-5 text-xl border py-1 px-4 xl:py-1 xl:px-8 rounded-lg"
          >
            اضافه قسط
          </button>
          <button
            onClick={() => setToggle('PaymentOfInstallments')}
            className="block me-5 text-xl border py-1 px-4 xl:py-1 xl:px-8 rounded-lg"
          >
            دفع الاقساط
          </button>
          <button
            onClick={() => setToggle('AddToDrawer')}
            className="block me-5 text-xl border py-1 px-4 xl:py-1 xl:px-8 rounded-lg"
          >
            اضافه مصاريف
          </button>
          <button
            onClick={() => setToggle('Drawer')}
            className="block text-xl border py-1 px-4 xl:py-1 xl:px-8 rounded-lg"
          >
            الدرج
          </button>
        </div>
        <div className="w-full bg-white h-0.5"></div>
        <div>
          {toggle == 'AddInstallments' && <AddInstallments />}
          {toggle == 'PaymentOfInstallments' && <PaymentOfInstallments />}
          {toggle == 'AddToDrawer' && <AddToDrawer />}
          {toggle == 'Drawer' && <Drawer />}
        </div>
      </div>
    </div>
  )
}

export default Installments
