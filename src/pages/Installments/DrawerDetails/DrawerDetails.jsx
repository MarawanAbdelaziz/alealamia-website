/* eslint-disable no-unused-vars */
import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import BackButton from "../../../components/BackButton";
import { Helmet } from "react-helmet";

function DrawerDetails() {
  const componentRef = useRef();

  const applyTemporaryStyles = (element) => {
    element.style.padding = "20px";
  };

  const revertTemporaryStyles = (element) => {
    element.style.padding = "";
  };

  const handleSavePdf = async () => {
    const element = componentRef.current;

    applyTemporaryStyles(element);

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    revertTemporaryStyles(element);

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let position = 0;
    while (position < imgHeight) {
      const pageCanvas = document.createElement("canvas");
      const pageContext = pageCanvas.getContext("2d");
      pageCanvas.width = canvas.width;
      pageCanvas.height = canvas.height;

      pageContext.drawImage(
        canvas,
        0,
        position * (canvas.width / imgWidth),
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const pageImgData = pageCanvas.toDataURL("image/png");
      pdf.addImage(pageImgData, "PNG", 0, 0, imgWidth, imgHeight);
      position += pdfHeight;

      if (position < imgHeight) {
        pdf.addPage();
      }
    }

    pdf.save(`درج بتاريخ ${drawers[drawerId]?.date}.pdf`);
  };

  const [drawers, setDrawers] = useState(
    JSON.parse(localStorage.getItem("drawers")) || []
  );
  let { state } = useLocation();
  const [drawerId, setDrawerId] = useState();

  function getDrawer(id) {
    const newId = drawers.findIndex((drawer) => drawer.day_id == id);
    setDrawerId(newId);
  }
  useEffect(() => {
    getDrawer(state.day_id);
  }, []);

  let sum = 0;
  let other = 0;
  let total = 0;

  drawers[drawerId]?.installment?.map(
    (installment) => (sum += Number(installment.currentMonth))
  );
  drawers[drawerId]?.downPayment?.map(
    (downPayment) => (sum += Number(downPayment.downPayment))
  );
  drawers[drawerId]?.drawer?.map((dr) => (other += Number(dr.price)));

  total = sum - other;

  return (
    <div className="bg-white  w-fit mx-auto">
      <BackButton data={"/installments"} />
      <Helmet>
        <title>{` درج بتاريخ ${drawers[drawerId]?.date}`} </title>
      </Helmet>
      <div className="pt-28 py-10 text-black ">
        <div ref={componentRef} className="h-fit">
          <h2 className="text-2xl mb-10 text-center">
            تاريخ اليوم : {drawers[drawerId]?.date}{" "}
          </h2>
          <div className="mb-5">
            {drawers[drawerId]?.installment && (
              <div className="الاقساط">
                <h3 className="mb-3 ms-6 text-lg font-medium"> الأقساط : </h3>
                <div
                  className={`mx-6 border border-black px-2 flex font-semibold w-fit `}
                >
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[85px]">
                    كود العميل
                  </h3>
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[230px] ">
                    اسم العميل
                  </h3>
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[230px] ">
                    اسم القسط
                  </h3>
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[100px] ">
                    تاريخ الشراء
                  </h3>
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[75px]">
                    {" "}
                    يوم الدفع{" "}
                  </h3>
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[85px] ">
                    {" "}
                    عدد الشهور
                  </h3>
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[110px] ">
                    الشهور المتبقية
                  </h3>
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[110px] ">
                    المبلغ الشهري
                  </h3>
                  <h3 className="py-2 ps-2 w-[110px]"> المدفوع </h3>
                </div>
                {drawers[drawerId]?.installment?.map((installment) => (
                  <div
                    key={installment.customer_id}
                    className="mx-6 border border-black px-2 flex font-semibold w-fit"
                  >
                    <h3 className="py-2 border-l border-black pe-2 me-2 w-[85px]">
                      {installment.customer_id}
                    </h3>
                    <h3 className="py-2 border-l border-black pe-2 me-2 w-[230px]">
                      {installment.name}
                    </h3>
                    <h3 className="py-2 border-l border-black pe-2 me-2 w-[230px]">
                      {installment.installmentName}
                    </h3>
                    <h3 className="py-2 border-l border-black pe-2 me-2 w-[100px]">
                      {installment.dateOfPurchase}
                    </h3>
                    <h3 className="py-2 border-l border-black pe-2 me-2 w-[75px]">
                      {installment.payday}
                    </h3>
                    <h3 className="py-2 border-l border-black pe-2 me-2  w-[85px]">
                      {installment.installmentPeriod}
                    </h3>
                    <h3 className="py-2 border-l border-black pe-2 me-2 w-[110px]">
                      {installment.remainingMonths}
                    </h3>
                    <h3 className="py-2 border-l border-black pe-2 me-2 w-[110px]">
                      {installment.amountPerMonth}
                    </h3>
                    <h3 className="py-2 ps-2 w-[110px]">
                      {installment.currentMonth}
                    </h3>
                  </div>
                ))}
              </div>
            )}

            {drawers[drawerId]?.downPayment && (
              <div className="المقدم mt-20">
                <h3 className="mb-3 ms-6 text-lg font-medium"> المقدم : </h3>
                <div className="mx-6 border border-black px-2 flex font-semibold w-fit">
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[85px]">
                    كود العميل
                  </h3>
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[230px]">
                    اسم العميل
                  </h3>
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[230px]">
                    اسم القسط
                  </h3>
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[100px]">
                    مقدم
                  </h3>
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[110px]">
                    المبلغ الشهري
                  </h3>
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[85px]">
                    {" "}
                    عدد الشهور
                  </h3>
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-[75px]">
                    {" "}
                    يوم الدفع{" "}
                  </h3>
                  <h3 className="py-2 ps-2 w-[100px]"> تاريخ الشراء </h3>
                </div>
                {drawers[drawerId]?.downPayment?.map((downPayment) => (
                  <div
                    key={downPayment?.customer_id}
                    className="mx-6 border border-black px-2 flex font-semibold w-fit"
                  >
                    <h3 className="py-2 border-l border-black pe-2 me-2 w-[85px]">
                      {downPayment?.customer_id}
                    </h3>
                    <h3 className="py-2 border-l border-black pe-2 me-2 w-[230px]">
                      {downPayment?.name}
                    </h3>
                    <h3 className="py-2 border-l border-black pe-2 me-2 w-[230px]">
                      {downPayment?.installmentName}
                    </h3>
                    <h3 className="py-2 border-l border-black pe-2 me-2  w-[100px]">
                      {downPayment?.downPayment}
                    </h3>
                    <h3 className="py-2 border-l border-black pe-2 me-2  w-[110px]">
                      {downPayment?.amountPerMonth}
                    </h3>
                    <h3 className="py-2 border-l border-black pe-2 me-2 w-[85px]">
                      {downPayment?.installmentPeriod}
                    </h3>
                    <h3 className="py-2 border-l border-black pe-2 me-2 w-[75px]">
                      {downPayment?.payday}
                    </h3>

                    <h3 className="py-2 ps-2 w-[100px]">
                      {downPayment?.dateOfPurchase}
                    </h3>
                  </div>
                ))}
              </div>
            )}

            {drawers[drawerId]?.drawer && (
              <div className="مصادر اخري">
                <h3 className="mb-3 ms-6 text-lg font-medium mt-20 ">
                  {" "}
                  مصادر اخري :{" "}
                </h3>
                <div className="mx-6 border border-black px-2 flex font-semibold w-fit ">
                  <h3 className="py-2 border-l border-black pe-2 me-2 w-36 ">
                    الاسم
                  </h3>
                  <h3 className="py-2 ps-2 w-96"> السعر </h3>
                </div>
                {drawers[drawerId]?.drawer?.map((dr) => (
                  <div
                    key={drawers[drawerId].day_id}
                    className="mx-6 border border-black px-2 flex font-semibold w-fit "
                  >
                    <h3 className="py-2 border-l border-black pe-2 me-2 w-36 ">
                      {dr.name}
                    </h3>
                    <h3 className="py-2 ps-2 w-96"> {dr.price} </h3>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-3 mt-10 ms-6 text-xl font-semibold">
            <h4>اجمالي الدرج : {total}</h4>
          </div>
        </div>
        <button
          className={`block text-lg mt-10 mx-auto  py-2 px-10 border border-black rounded-md`}
          onClick={handleSavePdf}
        >
          احفظ في ملف PDF
        </button>
      </div>
    </div>
  );
}

export default DrawerDetails;
