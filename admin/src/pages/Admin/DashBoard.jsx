import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import assets from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DashBoard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
  const {slotDateFormat} = useContext(AppContext)
  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="flex flex-col px-2 sm:px-4 md:px-6 lg:px-10 py-4">
        {/* Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {/* Doctors Box */}
          <div className="flex items-center gap-3 bg-white p-4 rounded border-2 border-gray-100 shadow-sm hover:scale-105 transition-all">
            <img className="w-12 sm:w-14" src={assets.doctor_icon} alt="" />
            <div>
              <p className="text-lg sm:text-xl font-semibold text-gray-600">
                {dashData.doctors}
              </p>
              <p className="text-sm text-gray-400">Doctors</p>
            </div>
          </div>

          {/* Appointments Box */}
          <div className="flex items-center gap-3 bg-white p-4 rounded border-2 border-gray-100 shadow-sm hover:scale-105 transition-all">
            <img className="w-12 sm:w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-lg sm:text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-sm text-gray-400">Appointments</p>
            </div>
          </div>

          {/* Patients Box */}
          <div className="flex items-center gap-3 bg-white p-4 rounded border-2 border-gray-100 shadow-sm hover:scale-105 transition-all">
            <img className="w-12 sm:w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-lg sm:text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-sm text-gray-400">Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="bg-indigo-200 rounded shadow-sm">
          <div className="flex items-center gap-2.5 px-4 py-4 border-b">
            <img src={assets.list_icon} className="w-6 h-6" alt="" />
            <p className="font-semibold text-lg sm:text-xl">Latest Bookings</p>
          </div>

          <div className="divide-y">
            {dashData.latestAppointment.map((item, index) => (
              <div
                key={index}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={item.docData?.image || "/default-avatar.png"}
                    alt=""
                  />
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      {item.docData?.name || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {slotDateFormat(item.slotDate)}
                    </p>
                  </div>
                </div>

                {item.cancelled ? (
                  <p className="text-red-500 text-xs font-medium">Cancelled</p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-6 sm:w-8 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DashBoard;
