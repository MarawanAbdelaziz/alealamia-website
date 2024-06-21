/* eslint-disable no-unused-vars */
import ShowCustomers from "./ShowCustomers/ShowCustomers";
import AddCustomers from "./AddCustomers/AddCustomers";
import { useState } from "react";
import BackButton from "../../components/BackButton";
import { Helmet } from "react-helmet";

function Customers() {
  // const [showOrAdd, setShowOrAdd] = useState(true)
  const [showOrAdd, setShowOrAdd] = useState(true);

  return (
    <div className="h-screen">
      <BackButton data={"/"} />
      <Helmet>
        <title>العملاء</title>
      </Helmet>
      <div className="w-[80%] mx-auto mb-5">
        <button
          onClick={() => setShowOrAdd(!showOrAdd)}
          className="mt-28 border py-1 px-3 rounded-md "
        >
          {showOrAdd ? "اضف عميل" : "بيانات  العملاء"}
        </button>
      </div>
      <div className="w-[80%] mx-auto ">
        {showOrAdd ? <ShowCustomers /> : <AddCustomers />}
      </div>
    </div>
  );
}
export default Customers;
