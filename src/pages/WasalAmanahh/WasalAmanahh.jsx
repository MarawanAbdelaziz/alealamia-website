/* eslint-disable no-unused-vars */
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import Swal from "sweetalert2";
import BackButton from "../../components/BackButton";
import { Helmet } from "react-helmet";

function WasalAmanahh() {
  const [customers, setCustomers] = useState(
    JSON.parse(localStorage.getItem("customers")) || []
  );
  const [currentDate, setCurrentDate] = useState("");
  const [customerId, setCustomerId] = useState();
  const [randomNum, setRandomNum] = useState();
  const [errorCode, setErrorCode] = useState(false);

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  useEffect(() => {
    setCurrentDate(formattedDate);
  }, []);

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function randomFun(index) {
    let uniqueRandomNum;
    if (customers[index]?.wasalAmanah != null) {
      do {
        uniqueRandomNum = randomInt(
          1,
          customers[index]?.wasalAmanah.length + 2
        );
      } while (
        customers[index]?.wasalAmanah.some(
          (wasalAmanah) => wasalAmanah.wasalAmanah_id === uniqueRandomNum
        )
      );
      setRandomNum(uniqueRandomNum);
    } else {
      setRandomNum(1);
    }
  }

  function getCustomer(id) {
    const newId = customers.findIndex((customer) => customer.customer_id == id);
    setCustomerId(newId);
    randomFun(newId);
  }

  const validationSchema = object().shape({
    countryName: string().required("متسبش اسم البلد"),
    notebookNumber: string().required("متسبش الدفتر فاضي "),
  });
  const {
    setValue,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      countryName: "",
      notebookNumber: "",
      details: "",
      dateOfPurchase: "",
    },
  });

  useEffect(() => {
    if (watch("dateOfPurchase")) {
      setCurrentDate(watch("dateOfPurchase"));
    } else {
      setValue("dateOfPurchase", formattedDate);
    }
  }, [watch("dateOfPurchase")]);

  const onSubmit = (data) => {
    const newData = { wasalAmanah_id: randomNum, ...data };

    if (customerId != null) {
      if (customers[customerId].wasalAmanah == null) {
        customers[customerId].wasalAmanah = [newData];
      } else {
        customers[customerId].wasalAmanah = [
          ...customers[customerId].wasalAmanah,
          newData,
        ];
      }
      setErrorCode(false);
      localStorage.setItem("customers", JSON.stringify(customers));
      Swal.fire({
        position: "center",
        icon: "success",
        title: "تم انشاء وصل امانه جديد بنجاح",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      setErrorCode(true);
    }
  };

  return (
    <div className="h-screen">
      <BackButton data={"/"} />
      <Helmet>
        <title>وصلات الامانه</title>
      </Helmet>
      <div className="pt-24  mx-5 text-center">
        <h2 htmlFor="names" className="mb-7 text-2xl">
          ضيف وصل امانه
        </h2>
        <div
          className={`border w-fit mx-auto border-red-600 rounded-md py-2 px-4 mb-5 ${
            (customerId == null && errorCode) ||
            errors?.countryName ||
            errors?.notebookNumber
              ? "block"
              : "hidden"
          } `}
        >
          <h4>{errors?.countryName?.message}</h4>
          <h4>{errors?.notebookNumber?.message}</h4>
          {customerId == null && errorCode && <h4>متنساش تختار عميل</h4>}
        </div>

        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5 w-[60%] ms-28 text-right">
            <div className="flex ">
              <h3> اختار اسم العميل : </h3>
              <select
                className={`ms-4 px-2 py-1 bg-transparent border ${
                  customerId == null && errorCode && "border-red-600"
                } w-[40%] rounded-md focus:outline-none`}
                onChange={(e) => {
                  getCustomer(e.target.value);
                }}
                name="names"
                id="names"
                defaultValue=""
              >
                <option className="hidden" value="" disabled>
                  اختار عميلك
                </option>
                {customers.map((customer) => (
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
            <h4 className="">
              كود العميل :
              {customers[customerId]?.customer_id
                ? ` ${customers[customerId]?.customer_id}`
                : " 0"}
            </h4>
            <input
              className={`py-2 px-3 w-[50%] me-auto focus:outline-none bg-transparent ${
                errors?.installmentName && "border-red-600"
              } border rounded-md placeholder:text-white`}
              placeholder="اسم البلد"
              type="text"
              {...register("countryName")}
            />
            <input
              className={`py-2 px-3 w-[50%] me-auto focus:outline-none bg-transparent ${
                errors?.installmentName && "border-red-600"
              } border rounded-md placeholder:text-white`}
              placeholder="رقم الدفتر"
              type="number"
              {...register("notebookNumber")}
            />
            <textarea
              className={`py-2 px-3 w-[50%] me-auto focus:outline-none bg-transparent ${
                errors?.installmentName && "border-red-600"
              } border rounded-md placeholder:text-white`}
              placeholder="تفاصيل"
              type="text"
              {...register("details")}
            />

            <div className="flex">
              <h3> تاريخ اضافه الوصل : </h3>
              <input
                className="ms-4 bg-transparent border rounded-md py-0.5 px-2 focus:outline-none"
                type="date"
                value={currentDate}
                {...register("dateOfPurchase")}
              />
            </div>

            <button
              disabled={errors.name ? true : false}
              onClick={() => randomFun(customerId)}
              className={`mb-20 ${
                errors?.installmentName ||
                errors?.itemName ||
                errors?.itemPrice ||
                errors?.installmentPeriod ||
                errors?.payday
                  ? "border-gray-500 text-gray-500"
                  : ""
              } mx-auto py-2 px-2 border rounded-md`}
              type="submit"
            >
              ضيف وصل جديد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WasalAmanahh;
