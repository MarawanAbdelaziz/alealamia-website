/* eslint-disable no-unused-vars */

import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

function Drawer() {
  const [drawers, setDrawers] = useState(
    JSON.parse(localStorage.getItem("drawers")) || []
  );

  return (
    <div className="mt-10 h-screen">
      <Helmet>
        <title>الدرج</title>
      </Helmet>
      <h2 className="text-2xl mb-10">الدرج</h2>
      <div className="grid grid-cols-6 border gap-4 mx-20 px-5 py-4">
        {drawers.map((drawer) => (
          <Link
            to={"/drawerdetails"}
            key={drawer.day_id}
            state={{ day_id: drawer.day_id }}
            className="border rounded-md py-2 text-center text-lg"
          >
            {drawer.date}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Drawer;
