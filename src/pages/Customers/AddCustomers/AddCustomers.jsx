/* eslint-disable no-unused-vars */
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { object, string } from "yup";

function AddCustomers() {
  const [customers, setCustomers] = useState(
    JSON.parse(localStorage.getItem("customers")) || []
  );
  const [randomNum, setRandomNum] = useState();

  const validationSchema = object().shape({
    name: string().required("متسبش الاسم فاضي"),
    phone: string(),
    // .matches(/^01[0125][0-9]{8}$/, 'الرقم مكتوب غلط')
    // .notRequired()
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function randomFun() {
    let uniqueRandomNum;
    do {
      uniqueRandomNum = randomInt(1, customers.length + 2);
    } while (
      customers.some((customer) => customer.customer_id === uniqueRandomNum)
    );
    setRandomNum(uniqueRandomNum);
  }

  useEffect(() => {
    randomFun();
  }, []);

  const onSubmit = (data) => {
    const sameName = customers.filter((customer) => customer.name == data.name);
    if (sameName.length == 0) {
      const newData = { customer_id: randomNum, ...data };
      customers.push(newData);
      localStorage.setItem("customers", JSON.stringify(customers));
      console.log("Local :", JSON.parse(localStorage.getItem("customers")));
      Swal.fire({
        position: "center",
        icon: "success",
        title: "تم انشاء عميل جديد بنجاح",
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (sameName.length > 0) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "الاسم الي بتحاول تدخله موجود قبل كدا",
        showConfirmButton: false,
        timer: 1500,
      });
    }
    randomFun();
  };

  return (
    <div className="my-10 mx-5 text-center md:h-[64vh] lg:h-[77.6vh]">
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="mb-7 text-2xl">عميل جديد</h2>
        <p
          className={`border  w-fit  mx-auto border-red-600 rounded-md py-2 px-4 mb-5 ${
            errors?.name || errors?.phone ? "block" : "hidden"
          } `}
        >
          {errors?.name?.message}
          {errors?.phone?.message}
        </p>
        <div className="grid gap-5">
          <h4 className=""> كود العميل الجديد : {randomNum}</h4>
          <input
            className={`py-2 px-3 w-[50%] mx-auto focus:outline-none bg-transparent ${
              errors.name && "border-red-600"
            } border rounded-md placeholder:text-white`}
            placeholder="اسم العميل"
            type="text"
            {...register("name")}
          />
          <input
            className={`py-2 px-3 w-[50%] mx-auto focus:outline-none bg-transparent  ${
              errors.phone && "border-red-600"
            } border rounded-md placeholder:text-white`}
            placeholder="رقم الموبيل"
            type="number"
            {...register("phone")}
          />
          <button
            disabled={errors.name ? true : false}
            className={` ${
              errors.name ? "border-gray-500 text-gray-500" : ""
            } mx-auto py-2 px-2 border rounded-md`}
            type="submit"
          >
            ضيف عميل جديد
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCustomers;
